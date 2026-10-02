"use client";

import React, { createContext, useContext, useState } from "react";

export interface AppContextProps {
  userId: string;
  isChatPanelOpen: boolean;
  setIsChatPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface AppProviderProps {
  userId: string;
  isChatPanelOpen?: boolean;
  children: React.ReactNode;
}

const defaultAppContext: AppContextProps = {
  userId: "",
  isChatPanelOpen: false,
  setIsChatPanelOpen: () => {},
};
export const AppContext = createContext<AppContextProps>(defaultAppContext);

export function AppProvider(props: AppProviderProps): React.ReactElement {
  const [isChatPanelOpen, setIsChatPanelOpen] = useState(props.isChatPanelOpen ?? false);
  const value: AppContextProps = {
    userId: props.userId,
    isChatPanelOpen,
    setIsChatPanelOpen,
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
}

export const useAppContext = (): AppContextProps => useContext(AppContext);
