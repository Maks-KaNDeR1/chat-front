import {apiClient, ApiResponse} from "@/src/shared/api";
import {Folder} from "../model";

export const getFolders = (): Promise<ApiResponse<Folder[]>> => {
  return apiClient("/api/folders", "get");
};

export const createFolder = (
  ownerId: string,
  name: string
): Promise<ApiResponse<Folder>> => {
  return apiClient("/api/folders/new", "post", {ownerId, name});
};

export const deleteFolder = (folderId: string): Promise<ApiResponse<Folder>> => {
  return apiClient(`/api/folders/${folderId}`, "delete");
};

export const updateFolder = (
  folderId: string,
  updatedName: string
): Promise<ApiResponse<Folder>> => {
  return apiClient(`/api/folders/${folderId}`, "put", {name: updatedName});
};
