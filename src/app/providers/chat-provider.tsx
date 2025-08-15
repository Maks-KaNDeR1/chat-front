import React, {createContext, useContext, useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Chat} from "@/src/entities/chat/model";
import {
  createChat,
  getChats,
  updateChat,
  deleteChat as deleteChatApi,
} from "@/src/entities/chat/api";
import {useAuthStatus} from "@/src/features/auth";

interface ChatsContextType {
  chats: Record<string, Record<string, Chat>>;
  currentChatId: string | null;
  selectChat: (id: string | null) => void;
  addNewChat: (name: string, folderId: string, ownerId: string) => Promise<string>;
  updateChat: (chatId: string, chat: Chat) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  loading: boolean;
}

const Context = createContext<ChatsContextType>({
  chats: {},
  currentChatId: null,
  selectChat: () => {},
  addNewChat: async () => "",
  updateChat: async () => {},
  deleteChat: async () => {},
  loading: true,
});

export function useChatContext() {
  return useContext(Context);
}

export function ChatProvider({children}: {children: React.ReactNode}) {
  const [chats, setChats] = useState<Record<string, Record<string, Chat>>>({});
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const {isAuthorized} = useAuthStatus();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      try {
        const res = await getChats();
        if (res.status) {
          const grouped: Record<string, Record<string, Chat>> = {};
          res.result.forEach(chat => {
            const folderKey = chat.folder?.id || "default";
            if (!grouped[folderKey]) grouped[folderKey] = {};
            grouped[folderKey][chat.id] = chat;
          });
          setChats(grouped);
        }
      } catch (e) {
        console.error("Failed to load chats:", e);
      } finally {
        setLoading(false);
      }
    };

    // if (isAuthorized) {
    fetchChats();
    // }
  }, [isAuthorized]);

  const selectChatHandler = (id: string | null) => {
    setCurrentChatId(id);
  };

  const addNewChatHandler = async (name: string, folderId: string, ownerId: string) => {
    try {
      const res = await createChat(ownerId, name, folderId);
      if (res.status) {
        const folderKey = res.result.folder?.id || "default";

        setChats(prev => ({
          ...prev,
          [folderKey]: {
            ...(prev[folderKey] || {}),
            [res.result.id]: res.result,
          },
        }));

        setCurrentChatId(res.result.id);
        return res.result.id;
      }
    } catch (e) {
      console.error("Failed to create chat:", e);
    }
    throw new Error("Failed to create chat");
  };

  const updateChatHandler = async (chatId: string, updatedChat: Chat) => {
    let folderKey: string | null = null;

    for (const key in chats) {
      if (chats[key][chatId]) {
        folderKey = key;
        break;
      }
    }
    if (!folderKey) return;

    try {
      const res = await updateChat(chatId, updatedChat);
      if (res?.result) {
        setChats(prev => ({
          ...prev,
          [folderKey!]: {
            ...prev[folderKey!],
            [chatId]: updatedChat,
          },
        }));
      }
    } catch (e) {
      console.error("Failed to update chat:", e);
    }
  };

  const deleteChatHandler = async (chatId: string) => {
    let folderKey: string | null = null;

    for (const key in chats) {
      if (chats[key][chatId]) {
        folderKey = key;
        break;
      }
    }
    if (!folderKey) return;

    try {
      const res = await deleteChatApi(chatId);
      if (res?.result) {
        setChats(prev => {
          const updatedFolder = {...prev[folderKey!]};
          delete updatedFolder[chatId];
          return {
            ...prev,
            [folderKey!]: updatedFolder,
          };
        });

        if (currentChatId === chatId) {
          setCurrentChatId(null);
          router.push("/");
        }
      }
    } catch (e) {
      console.error("Failed to delete chat:", e);
    }
  };

  return (
    <Context.Provider
      value={{
        chats,
        currentChatId,
        selectChat: selectChatHandler,
        addNewChat: addNewChatHandler,
        updateChat: updateChatHandler,
        deleteChat: deleteChatHandler,
        loading,
      }}
    >
      {children}
    </Context.Provider>
  );
}
