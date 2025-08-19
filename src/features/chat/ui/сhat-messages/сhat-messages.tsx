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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  // const imageUrls = [
  //   "http://oai.factfactor.ru/images/1cf6e6ac5a2a40a98f7cea9841a20375.png",
  //   "http://oai.factfactor.ru/images/bfcb97bba2514abb9930fa7fc048c52b.png",
  //   "http://oai.factfactor.ru/images/bf67f9c8d99049a7b984b46355e0cb07.png",
  //   "http://oai.factfactor.ru/images/40a0bc6995cb40dcbd188183fded62fc.png",
  //   "http://oai.factfactor.ru/images/6f0a895732214f0094b7bf5390a2b11a.png",
  //   "http://oai.factfactor.ru/images/ff8b4ce6afae483ab5aeef944bc94783.png",
  //   "http://oai.factfactor.ru/images/bf67f9c8d99049a7b984b46355e0cb07.png",
  //   "http://oai.factfactor.ru/images/40a0bc6995cb40dcbd188183fded62fc.png",
  //   "http://oai.factfactor.ru/images/6f0a895732214f0094b7bf5390a2b11a.png",
  //   "http://oai.factfactor.ru/images/ff8b4ce6afae483ab5aeef944bc94783.png",
  //   "http://oai.factfactor.ru/images/bf67f9c8d99049a7b984b46355e0cb07.png",
  //   "http://oai.factfactor.ru/images/40a0bc6995cb40dcbd188183fded62fc.png",
  //   "http://oai.factfactor.ru/images/6f0a895732214f0094b7bf5390a2b11a.png",
  //   "http://oai.factfactor.ru/images/ff8b4ce6afae483ab5aeef944bc94783.png",
  // ]

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
          disabled={mounted ? router.asPath === "/" : false}
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
            const hasText = !!msg.text?.trim();
            const hasImages = msg?.imageUrls?.length > 0;

            return (
              <div
                key={msg._id}
                className={`d-flex ${
                  isUser ? "justify-content-end" : "justify-content-start"
                } mb-2`}
              >
                <div
                  className={`rounded-5 ${
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
                  {hasImages && (
                    <div className="p-2 w-100 rounded-5">
                      <FilesBlock
                        filesFromUser={isUser}
                        filesArr={msg.imageUrls}
                        onFileClick={openFileModal}
                      />
                    </div>
                  )}

                  {hasText && <div className="p-2 w-100">{msg.text}</div>}
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
        contentClassName="custom-rounded-modal"
      >
        <Modal.Body className="text-center">
          {modalFile && (
            <img
              src={modalFile}
              alt="Full view"
              style={{maxWidth: "100%", borderRadius: "2rem", maxHeight: "80vh"}}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};
