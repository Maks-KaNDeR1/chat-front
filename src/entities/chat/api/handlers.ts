import {apiClient} from "@/src/shared/api/client";
import {ApiResponse} from "@/src/shared/api/types";
import {Chat} from "../model";

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

export const deleteChat = (chatId: string): Promise<{result: boolean} | undefined> => {
  return apiClient(`/api/chats/${chatId}`, "delete");
};

export const updateChat = (
  chatId: string,
  updatedChat: Chat
): Promise<{result: boolean} | undefined> => {
  return apiClient(`/api/chats/${chatId}`, "patch", {chat: updatedChat});
};
