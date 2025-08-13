import {ChatType} from "@/src/entities/chat";
import {FolderType} from "@/src/entities/folder";

export interface FoldersListProps {
  folders: FolderType[];
  currentChatId: string | null;
  currentFolderId: string | null;
  chats: Record<string, Record<string, ChatType>>;
  onRenameChat: (id: string, newName: string) => void;
  onDeleteChat: (id: string) => void;
  onSelectFolder: (id: string | null) => void;
  onSelectChat: (chatId: string, folderId: string) => void;
  onRenameFolder: (id: string, newName: string) => void;
  onDeleteFolder: (id: string) => void;
  onMoveChatToFolder: (chatId: string, folderId: string | null) => void;
  onAddNewFolder: (folderName: string) => Promise<string>;
}
