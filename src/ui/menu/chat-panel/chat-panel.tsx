"use client";

import { useState } from "react";

import "@/src/ui/menu/chat-panel/chat-panel.css";
import { faHeadset, faPaperPlane, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ChatPanel() {
    const [isChatOpen, setIsChatOpen] = useState(false);

    return (
        <div className="start-chat">
            {isChatOpen && (
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
                            onClick={() => setIsChatOpen(false)}
                        >
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                    </header>
                    <div className="start-chat-messages" aria-live="polite">
                        <span className="start-chat-time">Today</span>
                        <div className="start-chat-message">
                            Hi there! 👋 How can we help you today?
                        </div>
                    </div>
                    <form className="start-chat-composer" onSubmit={(event) => event.preventDefault()}>
                        <input
                            type="text"
                            aria-label="Type your message"
                            placeholder="Type your message..."
                        />
                        <button type="submit" aria-label="Send message">
                            <FontAwesomeIcon icon={faPaperPlane} />
                        </button>
                    </form>
                </section>
            )}
            <button
                type="button"
                className="start-chat-trigger"
                aria-expanded={isChatOpen}
                aria-haspopup="dialog"
                onClick={() => setIsChatOpen((open) => !open)}
            >
                <span className="start-chat-trigger-icon" aria-hidden="true">
                    <FontAwesomeIcon icon={faHeadset} />
                </span>
                <span>{isChatOpen ? "Close chat" : "Need AI helper"}</span>
            </button>
        </div>
    );
}
