import React, {createContext, useContext, useState} from "react";
import {getChatMessages, sendMessage as sendMessageApi} from "@/src/entities/message";
import {Message} from "@/src/entities/message";
import {useLoadingAppStore} from "@/src/shared/store";

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

  const {setLoading} = useLoadingAppStore();

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
    const tempId = `temp-${Date.now()}`;
    const tempMessage: Message = {
      _id: tempId,
      owner: {} as any,
      role: "user",
      type: files.length ? "file" : "text",
      text: content,
      imageUrls: [],
      meta: {},
      createdAt: new Date().toISOString(),
      name: "You",
    };

    setMessage(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), {...tempMessage, meta: {status: "pending"}}],
    }));

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("text", content);
      files.forEach(file => formData.append("file", file));

      const res = await sendMessageApi(chatId, formData);

      setMessage(prev => {
        const existing = prev[chatId] || [];

        if (res.success) {
          // заменяем временное сообщение на настоящее и добавляем ответ
          return {
            ...prev,
            [chatId]: [
              ...existing.map(m =>
                m._id === tempId ? {...res.result.message, meta: {status: "sent"}} : m
              ),
              res.result.answer,
            ],
          };
        }

        // при ошибке убираем временное
        return {
          ...prev,
          [chatId]: existing.filter(m => m._id !== tempId),
        };
      });
    } catch (e) {
      console.error("Failed to send message:", e);
      // при ошибке убираем временное

      setMessage(prev => ({
        ...prev,
        [chatId]: (prev[chatId] || []).filter(m => m._id !== tempId),
      }));
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
