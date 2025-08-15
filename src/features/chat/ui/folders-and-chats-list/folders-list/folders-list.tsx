import React, {useState} from "react";
import {FoldersListProps} from "./folders-list.props";
import {EditableListItem} from "../editable-list-item";
import {ChatsList} from "../chats-list";
import {ListGroup} from "react-bootstrap";
import {Folder, FolderX} from "react-bootstrap-icons";

interface ExtendedFoldersListProps extends FoldersListProps {
  draggedChatId: string | null;
  setDraggedChatId: (id: string | null) => void;
}

export const FoldersList = ({
  folders,
  currentFolderId,
  onSelectFolder,
  onRenameFolder,
  onDeleteFolder,
  chats,
  currentChatId,
  onSelectChat,
  onDeleteChat,
  onRenameChat,
  onAddNewFolder,
  onMoveChatToFolder,
  draggedChatId,
  setDraggedChatId,
}: ExtendedFoldersListProps) => {
  const [hoveredFolderId, setHoveredFolderId] = useState<string | null>(null);

  return (
    <ListGroup>
      {folders.map(folder => {
        const isActive = currentFolderId === folder.id;
        const isHovered = hoveredFolderId === folder.id;
        const folderChats = Object.values(chats[folder.id] || {});
        const hasChats = folderChats.length > 0;

        return (
          <React.Fragment key={folder.id}>
            <div
              data-folder-id={folder.id}
              onDragOver={e => {
                e.preventDefault();
                setHoveredFolderId(folder.id);
              }}
              onDragLeave={() => {
                setHoveredFolderId(null);
              }}
              onDrop={e => {
                e.preventDefault();
                const chatId = e.dataTransfer.getData("chatId");
                if (chatId) {
                  onMoveChatToFolder(chatId, folder.id);
                }
                setHoveredFolderId(null);
              }}
              style={{
                backgroundColor: isHovered ? "#435e7368" : "transparent",
                transition: "background-color 0.2s",
                padding: "4px",
                borderRadius: "4px",
              }}
            >
              <EditableListItem
                id={folder.id}
                name={folder.name}
                isActive={isActive}
                icon={
                  hasChats ? (
                    <Folder className="me-2" />
                  ) : (
                    <FolderX className="me-2 text-muted" />
                  )
                }
                onSelect={(id: string) => onSelectFolder(isActive ? null : id)}
                onRename={onRenameFolder}
                onDelete={onDeleteFolder}
              />
            </div>
            {isActive && (
              <div style={{paddingLeft: 24}}>
                <ChatsList
                  sortable
                  dropFolderId={folder.id}
                  currentChatId={currentChatId}
                  chats={folderChats}
                  onSelectChat={(id: string) => onSelectChat(id, folder.id)}
                  onRenameChat={onRenameChat}
                  onDeleteChat={onDeleteChat}
                  folders={folders}
                  onMoveChatToFolder={onMoveChatToFolder}
                  onAddNewFolder={onAddNewFolder}
                  draggedChatId={draggedChatId}
                  setDraggedChatId={setDraggedChatId}
                />
                {!hasChats && (
                  <div
                    style={{
                      fontStyle: "italic",
                      color: "#888",
                      paddingBottom: 6,
                    }}
                  >
                    (Эта папка пуста)
                  </div>
                )}
              </div>
            )}
          </React.Fragment>
        );
      })}
    </ListGroup>
  );
};
