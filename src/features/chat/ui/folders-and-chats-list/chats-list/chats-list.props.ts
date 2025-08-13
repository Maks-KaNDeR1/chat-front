import {ChatType} from "@/src/entities/chat";
import {FolderType} from "@/src/entities/folder";

export interface ChatListProps {
  chats: ChatType[];
  currentChatId: string | null;
  onSelectChat: (id: string) => void;
  onRenameChat: (id: string, newName: string) => void;
  onDeleteChat: (id: string) => void;
  folders: FolderType[];
  onMoveChatToFolder: (chatId: string, folderId: string | null) => void;
  onAddNewFolder: (folderName: string) => Promise<string>;
}
