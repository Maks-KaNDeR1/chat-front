import React, {useEffect, useRef, useState} from "react";
import {Form, Button, Badge} from "react-bootstrap";
import {Paperclip, Send, X} from "react-bootstrap-icons";
import {ChatInputProps} from "./chat-input.props";

export const ChatInput = ({onSend}: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Авто рост textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    const MAX_HEIGHT = 200;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, MAX_HEIGHT);
      textarea.style.height = `${newHeight}px`;
      textarea.style.overflowY = textarea.scrollHeight > MAX_HEIGHT ? "auto" : "hidden";
    }
  }, [message]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    setFiles(prevFiles => [...prevFiles, ...Array.from(selectedFiles)]);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed && files.length === 0) return;

    onSend(trimmed, files);

    setMessage("");
    setFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAttachClick = () => fileInputRef.current?.click();
  const removeFile = (index: number) =>
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));

  return (
    <div style={{display: "flex", flexDirection: "column", gap: 8}}>
      {files.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
            padding: "4px 8px",
            border: "1px solid #ddd",
            borderRadius: 24,
            background: "#f8f9fa",
          }}
        >
          {files.map((file, i) => (
            <Badge
              key={i}
              bg="secondary"
              pill
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                cursor: "pointer",
              }}
            >
              {file.name}
              <X
                style={{cursor: "pointer"}}
                onClick={() => removeFile(i)}
                title="Удалить файл"
              />
            </Badge>
          ))}
        </div>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          border: "1px solid #ddd",
          borderRadius: 24,
          padding: "4px 8px",
          background: "#fff",
        }}
      >
        <Button
          variant="outline-secondary"
          onClick={handleAttachClick}
          color="dark"
          className="rounded-circle d-flex align-items-center justify-content-center"
          style={{width: 36, height: 36, padding: 0}}
          title="Прикрепить файл"
        >
          <Paperclip />
        </Button>

        <Form.Control
          as="textarea"
          placeholder="Спросите что-нибудь..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          ref={textareaRef}
          style={{
            resize: "none",
            border: "none",
            boxShadow: "none",
            flex: 1,
            padding: "8px 0",
            minHeight: "38px",
          }}
        />

        <Button
          variant="outline-secondary"
          onClick={handleSend}
          className="rounded-circle d-flex align-items-center justify-content-center"
          style={{width: 36, height: 36, padding: 0}}
          title="Отправить"
        >
          <Send />
        </Button>

        <input
          type="file"
          multiple
          ref={fileInputRef}
          style={{display: "none"}}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};
