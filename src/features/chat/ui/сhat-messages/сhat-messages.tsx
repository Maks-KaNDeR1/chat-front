import React, {useEffect, useRef, useState} from "react";
import {AddItemModal} from "@/src/shared/ui";
import {Button, Modal} from "react-bootstrap";
import {ChatInput} from "./chat-input";
import {FilesBlock} from "./files-block";
import {ChatMessagesProps} from "./сhat-messages.props";
import {useRouter} from "next/router";
import {useChatPage} from "@/src/entities/chat";
import {ChatDots} from "react-bootstrap-icons";

export const ChatMessages = ({name, message, addNewChat}: ChatMessagesProps) => {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [modalFile, setModalFile] = useState<string | null>(null);
  const [showAddChatModal, setShowAddChatModal] = useState(false);
  const router = useRouter();
  const {resetSelectedFoldersAndChats: reset, onSendMessage} = useChatPage();

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
  }, [message]);

  return (
    <div className="d-flex flex-column h-100 border rounded-5 p-3 position-relative">
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
          onClick={() => {
            reset();
            router.push("/");
          }}
          style={{whiteSpace: "nowrap"}}
          disabled={router.asPath === "/"}
          variant="outline-secondary"
          size="sm"
        >
          Новый чат
        </Button>
      </div>

      <hr className="mt-0 mb-3 w-100" />

      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-grow-1 mb-3 position-relative"
        style={{
          display: "flex",
          flexDirection: "column-reverse",
          overflowY: "auto",
          overflowX: "hidden",
          scrollBehavior: "smooth",
        }}
      >
        {message?.length === 0 && (
          <div
            className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center text-secondary"
            style={{
              gap: "10px",
              opacity: 0.8,
              pointerEvents: "none",
              userSelect: "none",
            }}
          >
            <ChatDots size={50} />
            <div className="fs-5 fw-medium">Что хотите сегодня узнать?</div>
          </div>
        )}

        {message
          .slice()
          .reverse()
          .map((msg, index) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={msg._id}
                className={`d-flex ${
                  isUser ? "justify-content-end" : "justify-content-start"
                } mb-2`}
              >
                <div
                  className={`p-2 rounded-5 ${
                    isUser ? "text-dark" : "bg-secondary text-white"
                  }`}
                  style={{
                    maxWidth: "75%",
                    wordBreak: "break-word",
                    whiteSpace: "pre-wrap",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: isUser ? "flex-end" : "flex-start",
                    ...(isUser ? {backgroundColor: "#ced4daeb"} : {}),
                  }}
                >
                  {msg?.imageUrls?.length > 0 && (
                    <FilesBlock
                      filesFromUser={isUser}
                      filesArr={msg.imageUrls}
                      onFileClick={openFileModal}
                    />
                  )}
                  <div>{msg.name}</div>
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
        title="Новый чат"
        placeholder="Введите имя чата..."
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
