"use client";

import React, { createContext, useContext, useState } from "react";
import { UserChatMainFe } from "@/src/lib/database/database.definition";

export interface AppContextProps {
  userId: string;
  isChatPanelOpen: boolean;
  setIsChatPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;

  messages?: UserChatMainFe[];
  setMessages: React.Dispatch<React.SetStateAction<UserChatMainFe[]>>;

  welcomeMessage: string;
}

export interface AppProviderProps {
  userId: string;
  isChatPanelOpen?: boolean;
  welcomeMessage: string;
  children: React.ReactNode;
}

const defaultAppContext: AppContextProps = {
  userId: "",
  isChatPanelOpen: false,
  welcomeMessage: "",
  setIsChatPanelOpen: () => {},

  messages: [],
  setMessages: () => {}
};
export const AppContext = createContext<AppContextProps>(defaultAppContext);

export function AppProvider(props: AppProviderProps): React.ReactElement {
  const [isChatPanelOpen, setIsChatPanelOpen] = useState(props.isChatPanelOpen ?? false);
  const [messages, setMessages] = useState([] as UserChatMainFe[]);

  const value: AppContextProps = {
    userId: props.userId,
    isChatPanelOpen,
    setIsChatPanelOpen,

    messages,
    setMessages,

    welcomeMessage: props.welcomeMessage
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
}

export const useAppContext = (): AppContextProps => useContext(AppContext);
