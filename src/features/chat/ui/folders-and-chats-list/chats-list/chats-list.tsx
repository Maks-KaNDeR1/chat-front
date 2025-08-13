import React, {useState, useRef, useEffect} from "react";
import {Overlay, Popover, ListGroup, FormControl} from "react-bootstrap";
import {Folder, FolderX} from "react-bootstrap-icons";
import {EditableListItem} from "../editable-list-item";
import {ChatListProps} from "./chats-list.props";

export const ChatsList = ({
  chats,
  currentChatId,
  onSelectChat,
  onDeleteChat,
  onRenameChat,
  folders,
  onMoveChatToFolder,
  onAddNewFolder,
}: ChatListProps) => {
  const [showMoveMenuId, setShowMoveMenuId] = useState<string | null>(null);
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFolders, setFilteredFolders] = useState(folders);
  const [newFolderName, setNewFolderName] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleNewFolderKeyDown = async (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    chatId: string
  ) => {
    if (e.key === "Enter" && newFolderName.trim()) {
      const createdFolderId = await onAddNewFolder(newFolderName.trim());
      onMoveChatToFolder(chatId, createdFolderId);
      setShowMoveMenuId(null);
      setSearchTerm("");
      setNewFolderName("");
    }
  };

  return (
    <>
      {chats.map(chat => (
        <React.Fragment key={chat.id}>
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
          <Overlay
            show={showMoveMenuId === chat.id}
            target={target}
            placement="bottom"
            containerPadding={8}
            rootClose
            onHide={() => setShowMoveMenuId(null)}
          >
            <Popover id={`popover-move-${chat.id}`} style={{minWidth: 220}}>
              <Popover.Header as="h6" className="fw-bold">
                Move to folder
              </Popover.Header>
              <Popover.Body>
                <FormControl
                  placeholder="Search folders..."
                  size="sm"
                  autoFocus
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="mb-2"
                  ref={inputRef}
                />

                <ListGroup variant="flush" style={{maxHeight: 180, overflowY: "auto"}}>
                  <ListGroup.Item
                    action
                    onClick={() => handleFolderSelect(chat.id, null)}
                  >
                    <FolderX className="me-2" />
                    no folder
                  </ListGroup.Item>

                  {filteredFolders.length > 0 ? (
                    filteredFolders.map(folder => (
                      <ListGroup.Item
                        key={folder.id}
                        action
                        onClick={() => handleFolderSelect(chat.id, folder.id)}
                      >
                        <Folder className="me-2" />
                        {folder.name}
                      </ListGroup.Item>
                    ))
                  ) : (
                    <ListGroup.Item disabled className="text-muted">
                      Папки не найдены
                    </ListGroup.Item>
                  )}
                </ListGroup>

                <FormControl
                  placeholder="Create new foler"
                  size="sm"
                  value={newFolderName}
                  onChange={e => setNewFolderName(e.target.value)}
                  onKeyDown={e => handleNewFolderKeyDown(e, chat.id)}
                  className="mt-2"
                />
              </Popover.Body>
            </Popover>
          </Overlay>
        </React.Fragment>
      ))}
    </>
  );
};
