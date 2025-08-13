import {EditableListItem} from "../editable-list-item";
import {Folder, FolderX} from "react-bootstrap-icons";
import {FoldersListProps} from "./folders-list.props";
import {ListGroup} from "react-bootstrap";
import React, {useEffect} from "react";
import {ChatsList} from "../chats-list";

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
}: FoldersListProps) => {
  useEffect(() => {
    const handler = (e: Event) => {
      const {chatId, folderId} = (e as CustomEvent).detail;
      onSelectChat(chatId, folderId);
    };

    window.addEventListener("chatMove", handler);
    return () => window.removeEventListener("chatMove", handler);
  }, [onSelectChat]);

  return (
    <ListGroup>
      {folders.map(folder => {
        const isActive = currentFolderId === folder.id;
        const hasChats = chats[folder.id] && Object.keys(chats[folder.id]).length > 0;

        return (
          <React.Fragment key={folder.id}>
            <div data-folder-id={folder.id}>
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
            {isActive && hasChats && (
              <div style={{paddingLeft: 24}}>
                <ChatsList
                  currentChatId={currentChatId}
                  chats={Object.values(chats[folder.id])}
                  onSelectChat={(id: string) => onSelectChat(id, folder.id)}
                  onRenameChat={onRenameChat}
                  onDeleteChat={onDeleteChat}
                  folders={folders}
                  onMoveChatToFolder={onMoveChatToFolder}
                  onAddNewFolder={onAddNewFolder}
                />
              </div>
            )}
            {isActive && !hasChats && (
              <div
                style={{
                  paddingLeft: 24,
                  fontStyle: "italic",
                  color: "#888",
                  paddingBottom: 6,
                }}
              >
                (This folder is empty)
              </div>
            )}
          </React.Fragment>
        );
      })}
    </ListGroup>
  );
};
