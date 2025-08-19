import {apiClient, ApiResponse} from "@/src/shared/api";
import {Chat} from "@/src/entities/chat/model";
import {Folder} from "@/src/entities/folder/model";

export type SearchResult = {
  chats: Chat[];
  folders: Folder[];
};

export const searchAll = (query: string): Promise<ApiResponse<SearchResult>> => {
  return apiClient(`/api/search?folder=${query}&chats=${query}`, "get");
};

