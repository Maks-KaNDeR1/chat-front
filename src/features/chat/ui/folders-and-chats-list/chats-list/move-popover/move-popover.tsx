import React, {useRef} from "react";
import {Overlay, Popover, ListGroup, FormControl} from "react-bootstrap";
import {Folder, FolderX} from "react-bootstrap-icons";
import {MovePopoverProps} from "./move-popover.props";

export const MovePopover = ({
  show,
  target,
  chatId,
  folders,
  searchTerm,
  setSearchTerm,
  newFolderName,
  setNewFolderName,
  onFolderSelect,
  onAddNewFolder,
  onHide,
}: MovePopoverProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleNewFolderKeyDown = async (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && newFolderName.trim()) {
      const createdFolderId = await onAddNewFolder(newFolderName.trim());
      onFolderSelect(chatId, createdFolderId || null);
      setSearchTerm("");
      setNewFolderName("");
      onHide();
    }
  };

  return (
    <Overlay
      show={show}
      target={target}
      placement="bottom"
      containerPadding={8}
      rootClose
      onHide={onHide}
      flip
    >
      <Popover id={`popover-move-${chatId}`} style={{minWidth: 220}}>
        <Popover.Header as="h6" className="fw-bold">
          Переместить в папку
        </Popover.Header>
        <Popover.Body>
          <FormControl
            placeholder="Поиск папок..."
            size="sm"
            autoFocus
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="mb-2"
            ref={inputRef}
          />

          <ListGroup variant="flush" style={{maxHeight: 180, overflowY: "auto"}}>
            <ListGroup.Item action onClick={() => onFolderSelect(chatId, null)}>
              <FolderX className="me-2" />
              Без папки
            </ListGroup.Item>

            {folders.length > 0 ? (
              folders.map(folder => (
                <ListGroup.Item
                  key={folder._id}
                  action
                  onClick={() => onFolderSelect(chatId, folder._id)}
                >
                  <Folder className="me-2" />
                  {folder.name}
                </ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item disabled className="text-muted">
                Папок нет
              </ListGroup.Item>
            )}
          </ListGroup>

          <FormControl
            placeholder="В новую папку"
            size="sm"
            value={newFolderName}
            onChange={e => setNewFolderName(e.target.value)}
            onKeyDown={handleNewFolderKeyDown}
            className="mt-2"
          />
        </Popover.Body>
      </Popover>
    </Overlay>
  );
};
