import {Chat} from "@/src/entities/chat";
import {Folder} from "@/src/entities/folder";

export type FoldersAndChatsListProps = {
  currentChatId: string | null;
  currentFolderId: string | null;
  chatsList: Chat[];
  foldersList: Folder[];
  handleSelectChat: (chatId: string, folderId: string | null) => void;
  handleSelectFolder: (folderId: string | null) => void;
};
