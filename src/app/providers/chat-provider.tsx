import React, {createContext, useContext, useState, useEffect} from "react";
import {
  addNewChat,
  ChatRequestType,
  ChatType,
  deleteChat,
  selectChat,
  updateChatName,
} from "@/src/entities/chat";
import {useFolderContext} from "./folder-provider";
import {useRouter} from "next/router";
import {useDialogContext} from "./dialog-provider";

const LOCAL_STORAGE_KEY = "chats";

interface ChatsContextType {
  chats: Record<string, Record<string, ChatType>>;
  currentChatId: string | null;
  selectChat: (id: string | null) => void;
  addNewChat: (folderKey: string, chat: ChatRequestType) => void;
  updateChatName: (id: string, newName: string) => void;
  deleteChat: (id: string) => void;
  updateChatById: (chatId: string, updatedFields: Partial<ChatType>) => void;
}

const Context = createContext<ChatsContextType>({
  chats: {},
  currentChatId: null,
  selectChat: () => {},
  addNewChat: () => {},
  updateChatName: () => {},
  deleteChat: () => {},
  updateChatById: () => {},
});

function saveFolderChats(folderKey: string, chatsInFolder: Record<string, ChatType>) {
  localStorage.setItem(
    `${LOCAL_STORAGE_KEY}_${folderKey}`,
    JSON.stringify(chatsInFolder)
  );
}

export function useChatContext() {
  return useContext(Context);
}

export function ChatProvider({children}: {children: React.ReactNode}) {
  const [chats, setChats] = useState<Record<string, Record<string, ChatType>>>({});
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const {currentFolderId, selectFolder} = useFolderContext();
  const {deleteDialogsByChatId} = useDialogContext();
  const router = useRouter();

  useEffect(() => {
    try {
      const allChats: Record<string, Record<string, ChatType>> = {};
      for (const key in localStorage) {
        if (key.startsWith(`${LOCAL_STORAGE_KEY}_`)) {
          const folderKey = key.replace(`${LOCAL_STORAGE_KEY}_`, "");
          const stored = localStorage.getItem(key);
          if (stored) allChats[folderKey] = JSON.parse(stored);
        }
      }
      setChats(allChats);
    } catch (e) {
      console.error("Failed to load chats:", e);
    }
  }, []);

  const handleDeleteChat = (id: string) => {
    deleteChat(id, chats, setChats);
    deleteDialogsByChatId(id);

    if (currentChatId === id) {
      setCurrentChatId(null);
      router.push(currentFolderId ? `/${currentFolderId}` : `/`);
    }
  };

  // перемещаем чат между папками
  const updateChatById = (chatId: string, updatedFields: Partial<ChatType>) => {
    setChats(prev => {
      const newChats = {...prev};

      const currentFolderKey = Object.keys(newChats).find(
        folderKey => chatId in (newChats[folderKey] || {})
      );
      if (!currentFolderKey) return prev;

      const oldChat = newChats[currentFolderKey][chatId];
      const updatedChat = {...oldChat, ...updatedFields};

      if (
        updatedFields.folder !== undefined &&
        updatedFields.folder !== currentFolderKey
      ) {
        const newFolderKey = updatedFields.folder || "default";

        delete newChats[currentFolderKey][chatId];
        saveFolderChats(currentFolderKey, newChats[currentFolderKey]);

        if (!newChats[newFolderKey]) newChats[newFolderKey] = {};
        newChats[newFolderKey][chatId] = {...updatedChat, folder: newFolderKey};
        saveFolderChats(newFolderKey, newChats[newFolderKey]);
      } else {
        newChats[currentFolderKey][chatId] = updatedChat;
        saveFolderChats(currentFolderKey, newChats[currentFolderKey]);
      }

      return newChats;
    });
  };

  const addChat = (folderKey: string, chat: ChatRequestType) => {
    const newId = addNewChat(folderKey, chat, chats, setChats, setCurrentChatId);

    if (folderKey && folderKey !== "default") {
      selectFolder(folderKey);
      router.push(`/${folderKey}/${newId}`);
    } else {
      selectFolder(null);
      router.push(`/${newId}`);
    }
  };

  return (
    <Context.Provider
      value={{
        chats,
        currentChatId,
        selectChat: id => selectChat(id, setCurrentChatId),
        addNewChat: addChat,
        updateChatName: (id, newName) => updateChatName(id, newName, chats, setChats),
        deleteChat: handleDeleteChat,
        updateChatById,
      }}
    >
      {children}
    </Context.Provider>
  );
}
