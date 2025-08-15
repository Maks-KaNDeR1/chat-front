import {Chat} from "@/src/entities/chat";
import {Folder} from "@/src/entities/folder";

export const parsePath = (
  pathSegments: string[],
  folders: Record<string, Folder>,
  chats: Record<string, Record<string, Chat>>
) => {
  if (pathSegments.length === 0) {
    return {folderId: null, chatId: null};
  }

  if (pathSegments.length === 1) {
    const id = pathSegments[0];

    if (folders[id]) {
      return {folderId: id, chatId: null};
    }

    if (chats["default"]?.[id]) {
      return {folderId: null, chatId: id};
    }

    return {folderId: null, chatId: null};
  }

  if (pathSegments.length >= 2) {
    const [folderId, chatId] = pathSegments;

    if (folders[folderId] && chats[folderId]?.[chatId]) {
      return {folderId, chatId};
    }

    return {folderId: null, chatId: null};
  }

  return {folderId: null, chatId: null};
};
