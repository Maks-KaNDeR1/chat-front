"use client";

import React, {useState} from "react";
import Head from "next/head";
import {useChatContext, useFolderContext, useMessageContext} from "@/src/app/providers";
import {Col, Row, Offcanvas, Button} from "react-bootstrap";
import {SearchInput} from "../header/search-input";
import {ChatMessages} from "../сhat-messages";
import {ChatComponentProps} from "./chat.props";
import {FoldersAndChatsList} from "../folders-and-chats-list";
import styles from "./chat.module.css";
import {HeaderChat} from "../header";
import {Chat as ChatType, useChatPage} from "@/src/entities/chat";
import {useAuthStore} from "@/src/features/auth";

const getCurrentChatName = (
  chatId: string | null,
  chats: Record<string, Record<string, ChatType>>,
  currentFolderId: string | null
): string => {
  if (!chatId) return "Новый чат";

  if (currentFolderId && chats[currentFolderId]?.[chatId]) {
    return chats[currentFolderId][chatId].name;
  }

  if (chats["default"]?.[chatId]) {
    return chats["default"][chatId].name;
  }

  for (const fId in chats) {
    if (chats[fId]?.[chatId]) return chats[fId][chatId].name;
  }

  return "Новый чат";
};

export const ChatComponent = () => {
  const {
    currentChatId,
    currentFolderId,
    handleSelectChat,
    handleSelectFolder,
    handleSearch,
  } = useChatPage();

  const {getMessageChatId} = useMessageContext();
  const {chats, addNewChat} = useChatContext();
  const {folders, addNewFolder} = useFolderContext();
  const [showSidebar, setShowSidebar] = useState(false);
  const userId = useAuthStore(state => state.user?._id);

  const currentDialog = currentChatId ? getMessageChatId(currentChatId) : [];
  const name = getCurrentChatName(currentChatId, chats, currentFolderId);

  return (
    <>
      <Head>
        <title>{name}</title>
        <meta name="description" content={`Chat ${name}`} />
        <meta name="keywords" content="Chat" />
      </Head>

      <Row style={{height: "calc(100vh - 70px)"}}>
        <Col
          lg={4}
          className="d-none d-lg-block h-100"
          style={{borderRadius: 40}}
          // style={{height: "calc(100vh - 75px)", borderRadius: 40}}
        >
          <HeaderChat
            handleSearch={handleSearch}
            addNewFolder={(name: string) => {
              if (userId) {
                addNewFolder(name, userId);
              }
            }}
          />

          <FoldersAndChatsList
            currentChatId={currentChatId}
            currentFolderId={currentFolderId}
            foldersList={Object.values(folders)}
            chatsList={Object.values(chats["default"] || {})}
            handleSelectChat={handleSelectChat}
            handleSelectFolder={handleSelectFolder}
          />
        </Col>

        <Col
          xs={12}
          lg={8}
          className="h-100"
          style={{position: "relative"}}
          // style={{height: "calc(100vh - 70px)", position: "relative"}}
        >
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
            message={currentDialog}
            addNewChat={(name: string) => {
              if (userId) {
                addNewChat(name, currentFolderId || "default", userId);
              }
            }}
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
          <Offcanvas.Title>Папки и чаты</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="pt-1 overflow-hidden">
          <HeaderChat
            handleSearch={handleSearch}
            addNewFolder={(name: string) => {
              if (userId) {
                addNewFolder(name, userId);
              }
            }}
          />

          <FoldersAndChatsList
            currentChatId={currentChatId}
            currentFolderId={currentFolderId}
            foldersList={Object.values(folders)}
            chatsList={Object.values(chats["default"] || {})}
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
