import {Folder} from "@/src/entities/folder";

export type MovePopoverProps = {
  show: boolean;
  target: HTMLElement | null;
  chatId: string;
  folders: Folder[];
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  newFolderName: string;
  setNewFolderName: (val: string) => void;
  onFolderSelect: (chatId: string, folderId: string | null) => void;
  onAddNewFolder: (name: string) => Promise<string | null>;
  onHide: () => void;
};
