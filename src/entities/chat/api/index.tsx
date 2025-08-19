import {apiClient} from "@/src/shared/api/client";
import {ApiResponse} from "@/src/shared/api/types";
import {Chat} from "../model";
import {Folder} from "../../folder";

export const getChats = (): Promise<ApiResponse<Chat[]>> => {
  return apiClient("/api/chats", "get");
};

export const createChat = (
  ownerId: string,
  name: string,
  folderId: string
): Promise<ApiResponse<Chat>> => {
  return apiClient("/api/chats/new", "post", {ownerId, name, folderId});
};

export const deleteChat = (chatId: string): Promise<ApiResponse<Chat>> => {
  return apiClient(`/api/chats/${chatId}`, "delete");
};

export const updateChat = (
  chatId: string,
  updatedChat: Chat
): Promise<ApiResponse<Chat>> => {
  return apiClient(`/api/chats/${chatId}`, "put", {
    name: updatedChat.name,
    folderId: updatedChat.folder?._id,
  });
};

export type SearchResult = {
  chats: Chat[];
  folders: Folder[];
};

export const searchAll = (query: string): Promise<ApiResponse<SearchResult>> => {
  return apiClient(`/api/search?query=${encodeURIComponent(query)}`, "get");
};
