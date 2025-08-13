import {ChatType} from "@/src/entities/chat";
import {ProcessedFile} from "@/src/entities/dialog";
import {FolderType} from "@/src/entities/folder";

export interface ChatComponentProps {
  currentChatId: string | null;
  currentFolderId: string | null;
  handleSearch: (query: string) => void;
  filteredChats: ChatType[];
  filteredFolders: FolderType[];
  handleSelectChat: (chatId: string, folderId: string | null) => void;
  handleSelectFolder: (folderId: string | null) => void;
  sendMessage: (message: string, files: ProcessedFile[]) => void;
}
