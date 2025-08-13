import React, {useState, useRef, useEffect} from "react";
import {ListGroup, FormControl, Button, Overlay, Popover} from "react-bootstrap";
import {Trash, Pencil, Folder, FolderCheck} from "react-bootstrap-icons";
import {EditableListItemProps} from "./editable-list-item.props";
import styles from "./editable-list-item.module.css";

interface ExtendedEditableListItemProps extends EditableListItemProps {
  moveIcon?: React.ReactNode;
  onMoveClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

export const EditableListItem = ({
  id,
  name,
  isActive,
  icon,
  onSelect,
  onRename,
  onDelete,
  moveIcon,
  onMoveClick,
}: ExtendedEditableListItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [showConfirm, setShowConfirm] = useState(false);
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleRename = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onRename(id, editedName.trim());
      setIsEditing(false);
    }
  };

  const handleDeleteClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setTarget(event.currentTarget);
    setShowConfirm(prev => !prev);
  };

  const handleDeleteConfirm = () => {
    onDelete(id);
    setShowConfirm(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsEditing(false);
        setEditedName(name);
      }
    };
    if (isEditing) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isEditing, name]);

  return (
    <>
      <ListGroup.Item
        as="li"
        action
        variant={isActive ? "secondary" : "light"}
        onClick={() => onSelect(id)}
        className={`mb-1 d-flex justify-content-between align-items-center ${styles.listItem}`}
      >
        {isEditing ? (
          <FormControl
            ref={inputRef}
            size="sm"
            autoFocus
            value={editedName}
            onChange={e => setEditedName(e.target.value)}
            onKeyDown={handleRename}
            onClick={e => e.stopPropagation()}
            className={`me-2 ${styles.input}`}
          />
        ) : (
          <>
            <span className={`text-truncate ${styles.text}`}>
              {icon}
              {name}
            </span>

            <div className="d-flex gap-2">
              {moveIcon && (
                <Button
                  variant="link"
                  size="sm"
                  className={`p-0 text-secondary ${styles.btn}`}
                  onClick={e => {
                    e.stopPropagation();
                    if (onMoveClick) onMoveClick(e);
                  }}
                >
                  {moveIcon}
                </Button>
              )}

              <Button
                variant="link"
                size="sm"
                className={`p-0 text-secondary ${styles.btn}`}
                onClick={e => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
              >
                <Pencil />
              </Button>
              <Button
                variant="link"
                size="sm"
                className={`p-0 text-secondary ${styles.btn}`}
                onClick={handleDeleteClick}
              >
                <Trash />
              </Button>
            </div>
          </>
        )}
      </ListGroup.Item>

      <Overlay
        show={showConfirm}
        target={target}
        placement="left"
        containerPadding={8}
        rootClose
        onHide={() => setShowConfirm(false)}
      >
        <Popover id={`popover-delete-${id}`}>
          <Popover.Body className="p-2 small text-secondary">
            <div className="d-flex flex-column">
              <span className="mb-2">
                Delete <strong>{name}</strong>?
              </span>
              <div className="d-flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowConfirm(false)}
                >
                  Cancel
                </Button>
                <Button variant="danger" size="sm" onClick={handleDeleteConfirm}>
                  Delete
                </Button>
              </div>
            </div>
          </Popover.Body>
        </Popover>
      </Overlay>
    </>
  );
};
