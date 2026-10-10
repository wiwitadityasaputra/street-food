"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { UserChatMainFe } from "@/src/lib/database/database.definition";
import { useSearchParams } from "next/navigation";

export type ChatVersion = "v1" | "v2";

export interface AppContextProps {
  userId: string;
  isChatPanelOpen: boolean;
  setIsChatPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  chatVersion?: ChatVersion;
  setChatVersion: (chatVersion: ChatVersion) => Promise<void>;
  delay: boolean;
  setDelay: (delay: boolean) => Promise<void>;

  messages?: UserChatMainFe[];
  setMessages: React.Dispatch<React.SetStateAction<UserChatMainFe[]>>;

  welcomeMessage: string;
}

export interface AppProviderProps {
  userId: string;
  isChatPanelOpen?: boolean;
  welcomeMessage: string;
  children: React.ReactNode;
  chatVersion?: ChatVersion;
  delay?: boolean;
}

async function postChatDelay(delay: boolean): Promise<boolean> {
  const response = await fetch("/api/chat/delay", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ delay })
  });

  if (!response.ok) {
    throw new Error(`Failed to update chat delay: ${response.status}`);
  }

  const result: { delay?: boolean } = await response.json();
  if (result.delay !== delay) {
    throw new Error("The server did not confirm the requested chat delay");
  }

  return result.delay;
}

async function postChatVersion(chatVersion: ChatVersion): Promise<ChatVersion> {
  const response = await fetch("/api/chat/version", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ chatVersion })
  });

  if (!response.ok) {
    throw new Error(`Failed to update chat version: ${response.status}`);
  }

  const result: { chatVersion?: ChatVersion } = await response.json();
  if (result.chatVersion !== chatVersion) {
    throw new Error("The server did not confirm the requested chat version");
  }

  return result.chatVersion;
}

const defaultAppContext: AppContextProps = {
  userId: "",
  isChatPanelOpen: false,
  chatVersion: "v1",
  setChatVersion: async () => {
    throw new Error("Cannot change chat version outside of AppProvider");
  },
  delay: false,
  setDelay: async () => {
    throw new Error("Cannot change chat delay outside of AppProvider");
  },
  welcomeMessage: "",
  setIsChatPanelOpen: () => {},

  messages: [],
  setMessages: () => {}
};
export const AppContext = createContext<AppContextProps>(defaultAppContext);

export function AppProvider(props: AppProviderProps): React.ReactElement {
  const searchParams = useSearchParams();
  const chatVersionParam = searchParams.get("chatVersion");
  const chatVersionUpdate: ChatVersion | undefined =
    chatVersionParam === "v1" || chatVersionParam === "v2" ? chatVersionParam : undefined;
  const chatVersionProps = chatVersionUpdate ?? props.chatVersion ?? "v2";
  const [chatVersion, setChatVersionState] = useState(chatVersionProps);
  const [delay, setDelayState] = useState(props.delay ?? false);

  useEffect(() => {
    if (chatVersionUpdate) {
      void postChatVersion(chatVersionUpdate)
        .then(setChatVersionState)
        .catch((error: unknown) => {
          console.error("app-context - failed to apply chat version from URL", error);
        });
    }
  }, [chatVersionUpdate]);

  const [isChatPanelOpen, setIsChatPanelOpen] = useState(props.isChatPanelOpen ?? false);
  const [messages, setMessages] = useState([] as UserChatMainFe[]);

  async function setChatVersion(nextChatVersion: ChatVersion): Promise<void> {
    const confirmedChatVersion = await postChatVersion(nextChatVersion);
    setChatVersionState(confirmedChatVersion);
  }

  async function setDelay(nextDelay: boolean): Promise<void> {
    const confirmedDelay = await postChatDelay(nextDelay);
    setDelayState(confirmedDelay);
  }

  const value: AppContextProps = {
    userId: props.userId,
    isChatPanelOpen,
    setIsChatPanelOpen,
    chatVersion,
    setChatVersion,
    delay,
    setDelay,

    messages,
    setMessages,

    welcomeMessage: props.welcomeMessage
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
}

export const useAppContext = (): AppContextProps => useContext(AppContext);
