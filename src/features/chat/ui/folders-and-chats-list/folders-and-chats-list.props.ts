import {ChatType} from "@/src/entities/chat";
import {FolderType} from "@/src/entities/folder";

export type FoldersAndChatsListProps = {
  currentChatId: string | null;
  currentFolderId: string | null;
  chatsList: ChatType[];
  foldersList: FolderType[];
  handleSelectChat: (chatId: string, folderId: string | null) => void;
  handleSelectFolder: (folderId: string | null) => void;
};
