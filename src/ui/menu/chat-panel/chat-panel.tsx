"use client";

import { useEffect, useRef, useState, type SubmitEvent } from "react";
import { useRouter } from 'next/navigation';
import { faHeadset, faPaperPlane, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "@/src/ui/menu/chat-panel/chat-panel.css";
import { useAppContext } from "@/src/lib/util/app-contex";
import { ChatMessage, ChatPanelProps } from "@/src/ui/menu/chat-panel/chat-panel.definition";
import { useAppDispatch } from "@/src/lib/util/redux-provider";
import { setTotalCart } from "@/src/lib/util/redux-provider/app-slice";
import { ChatStreamResponse } from "@/src/app/api/chat/route";
import { ChatRequestStatus } from "@/src/lib/route/chat/chat.definition";

export default function ChatPanel(props: ChatPanelProps) {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { isChatPanelOpen, setIsChatPanelOpen, welcomeMessage } = useAppContext();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [messageDraft, setMessageDraft] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [sendingStatus, setSendingStatus] = useState("Review...");
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const messageInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const messagesContainer = messagesContainerRef.current;
        if (isChatPanelOpen && messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }, [isChatPanelOpen, isSending, messages, props.messages]);

    useEffect(() => {
        if (isChatPanelOpen) {
            messageInputRef.current?.focus();
        }
    }, [isChatPanelOpen]);

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
        if (!message || isSending) {
            return;
        }

        setMessages((currentMessages) => [...currentMessages, { role: "user", content: message }]);
        setMessageDraft("");
        setIsSending(true);

        try {
            const response = await fetch("/api/chat", {
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
                        if (payload.status === ChatRequestStatus.REVIEW) {
                            setSendingStatus("Review...");
                        }
                        if (payload.status === ChatRequestStatus.THINKING) {
                            setSendingStatus("Thinking...");
                        }
                        if (payload.status === ChatRequestStatus.DONE) {
                            setIsSending(false);
                        }

                        const replies = payload.replies;
                        if (replies && replies.length > 0) {
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

                        const totalCart = payload.totalCart;
                        if (totalCart || totalCart === 0) {
                            dispatch(setTotalCart(totalCart));
                        }

                        const action = payload.action;
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
                if (buffer.trim()) {
                    const dataLine = buffer.split("\n").find((line) => line.startsWith("data: "));
                    if (dataLine) {
                        const payload = JSON.parse(dataLine.slice(6));
                    }
                }
            }
        } catch (error) {
            console.error("Failed to send chat message.", error);
        } finally {
            setIsSending(false);
        }
    }

    return (
        <div className="start-chat">
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
                        aria-busy={isSending}
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
                            <div
                                key={index}
                                className={`start-chat-message start-chat-message-${message.role}`}>
                                {message.content}
                            </div>
                        ))}
                        {isSending && (
                            <div className="start-chat-message start-chat-message-assistant" role="status">
                                {sendingStatus}
                            </div>
                        )}
                    </div>
                    <form className="start-chat-composer" onSubmit={sendMessage}>
                        <input
                            ref={messageInputRef}
                            type="text"
                            aria-label="Type your message"
                            placeholder="Type your message..."
                            value={messageDraft}
                            onChange={(event) => setMessageDraft(event.target.value)}
                            disabled={isSending}
                        />
                        <button
                            type="submit"
                            aria-label="Send message"
                            disabled={isSending || messageDraft.trim().length === 0}
                        >
                            <FontAwesomeIcon icon={faPaperPlane} />
                        </button>
                    </form>
                </section>
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
    );
}
