"use client";

import { useEffect, useRef, useState, type CSSProperties, type SubmitEvent } from "react";
import { useRouter } from 'next/navigation';
import { faCheck, faHeadset, faPaperPlane, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "@/src/ui/menu/chat-panel/chat-panel.css";
import ApiChatV1 from "@/src/ui/menu/chat-panel/v1-flow/ApiChatV1";
import ApiChatV2 from "@/src/ui/menu/chat-panel/v2-flow/ApiChatV2";
import { useAppContext } from "@/src/lib/util/app-contex";
import { ChatMessage, ChatPanelProps } from "@/src/ui/menu/chat-panel/chat-panel.definition";
import { useAppDispatch } from "@/src/lib/util/redux-provider";
import { setTotalCart } from "@/src/lib/util/redux-provider/app-slice";
import { chatReqStatusFormated, ChatRequestStatus, ChatStreamOptionList, ChatStreamResponse } from "@/src/lib/route/chat/v1/chat.definition";

export default function ChatPanel(props: ChatPanelProps) {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const {
        isChatPanelOpen,
        setIsChatPanelOpen,
        welcomeMessage,
        chatVersion,
        setChatVersion,
        delay,
        setDelay
    } = useAppContext();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [messageDraft, setMessageDraft] = useState("");
    const [edgeStyles, setEdgeStyles] = useState<Record<string, CSSProperties>>({});
    const [inputTextDisabled, setInputTextDisabled] = useState(false);
    const [chatInProgress, setChatInProgress] = useState(false);
    const [chatStreamOptions, setChatStreamOptions] = useState<undefined | ChatStreamOptionList[]>(undefined);
    const [chatOptionQuestion, setChatOptionQuestion] = useState<ChatMessage | undefined>(undefined);
    const [chatVersionError, setChatVersionError] = useState<string | undefined>(undefined);
    const [chatVersionUpdating, setChatVersionUpdating] = useState(false);
    const [delayUpdating, setDelayUpdating] = useState(false);
    const [delayError, setDelayError] = useState<string | undefined>(undefined);

    const [sendingStatus, setSendingStatus] = useState<string | undefined>(undefined);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const messageInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const messagesContainer = messagesContainerRef.current;
        if (isChatPanelOpen && messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }, [isChatPanelOpen, messages, props.messages, inputTextDisabled, chatInProgress]);

    useEffect(() => {
        if (isChatPanelOpen && !inputTextDisabled) {
            messageInputRef.current?.focus();
            resetV1Flow();
            console.log("dbg resetv1Flow")
        }
    }, [isChatPanelOpen, inputTextDisabled]);

    async function changeChatOpen(nextOpen: boolean) {
        setIsChatPanelOpen(nextOpen);

        fetch("/api/chat/panel", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                isChatPanelOpen: nextOpen
            })
        });
    }

    async function changeChatVersion(nextChatVersion: "v1" | "v2") {
        resetV1Flow();
        setChatVersionError(undefined);
        setChatVersionUpdating(true);
        try {
            await setChatVersion(nextChatVersion);
        } catch (error) {
            console.error("chat-panel - changeChatVersion - failed to update chat version", error);
            setChatVersionError("Unable to change chat version. Please try again.");
        } finally {
            setChatVersionUpdating(false);
        }
    }

    async function changeChatDelay(nextDelay: boolean) {
        setDelayError(undefined);
        setDelayUpdating(true);
        try {
            await setDelay(nextDelay);
        } catch (error) {
            console.error("chat-panel - changeChatDelay - failed to update chat delay", error);
            setDelayError("Unable to update delay. Please try again.");
        } finally {
            setDelayUpdating(false);
        }
    }

    const chatMessages: ChatMessage[] = [];
    props.messages.forEach(m => {
        chatMessages.push({
            content: m.message,
            role: m.role as "user" | "assistant"
        })
    });

    async function sendMessage(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        const message = messageDraft.trim();
        if (!message || chatInProgress) {
            return;
        }

        setMessageDraft("");
        await sendChatMessage(message);
    }

    async function chooseChatStreamOption(option: ChatStreamOptionList) {
        setChatStreamOptions(undefined);
        setChatOptionQuestion(undefined);
        await sendChatMessage(option.value);
    }

    function cancelChatStreamOptions() {
        setChatStreamOptions(undefined);
        setChatOptionQuestion(undefined);
        setInputTextDisabled(false);
    }

    function resetV1Flow () {
        setEdgeStyles((currentStyles) => ({
            ...currentStyles,
            "user-to-cs": { strokeWidth: 0 },
            "cs-to-gemini": { strokeWidth: 0 },
            "gemini-to-cs": { strokeWidth: 0 },
            "cs-to-llm": { strokeWidth: 0 },
            "llm-to-cs": { strokeWidth: 0 },
            "cs-to-cart-edit": { strokeWidth: 0 },
            "cs-to-cart-add": { strokeWidth: 0 },
            "cs-to-cart-delete": { strokeWidth: 0 },
            "cs-to-page-nav": { strokeWidth: 0 },
            "cs-to-default-response": { strokeWidth: 0 },
            "cs-to-describe-task": { strokeWidth: 0 },
            "cs-to-food-suggest": { strokeWidth: 0 },
            "cs-to-aq": { strokeWidth: 0 },
        }));
    }

    async function sendChatMessage(message: string) {
        if (!message || chatInProgress) {
            return;
        }

        resetV1Flow();
        setMessages((currentMessages) => [...currentMessages, { role: "user", content: message }]);
        setChatStreamOptions(undefined);
        setChatOptionQuestion(undefined);
        setInputTextDisabled(true);
        setChatInProgress(true);

        try {
            setSendingStatus("Please wait...");
            const response = await fetch(`/api/chat/${chatVersion}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message })
            });

            if (response && response.body) {
                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let buffer = "";
                while (true) {
                    const { value, done } = await reader.read();
                    if (done) {
                        break;
                    }

                    buffer += decoder.decode(value, { stream: true });
                    const events = buffer.split("\n\n");
                    buffer = events.pop() ?? "";

                    for (const eventText of events) {
                        let data = "";
                        for (const line of eventText.split("\n")) {
                            if (line.startsWith("data: ")) {
                                data += line.slice(6);
                            }
                        }
  
                        if (!data) continue;
                        const payload: ChatStreamResponse = JSON.parse(data);
                        const replies = payload.replies;
                        const action = payload.action;
                        const totalCart = payload.totalCart;
                        const option = payload.option;
                        const status = payload.status;
                        const v1Flow = payload.v1Flow;

                        if (v1Flow) {
                            setEdgeStyles((currentStyles) => ({
                                ...currentStyles,
                                [v1Flow]: { strokeWidth: 5 },
                            }));
                        }

                        if (status) {
                            setSendingStatus(chatReqStatusFormated(status));
                            if (status === ChatRequestStatus.DONE) {
                                setInputTextDisabled(false);
                                setChatInProgress(false);
                            }
                        }

                        if (option && option.options.length > 0) {
                            setInputTextDisabled(true);
                            const question: ChatMessage = {
                                role: "assistant",
                                content: option.message
                            };
                            setMessages((currentMessages) => [...currentMessages, question]);
                            setChatOptionQuestion(question);
                            setChatStreamOptions(option.options);
                        } else if (replies && replies.length > 0) {
                            for (let i = 0; i < replies.length; i++) {
                                setMessages((currentMessages) => [
                                    ...currentMessages,
                                    {
                                        role: "assistant",
                                        content: replies[i]
                                    },
                                ]);
                            }
                        }

                        if (totalCart || totalCart === 0) {
                            dispatch(setTotalCart(totalCart));
                        }

                        if (action) {
                            if (action === "MENU") {
                                router.push("/menu");
                                router.refresh();
                            } else if (action === "CART") {
                                router.push("/cart");
                                router.refresh();
                            } else if (action === "CART_FULL_REFRESH") {
                                window.location.href = "/cart";
                            }
                        }
                    }
                }
            }
        } catch (e) {
            console.error(`chat-panel - sendChatMessage - failed to send chat message ${e}`);
        }
    }

    return (
        <div className="start-chat">
            {isChatPanelOpen && (
                <div className={`start-chat-flow-panel start-chat-flow-panel-${chatVersion}`}>
                    {chatVersion === "v1" && <ApiChatV1 edgeStyles={edgeStyles} />}
                    {chatVersion === "v2" && <ApiChatV2 />}
                </div>
            )}
            {isChatPanelOpen && (
                <section className="start-chat-panel" role="dialog" aria-label="Customer service chat">
                    <header className="start-chat-header">
                        <div className="start-chat-agent-icon" aria-hidden="true">
                            <FontAwesomeIcon icon={faHeadset} />
                        </div>
                        <div className="start-chat-agent">
                            <h3>AI Assistant</h3>
                            <span><span className="start-chat-status" />We usually reply in a few minutes</span>
                        </div>
                        <button
                            type="button"
                            className="start-chat-close"
                            aria-label="Close chat"
                            onClick={() => void changeChatOpen(false)}
                        >
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                    </header>
                    <div
                        ref={messagesContainerRef}
                        className="start-chat-messages"
                        aria-live="polite"
                        aria-busy={chatInProgress}
                    >
                        <span className="start-chat-time">Today</span>
                        <div className="start-chat-message">
                            {welcomeMessage}
                        </div>
                        {chatMessages.map((message, index) => (
                            <div
                                key={index}
                                className={`start-chat-message start-chat-message-${message.role}`}>
                                {message.content}
                            </div>
                        ))}

                        {messages.map((message, index) => (
                            message === chatOptionQuestion ? (
                                <div key={index} className="start-chat-option">
                                    <div className="start-chat-message start-chat-message-assistant">
                                        {message.content}
                                    </div>
                                    <button
                                        type="button"
                                        className="start-chat-option-cancel"
                                        aria-label="Cancel options"
                                        title="Cancel options"
                                        disabled={chatInProgress}
                                        onClick={cancelChatStreamOptions}
                                    >
                                        <FontAwesomeIcon icon={faXmark} />
                                    </button>
                                </div>
                            ) : (
                                <div
                                    key={index}
                                    className={`start-chat-message start-chat-message-${message.role}`}>
                                    {message.content}
                                </div>
                            )
                        ))}
                        {chatInProgress && (
                            <div className="start-chat-message start-chat-message-assistant" role="status">
                                {sendingStatus}
                            </div>
                        )}
                        {chatStreamOptions && chatStreamOptions.map((option, index) => (
                            <div key={index} className="start-chat-option">
                                <div className="start-chat-message start-chat-message-assistant" role="status">
                                    {option.label}
                                </div>
                                <button
                                    type="button"
                                    className="start-chat-option-button"
                                    aria-label={option.value}
                                    title={option.value}
                                    disabled={chatInProgress}
                                    onClick={() => void chooseChatStreamOption(option)}
                                >
                                    <FontAwesomeIcon icon={faCheck} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <form className="start-chat-composer" onSubmit={sendMessage}>
                        <input
                            ref={messageInputRef}
                            type="text"
                            aria-label="Type your message"
                            placeholder="Type your message..."
                            value={messageDraft}
                            onChange={(event) => setMessageDraft(event.target.value)}
                            disabled={inputTextDisabled}
                        />
                        <button
                            type="submit"
                            aria-label="Send message"
                            disabled={inputTextDisabled || messageDraft.trim().length === 0}
                        >
                            <FontAwesomeIcon icon={faPaperPlane} />
                        </button>
                    </form>
                </section>
            )}
            <div className="start-chat-launcher">
                {chatVersionError && isChatPanelOpen && (
                    <div className="start-chat-error" role="alert">{chatVersionError}</div>
                )}
                {isChatPanelOpen && (
                    <div className="start-chat-version-group start-chat-delay-group">
                        <label className="start-chat-version-label" htmlFor="start-chat-delay">
                            Delay:
                        </label>
                        <input
                            id="start-chat-delay"
                            className="start-chat-delay-checkbox"
                            type="checkbox"
                            checked={delay}
                            disabled={delayUpdating}
                            onChange={(event) => void changeChatDelay(event.target.checked)}
                        />
                    </div>
                )}
                {delayError && isChatPanelOpen && (
                    <div className="start-chat-error" role="alert">{delayError}</div>
                )}
                {isChatPanelOpen && (
                    <div className="start-chat-version-group">
                        <span className="start-chat-version-label">Chat version:</span>
                        <button
                            type="button"
                            className={`start-chat-version-button${chatVersion === "v1" ? " start-chat-version-button-active" : ""}`}
                            aria-pressed={chatVersion === "v1"}
                            disabled={chatVersionUpdating || chatVersion === "v1"}
                            onClick={() => void changeChatVersion("v1")}
                        >
                            V1
                        </button>
                        <button
                            type="button"
                            className={`start-chat-version-button${chatVersion === "v2" ? " start-chat-version-button-active" : ""}`}
                            aria-pressed={chatVersion === "v2"}
                            disabled={chatVersionUpdating || chatVersion === "v2"}
                            onClick={() => void changeChatVersion("v2")}
                        >
                            V2
                        </button>
                    </div>
                )}
                <button
                    type="button"
                    className="start-chat-trigger"
                    aria-expanded={isChatPanelOpen}
                    aria-haspopup="dialog"
                    onClick={() => void changeChatOpen(!isChatPanelOpen)}
                >
                    <span className="start-chat-trigger-icon" aria-hidden="true">
                        <FontAwesomeIcon icon={faHeadset} />
                    </span>
                    <span>{isChatPanelOpen ? "Close chat" : "Need AI helper"}</span>
                </button>
            </div>
        </div>
    );
}
