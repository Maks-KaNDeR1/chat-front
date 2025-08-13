import {useMemo} from "react";
import {ChatType} from "../model";
import {FolderType} from "../../folder";

export const useSortedAndFiltered = (
  folders: Record<string, FolderType>,
  chats: Record<string, Record<string, ChatType>>,
  searchQuery: string
) => {
  const sortedFolders = useMemo<FolderType[]>(() => {
    return Object.values(folders).sort((a, b) => Number(b.date) - Number(a.date));
  }, [folders]);

  const sortedChats = useMemo<ChatType[]>(() => {
    return Object.values(chats["default"] || {}).sort(
      (a, b) => Number(b.date) - Number(a.date)
    );
  }, [chats]);

  const filteredFolders = useMemo(() => {
    if (!searchQuery.trim()) return sortedFolders;
    return sortedFolders.filter(folder =>
      folder.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [sortedFolders, searchQuery]);

  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return sortedChats;
    return sortedChats.filter(chat =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [sortedChats, searchQuery]);

  return {filteredFolders, filteredChats};
};
