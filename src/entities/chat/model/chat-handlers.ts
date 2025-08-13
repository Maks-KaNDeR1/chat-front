import {ChatRequestType, ChatType} from "@/src/entities/chat";

const LOCAL_STORAGE_KEY = "chats";

export const saveToLocalStorage = (
  folderKey: string,
  chatList: Record<string, ChatType>
) => {
  localStorage.setItem(`${LOCAL_STORAGE_KEY}_${folderKey}`, JSON.stringify(chatList));
};

export const addNewChat = (
  folderKey: string,
  chat: ChatRequestType,
  chats: Record<string, Record<string, ChatType>>,
  setChats: React.Dispatch<
    React.SetStateAction<Record<string, Record<string, ChatType>>>
  >,
  setCurrentChatId: React.Dispatch<React.SetStateAction<string | null>>
): string => {
  const newId = `new_chat_${Date.now()}`;
  const newChat: ChatType = {...chat, id: newId, date: Date.now().toString()};

  setChats(prev => {
    const folderChats = prev[folderKey] || {};
    const updatedFolder = {...folderChats, [newId]: newChat};
    const updated = {...prev, [folderKey]: updatedFolder};

    saveToLocalStorage(folderKey, updatedFolder);
    return updated;
  });

  setCurrentChatId(newId);
  return newId;
};

export const selectChat = (
  id: string | null,
  setCurrentChatId: React.Dispatch<React.SetStateAction<string | null>>
) => {
  setCurrentChatId(id);
};

export const updateChatName = (
  id: string,
  newName: string,
  chats: Record<string, Record<string, ChatType>>,
  setChats: React.Dispatch<React.SetStateAction<Record<string, Record<string, ChatType>>>>
) => {
  setChats(prevChats => {
    const updated: Record<string, Record<string, ChatType>> = {};

    for (const folderKey in prevChats) {
      const folder = prevChats[folderKey];
      if (folder[id]) {
        updated[folderKey] = {
          ...folder,
          [id]: {...folder[id], name: newName, date: Date.now().toString()},
        };
        saveToLocalStorage(folderKey, updated[folderKey]);
      } else {
        updated[folderKey] = folder;
      }
    }

    return updated;
  });
};

export const deleteChat = (
  id: string,
  chats: Record<string, Record<string, ChatType>>,
  setChats: React.Dispatch<React.SetStateAction<Record<string, Record<string, ChatType>>>>
) => {
  setChats(prevChats => {
    const updated: Record<string, Record<string, ChatType>> = {};

    for (const folderKey in prevChats) {
      const folder = {...prevChats[folderKey]};
      if (folder[id]) {
        delete folder[id];
        saveToLocalStorage(folderKey, folder);
      }
      updated[folderKey] = folder;
    }

    return updated;
  });
};
