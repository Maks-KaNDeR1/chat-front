import React, {useState} from "react";
import {Button, ListGroup} from "react-bootstrap";
import {FoldersList} from "./folders-list";
import {ChatsList} from "./chats-list";
import {useChatContext, useFolderContext} from "@/src/app/providers";
import {FoldersAndChatsListProps} from "./folders-and-chats-list.props";
import {AddItemModal} from "@/src/shared/ui";
import {ChatType} from "@/src/entities/chat";

export const FoldersAndChatsList = ({
  chatsList,
  currentChatId,
  currentFolderId,
  foldersList,
  handleSelectChat,
  handleSelectFolder,
}: FoldersAndChatsListProps) => {
  const {chats, updateChatName, deleteChat, updateChatById} = useChatContext();
  const {addNewFolder, deleteFolder, updateFolderName} = useFolderContext();

  const handleMoveChatToFolder = (chatId: string, folderId: string | null) => {
    updateChatById(chatId, {folder: folderId});
  };

  const defaultChats: ChatType[] = Object.values(chats["default"] || {});

  return (
    <>
      <ListGroup style={{overflowY: "auto", height: "calc(100% - 93px)"}}>
        <FoldersList
          folders={foldersList}
          currentChatId={currentChatId}
          onSelectChat={(chatId: string, folderId: string) =>
            handleSelectChat(chatId, folderId)
          }
          onDeleteFolder={deleteFolder}
          onRenameFolder={updateFolderName}
          onSelectFolder={handleSelectFolder}
          currentFolderId={currentFolderId}
          chats={chats}
          onRenameChat={updateChatName}
          onDeleteChat={deleteChat}
          onMoveChatToFolder={handleMoveChatToFolder}
          onAddNewFolder={addNewFolder}
        />

        <ChatsList
          sortable
          dropFolderId={null}
          chats={defaultChats}
          currentChatId={currentChatId}
          onSelectChat={(chatId: string) => handleSelectChat(chatId, null)}
          onRenameChat={updateChatName}
          onDeleteChat={deleteChat}
          folders={foldersList}
          onMoveChatToFolder={handleMoveChatToFolder}
          onAddNewFolder={addNewFolder}
        />
      </ListGroup>

    </>
  );
};
