import {Chat} from "@/src/entities/chat";
import {Folder} from "@/src/entities/folder";

export interface FoldersListProps {
  folders: Folder[];
  currentChatId: string | null;
  currentFolderId: string | null;
  chats: Record<string, Record<string, Chat>>;
  onRenameChat: (id: string, newName: string, chat: Chat) => void;
  onDeleteChat: (id: string) => void;
  onSelectFolder: (id: string | null) => void;
  onSelectChat: (chatId: string, folderId: string) => void;
  onRenameFolder: (id: string, newName: string) => void;
  onDeleteFolder: (id: string) => void;
  onMoveChatToFolder: (chatId: string, folderId: string | null) => void;
  onAddNewFolder: (folderName: string) => Promise<string | null>;
}
