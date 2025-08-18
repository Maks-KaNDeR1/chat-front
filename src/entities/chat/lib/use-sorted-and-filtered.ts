import {useMemo} from "react";
import {Folder} from "../../folder";
import {Chat} from "../model";

export const useSortedAndFiltered = (
  folders: Record<string, Folder> | undefined,
  chats: Record<string, Record<string, Chat>> | undefined,
  searchQuery: string
) => {
  const sortedFolders = useMemo<Folder[]>(() => {
    if (!folders) return [];
    return Object.values(folders).sort(
      (a, b) => Number(b.createdAt) - Number(a.createdAt)
    );
  }, [folders]);

  const sortedChats = useMemo<Chat[]>(() => {
    if (!chats || !chats["default"]) return [];
    return Object.values(chats["default"]).sort(
      (a, b) => Number(b.createdAt) - Number(a.createdAt)
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
