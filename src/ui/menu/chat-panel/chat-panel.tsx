"use client";

import { useEffect, useRef, useState, type SubmitEvent } from "react";
import { useRouter } from 'next/navigation';
import { faHeadset, faPaperPlane, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "@/src/ui/menu/chat-panel/chat-panel.css";
import { useAppContext } from "@/src/lib/util/app-contex";
import { ChatMessage, ChatPanelProps } from "@/src/ui/menu/chat-panel/chat-panel.definition";

export default function ChatPanel(props: ChatPanelProps) {
    const router = useRouter();
    const { isChatPanelOpen, setIsChatPanelOpen } = useAppContext();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [messageDraft, setMessageDraft] = useState("");
    const [isSending, setIsSending] = useState(false);
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
                body: JSON.stringify({
                    message: message
                }),
            });

            const data = await response.json();
            const reply = data.reply;
            if (data.action) {
                if (data.action === "MENU") {
                    router.push("/menu");
                } else if (data.action === "CART") {
                    router.push("/cart");
                }
            }

            setMessages((currentMessages) => [
                ...currentMessages,
                {
                    role: "assistant",
                    content: reply
                },
            ]);
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
                            Hi there! How can we help you today?
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
                                Typing...
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
