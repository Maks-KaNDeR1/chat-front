import {Chat} from "@/src/entities/chat";
import {Folder} from "@/src/entities/folder";

export interface ChatListProps {
  chats: Chat[];
  currentChatId: string | null;
  onSelectChat: (id: string) => void;
  onRenameChat: (id: string, newName: string, chat: Chat) => void;
  onDeleteChat: (id: string) => void;
  folders: Folder[];
  onMoveChatToFolder: (chatId: string, folderId: string | null) => void;
  onAddNewFolder: (folderName: string) => Promise<string | null>;
}
