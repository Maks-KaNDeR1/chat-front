import {Chat} from "@/src/entities/chat/model";
import {Folder} from "@/src/entities/folder/model";
import {enqueueSnackbar} from "notistack";
import {searchAll} from "../api";

export const handleSearchApi = async (
  query: string,
  setChats: React.Dispatch<React.SetStateAction<Record<string, Record<string, Chat>>>>,
  setFolders: React.Dispatch<React.SetStateAction<Record<string, Folder>>>
) => {
  try {
    const res = await searchAll(query);
    if (res.success) {
      const groupedChats: Record<string, Record<string, Chat>> = {};
      res.result.chats.forEach(chat => {
        const folderKey = chat.folder?._id || "default";
        if (!groupedChats[folderKey]) groupedChats[folderKey] = {};
        groupedChats[folderKey][chat._id] = chat;
      });
      setChats(groupedChats);

      const foldersMap: Record<string, Folder> = {};
      res.result.folders.forEach(folder => {
        foldersMap[folder._id] = folder;
      });
      setFolders(foldersMap);
    }
  } catch (e) {
    console.error("Ошибка поиска:", e);
    enqueueSnackbar("Ошибка при поиске", {variant: "error"});
  }
};
