import React, {useEffect, useRef, useState} from "react";
import {AddItemModal} from "@/src/shared/ui";
import {Button, Modal} from "react-bootstrap";
import {ChatInput} from "./chat-input";
import {FilesBlock} from "./files-block";
import {ChatMessagesProps} from "./сhat-messages.props";

export const ChatMessages = ({
  name,
  dialog,
  onSendMessage,
  addNewChat,
}: ChatMessagesProps) => {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [modalFile, setModalFile] = useState<string | null>(null);
  const [showAddChatModal, setShowAddChatModal] = useState(false);

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const openFileModal = (fileUrl: string) => setModalFile(fileUrl);

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const scrollTop = container.scrollTop;

    setShowScrollButton(scrollTop < -400);
  };

  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTo({top: 0, behavior: "smooth"});
    }
  };

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({top: 0, behavior: "smooth"});
    }
  }, [dialog]);

  return (
    <div className="d-flex flex-column h-100 border rounded p-3 position-relative">
      <div className="d-flex justify-content-between align-items-center mb-3 ps-5 ps-lg-0">
        <h5
          style={{
            // whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            // lineHeight: "1.3",
          }}
          title={name}
        >
          {name}
        </h5>

        <Button
          onClick={() => setShowAddChatModal(true)}
          style={{whiteSpace: "nowrap"}}
          variant="secondary"
          size="sm"
        >
          New chat +
        </Button>
      </div>

      <hr className="mt-0 mb-3 w-100" />

      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-grow-1 mb-3"
        style={{
          display: "flex",
          flexDirection: "column-reverse",
          overflowY: "auto",
          scrollBehavior: "smooth",
        }}
      >
        {dialog
          .slice()
          .reverse()
          .map((msg, index) => {
            const isUser = msg.sender === "User";

            return (
              <div
                key={index}
                className={`d-flex ${
                  isUser ? "justify-content-end" : "justify-content-start"
                } mb-2`}
              >
                <div
                  className={`p-2 rounded ${isUser ? "text-dark" : "bg-light text-dark"}`}
                  style={{
                    maxWidth: "75%",
                    textAlign: isUser ? "right" : "left",
                    wordBreak: "break-word",
                    whiteSpace: "pre-wrap",
                    ...(isUser ? {backgroundColor: "#dbe9ff"} : {}),
                  }}
                >
                  {msg.files.length > 0 && (
                    <FilesBlock
                      filesFromUser={isUser}
                      filesArr={msg.files}
                      onFileClick={openFileModal}
                    />
                  )}
                  <div>{msg.message}</div>
                </div>
              </div>
            );
          })}
      </div>

      {showScrollButton && (
        <Button
          variant="secondary"
          size="sm"
          className="position-absolute"
          style={{bottom: "80px", right: "20px", zIndex: 1050}}
          onClick={scrollToBottom}
        >
          ↓
        </Button>
      )}

      <ChatInput
        onSend={(message, files) => {
          onSendMessage(message, files);
        }}
      />

      <AddItemModal
        show={showAddChatModal}
        onClose={() => setShowAddChatModal(false)}
        onAdd={addNewChat}
        title="New chat"
        placeholder="Enter chat name"
      />

      <Modal
        show={modalFile !== null}
        onClick={() => setModalFile(null)}
        onHide={() => setModalFile(null)}
        centered
        size="lg"
      >
        <Modal.Body className="text-center">
          {modalFile && (
            <img
              src={modalFile}
              alt="Full view"
              style={{maxWidth: "100%", maxHeight: "80vh"}}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};
