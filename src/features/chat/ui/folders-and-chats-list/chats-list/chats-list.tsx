import React, { useEffect, useState } from "react";
import { ChatListProps } from "./chats-list.props";
import { ChatType } from "@/src/entities/chat";
import { EditableListItem } from "../editable-list-item";
import { ReactSortable, SortableEvent } from "react-sortablejs";
import { MovePopover } from "./move-popover";
import { Folder } from "react-bootstrap-icons";

type Props = ChatListProps & {
  sortable?: boolean;
  /** Куда помещать чат при дропе в этот список (null = "вне папок") */
  dropFolderId?: string | null;
};

export const ChatsList = ({
  chats,
  currentChatId,
  onSelectChat,
  onDeleteChat,
  onRenameChat,
  folders,
  onMoveChatToFolder,
  onAddNewFolder,
  sortable = false,
  dropFolderId = null,
}: Props) => {
  const [showMoveMenuId, setShowMoveMenuId] = useState<string | null>(null);
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFolders, setFilteredFolders] = useState(folders);
  const [newFolderName, setNewFolderName] = useState("");
  const [items, setItems] = useState<ChatType[]>(chats);

  useEffect(() => {
    setItems(chats);
  }, [chats]);

  useEffect(() => {
    const filtered = folders.filter(folder =>
      folder.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFolders(filtered);
  }, [searchTerm, folders]);

  const handleMoveIconClick = (chatId: string, e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (showMoveMenuId === chatId) {
      setShowMoveMenuId(null);
      setTarget(null);
      setSearchTerm("");
      setNewFolderName("");
    } else {
      setShowMoveMenuId(chatId);
      setTarget(e.currentTarget);
      setSearchTerm("");
      setNewFolderName("");
    }
  };

  const handleFolderSelect = (chatId: string, folderId: string | null) => {
    onMoveChatToFolder(chatId, folderId);
    setShowMoveMenuId(null);
  };

  return (
    <ReactSortable
      list={items}
      setList={setItems}
      group={{ name: "chats", pull: true, put: true }}
      sort={sortable}
      animation={150}
      fallbackOnBody
      swapThreshold={0.65}
      onAdd={(evt: SortableEvent) => {
        const chatId = evt.item.dataset.id as string;
        onMoveChatToFolder(chatId, dropFolderId ?? null);
      }}
    >
      {items.map(chat => (
        <div key={chat.id} data-id={chat.id} >
          <EditableListItem
            id={chat.id}
            name={chat.name}
            isActive={currentChatId === chat.id}
            onSelect={onSelectChat}
            onRename={onRenameChat}
            onDelete={onDeleteChat}
            moveIcon={<Folder />}
            onMoveClick={e => handleMoveIconClick(chat.id, e)}
          />

          <MovePopover
            show={showMoveMenuId === chat.id}
            target={target}
            chatId={chat.id}
            folders={filteredFolders}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            newFolderName={newFolderName}
            setNewFolderName={setNewFolderName}
            onFolderSelect={handleFolderSelect}
            onAddNewFolder={onAddNewFolder}
            onHide={() => setShowMoveMenuId(null)}
          />
        </div>
      ))}
    </ReactSortable>
  );
};
