import React, {useEffect, useState} from "react";
import {ChatListProps} from "./chats-list.props";
import {Chat} from "@/src/entities/chat";
import {EditableListItem} from "../editable-list-item";
import {MovePopover} from "./move-popover";
import {Folder} from "react-bootstrap-icons";

interface ExtendedChatListProps extends ChatListProps {
  draggedChatId: string | null;
  setDraggedChatId: (id: string | null) => void;
  sortable?: boolean;
  dropFolderId?: string | null;
}

export const ChatsList = React.memo(
  ({
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
    draggedChatId,
    setDraggedChatId,
  }: ExtendedChatListProps) => {
    const [showMoveMenuId, setShowMoveMenuId] = useState<string | null>(null);
    const [target, setTarget] = useState<HTMLElement | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredFolders, setfilteredFolders] = useState(folders);
    const [newFolderName, setNewFolderName] = useState("");
    const [items, setItems] = useState<Chat[]>(chats);

    useEffect(() => {
      setItems(chats);
    }, [chats]);

    useEffect(() => {
      const filtered = folders.filter(folder =>
        folder.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setfilteredFolders(filtered);
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

    const handleDragStart = (e: React.DragEvent, chat: Chat) => {
      setDraggedChatId(chat._id);
      e.dataTransfer.setData("chatId", chat._id);
      e.dataTransfer.effectAllowed = "move";
    };

    const handleDragEnd = () => {
      setDraggedChatId(null);
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
    };

    return (
      <div onDragOver={handleDragOver}>
        {items.map(chat => (
          <div
            key={chat._id}
            data-id={chat._id}
            draggable={sortable}
            onDragStart={e => handleDragStart(e, chat)}
            onDragEnd={handleDragEnd}
            style={{
              opacity: draggedChatId === chat._id ? 0.5 : 1,
              transition: "all 0.2s",
              padding: "2px",
              borderRadius: "4px",
            }}
          >
            <EditableListItem
              id={chat._id}
              name={chat.name}
              isActive={currentChatId === chat._id}
              onSelect={onSelectChat}
              onRename={(id: string, newName: string) => onRenameChat(id, newName, chat)}
              onDelete={onDeleteChat}
              moveIcon={<Folder />}
              onMoveClick={e => handleMoveIconClick(chat._id, e)}
              draggable={sortable}
            />
            <MovePopover
              show={showMoveMenuId === chat._id}
              target={target}
              chatId={chat._id}
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
      </div>
    );
  }
);
