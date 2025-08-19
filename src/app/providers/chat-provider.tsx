import React, {createContext, useContext, useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Chat} from "@/src/entities/chat/model";
import {
  createChat,
  getChats,
  updateChat,
  deleteChat as deleteChatApi,
} from "@/src/entities/chat/api";
import {useAuthStore} from "@/src/features/auth";
import {enqueueSnackbar} from "notistack";

interface ChatsContextType {
  chats: Record<string, Record<string, Chat>>;
  setChats: React.Dispatch<React.SetStateAction<Record<string, Record<string, Chat>>>>;
  currentChatId: string | null;
  selectChat: (id: string | null) => void;
  addNewChat: (name: string, folderId: string, ownerId: string) => Promise<string>;
  updateChat: (chatId: string, chat: Chat) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  loading: boolean;
  loadingChatIds: Record<string, boolean>;
}

const Context = createContext<ChatsContextType>({
  chats: {},
  setChats: () => {},
  currentChatId: null,
  selectChat: () => {},
  addNewChat: async () => "",
  updateChat: async () => {},
  deleteChat: async () => {},
  loading: true,
  loadingChatIds: {},
});

export function useChatContext() {
  return useContext(Context);
}

export function ChatProvider({children}: {children: React.ReactNode}) {
  const [chats, setChats] = useState<Record<string, Record<string, Chat>>>({});
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const {isAuthorized} = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [loadingChatIds, setLoadingChatIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      try {
        const res = await getChats();

        if (res.success) {
          const grouped: Record<string, Record<string, Chat>> = {};
          res.result.forEach(chat => {
            const folderKey = chat.folder?._id || "default";
            if (!grouped[folderKey]) grouped[folderKey] = {};
            grouped[folderKey][chat._id] = chat;
          });
          setChats(grouped);
        }
      } catch (e) {
        console.error("Failed to load chats:", e);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthorized) {
      fetchChats();
    }
  }, [isAuthorized]);

  const selectChatHandler = (id: string | null) => {
    setCurrentChatId(id);
  };

  const addNewChatHandler = async (name: string, folderId: string, ownerId: string) => {
    try {
      const res = await createChat(ownerId, name, folderId);

      if (res.success) {
        const folderKey = res.result.folder?._id || "default";

        setChats(prev => ({
          ...prev,
          [folderKey]: {
            ...(prev[folderKey] || {}),
            [res.result._id]: res.result,
          },
        }));

        setCurrentChatId(res.result._id);
        return res.result._id;
      }
    } catch (e) {
      console.error("Failed to create chat:", e);
    } finally {
      setLoading(false);
    }

    throw new Error("Failed to create chat");
  };

  const updateChatHandler = async (chatId: string, updatedChat: Chat) => {
    setLoadingChatIds(prev => ({...prev, [chatId]: true}));

    try {
      const res = await updateChat(chatId, updatedChat);
      if (res?.success) {
        const folderKey = res.result.folder?._id || "default";

        setChats(prev => ({
          ...prev,
          [folderKey]: {
            ...prev[folderKey],
            [res.result._id]: res.result,
          },
        }));

        enqueueSnackbar(
          `Успешно ${folderKey === "default" ? "переименовано" : "перенесено"}`,
          {variant: "success"}
        );
      }
    } catch (e) {
      console.error("Failed to update chat:", e);
      enqueueSnackbar("Ошибка при обновлении чата", {variant: "error"});
    } finally {
      setLoadingChatIds(prev => {
        const copy = {...prev};
        delete copy[chatId];
        return copy;
      });
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

    setLoadingChatIds(prev => ({...prev, [chatId]: true}));

    try {
      const res = await deleteChatApi(chatId);
      if (res?.success) {
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
      enqueueSnackbar("Ошибка при удалении чата", {variant: "error"});
    } finally {
      setLoadingChatIds(prev => {
        const copy = {...prev};
        delete copy[chatId];
        return copy;
      });
    }
  };

  return (
    <Context.Provider
      value={{
        chats,
        setChats,
        currentChatId,
        selectChat: selectChatHandler,
        addNewChat: addNewChatHandler,
        updateChat: updateChatHandler,
        deleteChat: deleteChatHandler,
        loading,
        loadingChatIds,
      }}
    >
      {children}
    </Context.Provider>
  );
}
