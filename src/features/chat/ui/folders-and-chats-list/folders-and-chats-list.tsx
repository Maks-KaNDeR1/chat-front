import React, {useState} from "react";
import {ListGroup} from "react-bootstrap";
import {FoldersList} from "./folders-list";
import {ChatsList} from "./chats-list";
import {useChatContext, useFolderContext} from "@/src/app/providers";
import {FoldersAndChatsListProps} from "./folders-and-chats-list.props";
import {Chat} from "@/src/entities/chat";
import {useAuthStore} from "@/src/features/auth";

export const FoldersAndChatsList = ({
  chatsList,
  currentChatId,
  currentFolderId,
  foldersList,
  handleSelectChat,
  handleSelectFolder,
}: FoldersAndChatsListProps) => {
  const {chats, updateChat, deleteChat} = useChatContext();
  const {folders, addNewFolder, deleteFolder, updateFolderName} = useFolderContext();

  const [draggedChatId, setDraggedChatId] = useState<string | null>(null);

  const handleMoveChatToFolder = (chatId: string, folderId: string | null) => {
    let folderKey: string | null = null;

    for (const key in chats) {
      if (chats[key][chatId]) {
        folderKey = key;
        break;
      }
    }
    if (!folderKey) return;

    const chat = chats[folderKey][chatId];
    if (!chat) return;

    const updatedChat: Chat = {
      ...chat,
      folder: folderId ? folders[folderId] : null,
    };

    updateChat(chatId, updatedChat);
  };
  const addNewFolderHandler = async (folderName: string): Promise<string | null> => {
    const ownerId = useAuthStore.getState().user?.id;

    if (!ownerId) return null;

    const folderId = await addNewFolder(folderName, ownerId);
    return folderId;
  };

  const renameChatHandler = (chatId: string, newName: string, chat: Chat) => {
    updateChat(chatId, {...chat, name: newName});
  };

  const defaultChats = Object.values(chats["default"] || {});

  return (
    <>
      <ListGroup style={{overflowY: "auto", height: "calc(100% - 45px)"}}>
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
          onRenameChat={renameChatHandler}
          onDeleteChat={deleteChat}
          onMoveChatToFolder={handleMoveChatToFolder}
          onAddNewFolder={addNewFolderHandler}
          draggedChatId={draggedChatId}
          setDraggedChatId={setDraggedChatId}
        />
        <div
          onDragOver={e => {
            e.preventDefault();
            e.currentTarget.style.backgroundColor = "#f0f8ff";
          }}
          onDragLeave={e => {
            e.currentTarget.style.backgroundColor = "";
          }}
          onDrop={e => {
            e.preventDefault();
            e.currentTarget.style.backgroundColor = "";
            const chatId = e.dataTransfer.getData("chatId");
            if (chatId) {
              handleMoveChatToFolder(chatId, null);
            }
          }}
          style={{
            minHeight: "50px",
            marginTop: "3px",
            transition: "background-color 0.2s",
          }}
        >
          <ChatsList
            sortable
            dropFolderId={null}
            chats={defaultChats}
            currentChatId={currentChatId}
            onSelectChat={(chatId: string) => handleSelectChat(chatId, null)}
            onRenameChat={renameChatHandler}
            onDeleteChat={deleteChat}
            folders={foldersList}
            onMoveChatToFolder={handleMoveChatToFolder}
            onAddNewFolder={addNewFolderHandler}
            draggedChatId={draggedChatId}
            setDraggedChatId={setDraggedChatId}
          />
        </div>
      </ListGroup>
    </>
  );
};
