import React from "react";
import {ChatType} from "@/src/entities/chat";
import {FoldersListProps} from "./folders-list.props";
import {EditableListItem} from "../editable-list-item";
import {ChatsList} from "../chats-list";
import {ListGroup} from "react-bootstrap";
import {Folder, FolderX} from "react-bootstrap-icons";

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
  return (
    <ListGroup>
      {folders.map(folder => {
        const isActive = currentFolderId === folder.id;
        const folderChats: ChatType[] = Object.values(chats[folder.id] || {});
        const hasChats = folderChats.length > 0;

        return (
          <React.Fragment key={folder.id}>
            <div
              data-folder-id={folder.id}
              onDragOver={e => {
                e.preventDefault();
                if (!isActive) {
                  onSelectFolder(folder.id);
                }
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
                />

                {!hasChats && (
                  <div
                    style={{
                      fontStyle: "italic",
                      color: "#888",
                      paddingBottom: 6,
                      marginTop: 6,
                    }}
                  >
                    (This folder is empty)
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
