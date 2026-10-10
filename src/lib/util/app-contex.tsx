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

  const value: AppContextProps = {
    userId: props.userId,
    isChatPanelOpen,
    setIsChatPanelOpen,
    chatVersion,
    setChatVersion,

    messages,
    setMessages,

    welcomeMessage: props.welcomeMessage
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
}

export const useAppContext = (): AppContextProps => useContext(AppContext);
