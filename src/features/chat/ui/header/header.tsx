import React, {useState, useRef, useEffect} from "react";
import {SearchInput} from "./search-input";
import {Button, Form, InputGroup} from "react-bootstrap";
import {FolderPlus, X} from "react-bootstrap-icons";

interface HeaderChatProps {
  handleSearch: (query: string) => void;
  addNewFolder: (name: string) => void;
}

export const HeaderChat = ({handleSearch, addNewFolder}: HeaderChatProps) => {
  const [showFolderInput, setShowFolderInput] = useState(false);
  const [folderName, setFolderName] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        if (showFolderInput) {
          if (folderName.trim()) {
            addNewFolder(folderName.trim());
          }
          setFolderName("");
          setShowFolderInput(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showFolderInput, folderName, addNewFolder]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.length <= 20) {
      setFolderName(val);
      setError(null);
    } else {
      setError(`Максимальная длина — ${20} символов`);
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && folderName.trim()) {
      e.preventDefault();
      addNewFolder(folderName.trim());
      setFolderName("");
      setShowFolderInput(false);
    }
  };

  return (
    <div ref={containerRef}>
      <div className="d-flex justify-content-between align-items-center gap-2">
        <SearchInput onSearch={handleSearch} />
        <Button
          variant="outline-secondary"
          className="mb-2 rounded-circle d-flex align-items-center justify-content-center"
          style={{width: 38, height: 38, padding: 0, flexShrink: 0}}
          onClick={() => {
            setShowFolderInput(true);
            setTimeout(() => inputRef.current?.focus(), 0);
          }}
        >
          <FolderPlus />
        </Button>
      </div>

      {showFolderInput && (
        <InputGroup className="mb-2 mt-1">
          <Form.Control
            ref={inputRef}
            type="text"
            placeholder="Введите имя папки..."
            value={folderName}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            isInvalid={!!error}
            className={folderName.length > 1 ? "rounded-start-pill" : "rounded-5"}
          />
          {folderName && (
            <InputGroup.Text
              onClick={() => {
                setFolderName("");
                setError(null);
              }}
              style={{cursor: "pointer"}}
              className="rounded-end-pill"
            >
              <X />
            </InputGroup.Text>
          )}

          <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
        </InputGroup>
      )}
    </div>
  );
};
