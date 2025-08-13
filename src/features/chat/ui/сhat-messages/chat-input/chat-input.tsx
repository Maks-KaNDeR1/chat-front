import {ProcessedFile} from "@/src/entities/dialog";
import React, {useEffect, useRef, useState} from "react";
import {Form, Button, InputGroup, Badge} from "react-bootstrap";
import {Paperclip, X} from "react-bootstrap-icons";
import {ChatInputProps} from "./chat-input.props";

export const ChatInput = ({onSend}: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<ProcessedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

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

  const fileToBase64 = (file: File): Promise<ProcessedFile> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve({
            name: file.name,
            type: file.type,
            base64: reader.result.split(",")[1],
          });
        } else {
          reject(new Error("Failed to read file"));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    try {
      const processedFiles = await Promise.all(
        Array.from(selectedFiles).map(file => fileToBase64(file))
      );
      setFiles(prevFiles => [...prevFiles, ...processedFiles]);
    } catch (error) {
      console.error("Error reading files", error);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed && files.length === 0) return;

    onSend(trimmed, files);
    setMessage("");
    setFiles([]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <Form>
      {files.length > 0 && (
        <div
          style={{
            marginBottom: 8,
            padding: 8,
            border: "1px solid #ddd",
            borderRadius: 4,
            backgroundColor: "#f8f9fa",
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          {files.map((file, i) => (
            <Badge
              key={i}
              bg="secondary"
              pill
              style={{display: "flex", alignItems: "center", gap: 4}}
            >
              {file.name}
              <X
                style={{cursor: "pointer"}}
                onClick={() => removeFile(i)}
                title="Remove file"
              />
            </Badge>
          ))}
        </div>
      )}

      <InputGroup>
        <Button variant="outline-secondary" onClick={handleAttachClick}>
          <Paperclip />
        </Button>
        <Form.Control
          as="textarea"
          placeholder="Send Messages..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          ref={textareaRef}
          style={{resize: "none"}}
        />
        <Button variant="primary" onClick={handleSend}>
          Send
        </Button>
        <input
          type="file"
          multiple
          ref={fileInputRef}
          style={{display: "none"}}
          onChange={handleFileChange}
        />
      </InputGroup>
    </Form>
  );
};
