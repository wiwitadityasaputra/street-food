"use client";

import { useState, type SubmitEvent } from "react";
import { faHeadset, faPaperPlane, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "@/src/ui/menu/chat-panel/chat-panel.css";
import { useAppContext } from "@/src/lib/util/app-contex";
import { ChatMessage } from "@/src/ui/menu/chat-panel/chat-panel.definition";

export default function ChatPanel() {
    const { isChatPanelOpen, setIsChatPanelOpen } = useAppContext();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [messageDraft, setMessageDraft] = useState("");
    const [isSending, setIsSending] = useState(false);

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
                body: JSON.stringify({ message }),
            });

            const data = await response.json();
            const reply = data.reply;

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
                            <h3>Customer service</h3>
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
                    <div className="start-chat-messages" aria-live="polite" aria-busy={isSending}>
                        <span className="start-chat-time">Today</span>
                        <div className="start-chat-message">
                            Hi there! How can we help you today?
                        </div>
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`start-chat-message start-chat-message-${message.role}`}
                            >
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
