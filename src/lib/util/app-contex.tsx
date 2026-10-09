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

const defaultAppContext: AppContextProps = {
  userId: "",
  isChatPanelOpen: false,
  chatVersion: "v1",
  welcomeMessage: "",
  setIsChatPanelOpen: () => {},

  messages: [],
  setMessages: () => {}
};
export const AppContext = createContext<AppContextProps>(defaultAppContext);

export function AppProvider(props: AppProviderProps): React.ReactElement {
  const searchParams = useSearchParams();
  let chatVersionProps: ChatVersion | undefined = props.chatVersion;
  const chatVersionParam = searchParams.get("chatVersion");
  let chatVersionUpdate = undefined;
  if (chatVersionParam && (chatVersionParam === "v1" || chatVersionParam === "v2")) {
    chatVersionUpdate = chatVersionParam;
    chatVersionProps = chatVersionParam;
  }

  useEffect(() => {
    if (chatVersionUpdate) {
      fetch("/api/chat/chat-version", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            chatVersion: chatVersionUpdate
          })
      })
    }
  }, [])

  const [isChatPanelOpen, setIsChatPanelOpen] = useState(props.isChatPanelOpen ?? false);
  const [messages, setMessages] = useState([] as UserChatMainFe[]);

  const value: AppContextProps = {
    userId: props.userId,
    isChatPanelOpen,
    setIsChatPanelOpen,
    chatVersion: chatVersionProps,

    messages,
    setMessages,

    welcomeMessage: props.welcomeMessage
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
}

export const useAppContext = (): AppContextProps => useContext(AppContext);
