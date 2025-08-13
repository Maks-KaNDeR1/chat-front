import React, {useState} from "react";
import {Button, ListGroup} from "react-bootstrap";
import {FoldersList} from "./folders-list";
import {ChatsList} from "./chats-list";
import {useChatContext, useFolderContext} from "@/src/app/providers";
import {FoldersAndChatsListProps} from "./folders-and-chats-list.props";
import {AddItemModal} from "@/src/shared/ui";


// // Loop through each nested sortable element
// for (var i = 0; i < nestedSortables.length; i++) {
// 	new Sortable(nestedSortables[i], {
// 		group: 'nested',
// 		animation: 150,
// 		fallbackOnBody: true,
// 		swapThreshold: 0.65
// 	});
// }

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

  const [showAddFolderModal, setShowAddFolderModal] = useState<boolean>(false);

  const handleMoveChatToFolder = (chatId: string, folderId: string | null) => {
    updateChatById(chatId, {folder: folderId});
  };

  return (
    <>
      <Button className="mb-2" size="sm" onClick={() => setShowAddFolderModal(true)}>
        Add Folder
      </Button>

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

        {chats["default"] && Object.keys(chats["default"]).length > 0 && (
          <ChatsList
            chats={chatsList}
            currentChatId={currentChatId}
            onSelectChat={(chatId: string) => handleSelectChat(chatId, null)}
            onRenameChat={updateChatName}
            onDeleteChat={deleteChat}
            folders={foldersList}
            onMoveChatToFolder={handleMoveChatToFolder}
            onAddNewFolder={addNewFolder}
          />
        )}
      </ListGroup>

      <AddItemModal
        show={showAddFolderModal}
        onClose={() => setShowAddFolderModal(false)}
        onAdd={addNewFolder}
        title="New folder"
        placeholder="Enter folder name"
      />
    </>
  );
};
