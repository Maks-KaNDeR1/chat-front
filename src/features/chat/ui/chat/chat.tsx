import React, {useState} from "react";
import Head from "next/head";
import {useChatContext, useDialogContext} from "@/src/app/providers";
import {ChatType} from "@/src/entities/chat";
import {Col, Row, Offcanvas, Button} from "react-bootstrap";
import {SearchInput} from "../search-input";
import {ChatMessages} from "../сhat-messages";
import {ChatComponentProps} from "./chat.props";
import {FoldersAndChatsList} from "../folders-and-chats-list";
import styles from "./chat.module.css";

const getCurrentChatName = (
  chatId: string | null,
  chats: Record<string, Record<string, ChatType>>,
  currentFolderId: string | null
): string => {
  if (!chatId) return "New Chat";

  if (currentFolderId && chats[currentFolderId]?.[chatId]) {
    return chats[currentFolderId][chatId].name;
  }

  if (chats["default"]?.[chatId]) {
    return chats["default"][chatId].name;
  }

  for (const fId in chats) {
    if (chats[fId]?.[chatId]) return chats[fId][chatId].name;
  }

  return "New Chat";
};

export const ChatComponent = ({
  currentChatId,
  currentFolderId,
  filteredChats,
  filteredFolders,
  handleSearch,
  handleSelectChat,
  handleSelectFolder,
  sendMessage,
}: ChatComponentProps) => {
  const {getDialogByChatId} = useDialogContext();
  const {chats, addNewChat} = useChatContext();
  const [showSidebar, setShowSidebar] = useState(false);

  const currentDialog = currentChatId ? getDialogByChatId(currentChatId) : [];
  const name = getCurrentChatName(currentChatId, chats, currentFolderId);

  return (
    <>
      <Head>
        <title>{name}</title>
        <meta name="description" content={`Chat ${name}`} />
        <meta name="keywords" content="Chat" />
      </Head>

      <Row>
        <Col
          lg={6}
          className="d-none d-lg-block"
          style={{height: "calc(100vh - 80px)", borderRadius: 40}}
        >
          <SearchInput onSearch={handleSearch} />

          <FoldersAndChatsList
            currentChatId={currentChatId}
            currentFolderId={currentFolderId}
            foldersList={filteredFolders}
            chatsList={filteredChats}
            handleSelectChat={handleSelectChat}
            handleSelectFolder={handleSelectFolder}
          />
        </Col>

        <Col xs={12} lg={6} style={{height: "calc(100vh - 80px)", position: "relative"}}>
          <Button
            variant="light"
            onClick={() => setShowSidebar(true)}
            className={`d-lg-none ${styles.burgerBtn}`}
            style={{
              position: "absolute",
              top: 17,
              left: 24,
              zIndex: 1000,
              borderRadius: "50%",
            }}
          >
            ☰
          </Button>

          <ChatMessages
            name={name}
            dialog={currentDialog}
            addNewChat={(name: string) => {
              const newChat = {name, folder: currentFolderId || null};
              addNewChat(currentFolderId || "default", newChat);
            }}
            onSendMessage={sendMessage}
          />
        </Col>
      </Row>

      <Offcanvas
        show={showSidebar}
        onHide={() => setShowSidebar(false)}
        placement="start"
        className="d-lg-none"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Chats</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <SearchInput onSearch={handleSearch} />
          <FoldersAndChatsList
            currentChatId={currentChatId}
            currentFolderId={currentFolderId}
            foldersList={filteredFolders}
            chatsList={filteredChats}
            handleSelectChat={(chatId, folderId) => {
              handleSelectChat(chatId, folderId);
              setShowSidebar(false);
            }}
            handleSelectFolder={handleSelectFolder}
          />
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};
