import React, {createContext, useContext, useState} from "react";
import {getChatMessages, sendMessage as sendMessageApi} from "@/src/entities/message";
import {Message} from "@/src/entities/message";
import {useLoadingStore} from "@/src/shared/store";

interface MessageContextType {
  message: Record<string, Message[]>;
  getMessageChatId: (chatId: string) => Message[];
  loadMessagesForChat: (chatId: string) => Promise<void>;
  sendMessageToChat: (chatId: string, content: string, files?: File[]) => Promise<void>;
}

const defaultContextValue: MessageContextType = {
  message: {},
  getMessageChatId: () => [],
  loadMessagesForChat: async () => {},
  sendMessageToChat: async () => {},
};

const Context = createContext<MessageContextType>(defaultContextValue);

export function useMessageContext() {
  return useContext(Context);
}

export function MessageProvider({children}: {children: React.ReactNode}) {
  const [message, setMessage] = useState<Record<string, Message[]>>({});

  const {setLoading} = useLoadingStore();

  const getMessageChatId = (chatId: string): Message[] => {
    return message[chatId] || [];
  };

  const loadMessagesForChat = async (chatId: string) => {
    setLoading(true);

    try {
      const res = await getChatMessages(chatId);
      if (res.success) {
        setMessage(prev => ({
          ...prev,
          [chatId]: res.result,
        }));
      }
    } catch (e) {
      console.error("Failed to load chat messages:", e);
    } finally {
      setLoading(false);
    }
  };

  const sendMessageToChat = async (
    chatId: string,
    content: string,
    files: File[] = []
  ) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("text", content);
      files.forEach(file => formData.append("file", file));

      const res = await sendMessageApi(chatId, formData);
      if (res.success) {
        setMessage(prev => {
          const existing = prev[chatId] || [];
          return {
            ...prev,
            [chatId]: [...existing, res.result.message, res.result.answer],
          };
        });
      }
    } catch (e) {
      console.error("Failed to send message:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Context.Provider
      value={{
        message,
        getMessageChatId,
        loadMessagesForChat,
        sendMessageToChat,
      }}
    >
      {children}
    </Context.Provider>
  );
}
