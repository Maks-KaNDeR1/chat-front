import {Chat} from "@/src/entities/chat";
import {Folder} from "@/src/entities/folder";

export interface ChatComponentProps {
  currentChatId: string | null;
  currentFolderId: string | null;
  handleSearch: (query: string) => void;
  filteredChats: Chat[];
  filteredFolders: Folder[];
  handleSelectChat: (chatId: string, folderId: string | null) => void;
  handleSelectFolder: (folderId: string | null) => void;
}
