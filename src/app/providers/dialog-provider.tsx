import React, {createContext, useContext, useState, useEffect} from "react";
import {DialogType, ProcessedFile} from "@/src/entities/dialog";

const LOCAL_STORAGE_KEY = "chat-dialogs";

interface DialogContextType {
  dialogs: Record<string, DialogType[]>;
  getDialogByChatId: (chatId: string) => DialogType[];
  sendMessageToChat: (
    sender: string,
    chatId: string,
    message: string,
    files: ProcessedFile[]
  ) => void;
  deleteDialogsByChatId: (chatId: string) => void;
}

const defaultContextValue: DialogContextType = {
  dialogs: {},
  getDialogByChatId: () => [],
  sendMessageToChat: () => {},
  deleteDialogsByChatId: () => {},
};

const Context = createContext(defaultContextValue);

export function useDialogContext() {
  return useContext(Context);
}

export function DialogProvider({children}: {children: React.ReactNode}) {
  const [dialogs, setDialogs] = useState<Record<string, DialogType[]>>({});

  useEffect(() => {
    const savedDialogs = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedDialogs) {
      try {
        const parsed: Record<string, DialogType[]> = JSON.parse(savedDialogs);

        const normalized = Object.fromEntries(
          Object.entries(parsed).map(([chatId, messages]) => [
            chatId,
            messages.map(msg => ({
              ...msg,
              message: typeof msg.message === "string" ? [msg.message] : msg.message,
            })),
          ])
        );

        setDialogs(normalized);
      } catch (e) {
        console.error("Failed to load dialogs:", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dialogs));
  }, [dialogs]);

  const getDialogByChatId = (chatId: string): DialogType[] => {
    return dialogs[chatId] || [];
  };

  const sendMessageToChat = (
    sender: string,
    chatId: string,
    message: string,
    files: ProcessedFile[]
  ) => {
    const newMessage: DialogType = {
      sender,
      message: [message],
      files,
    };

    setDialogs(prev => {
      const updatedDialog = prev[chatId] ? [...prev[chatId], newMessage] : [newMessage];

      const newDialogs = {
        ...prev,
        [chatId]: updatedDialog,
      };

      return newDialogs;
    });
  };

  const deleteDialogsByChatId = (chatId: string) => {
    setDialogs(prev => {
      const newDialogs = {...prev};
      delete newDialogs[chatId];
      return newDialogs;
    });
  };

  return (
    <Context.Provider
      value={{dialogs, getDialogByChatId, deleteDialogsByChatId, sendMessageToChat}}
    >
      {children}
    </Context.Provider>
  );
}
