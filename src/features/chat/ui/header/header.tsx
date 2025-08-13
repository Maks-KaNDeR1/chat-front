import React, {useState} from "react";
import {SearchInput} from "./search-input";
import {Button} from "react-bootstrap";
import {AddItemModal} from "@/src/shared/ui";
import {FolderPlus} from "react-bootstrap-icons";

interface HeaderChatProps {
  handleSearch: (query: string) => void;
  addNewFolder: (name: string) => Promise<string>;
}

export const HeaderChat = ({handleSearch, addNewFolder}: HeaderChatProps) => {
  const [showAddFolderModal, setShowAddFolderModal] = useState<boolean>(false);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center gap-2">
        <SearchInput onSearch={handleSearch} />
        <Button
          className="mb-2"
          variant="outline-secondary"
          onClick={() => setShowAddFolderModal(true)}
        >
          <FolderPlus />
        </Button>
      </div>

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
