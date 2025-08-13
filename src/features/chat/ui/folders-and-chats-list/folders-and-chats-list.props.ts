import {FolderType} from "@/src/app/providers";
import {ChatType} from "@/src/entities/chat";

export type FoldersAndChatsListProps = {
  currentChatId: string | null;
  currentFolderId: string | null;
  chatsList: ChatType[];
  foldersList: FolderType[];
  handleSelectChat: (chatId: string, folderId: string | null) => void;
  handleSelectFolder: (folderId: string | null) => void;
};
