import {useState, useCallback, useEffect, useRef} from "react";
import {useRouter} from "next/router";
import {useChatContext, useFolderContext, useMessageContext} from "@/src/app/providers";
import {useSortedAndFiltered} from "../lib";
import {useAuthStore} from "@/src/features/auth";
import {useFetchUser} from "../../user";
import {useLoadingAppStore} from "@/src/shared/store";
import {searchAll} from "../api";
import {handleSearchApi} from "../../search";

export const useChatPage = () => {
  useFetchUser();
  const {
    chats,
    currentChatId,
    selectChat,
    addNewChat,
    setChats,
    loading: chatsLoading,
  } = useChatContext();
  const {
    folders,
    currentFolderId,
    selectFolder,
    setFolders,
    loading: foldersLoading,
  } = useFolderContext();
  const {sendMessageToChat, loadMessagesForChat} = useMessageContext();
  const router = useRouter();
  const isLoaded = !chatsLoading && !foldersLoading;
  const {isAuthorized, waiting} = useAuthStore(state => state);
  const userId = useAuthStore(state => state.user?._id);
  const {setLoading} = useLoadingAppStore();
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!isAuthorized && !waiting) router.push("/login");
  }, [isAuthorized, router]);

  useEffect(() => {
    if (isAuthorized) setLoading(!isLoaded);
  }, [isLoaded]);

  // Инициализация из query
  useEffect(() => {
    if (!router.isReady || initializedRef.current) return;

    const {folder, chat} = router.query;

    if (folder && typeof folder === "string") selectFolder(folder);

    if (chat && typeof chat === "string") {
      selectChat(chat);
      loadMessagesForChat(chat);
    }

    initializedRef.current = true;
  }, [router.isReady]);

  const [pendingMessage, setPendingMessage] = useState<{
    message: string;
    files: File[];
  } | null>(null);

  // Обновление query
  const updateQuery = useCallback(
    (chatId: string, folderId?: string | null) => {
      const query: Record<string, string> = {};
      if (folderId) query.folder = folderId;
      query.chat = chatId;

      const currentQuery = router.query;
      if (currentQuery.chat !== query.chat || currentQuery.folder !== query.folder) {
        router.replace({pathname: "/", query}, undefined, {shallow: true});
      }
    },
    [router]
  );

  const handleSelectChat = useCallback(
    async (chatId: string, folderId?: string | null) => {
      if (!chatId) return;

      selectChat(chatId);
      if (folderId) selectFolder(folderId);
      else selectFolder(null);

      updateQuery(chatId, folderId);
      await loadMessagesForChat(chatId);
    },
    [selectChat, selectFolder, loadMessagesForChat, updateQuery]
  );

  const handleSelectFolder = (folderId: string | null) => {
    selectFolder(folderId);
  };

  const handleSearch = async (query: string) => {
    handleSearchApi(query, setChats, setFolders);
  };

  const resetSelectedFoldersAndChats = () => {
    selectChat(null);
    selectFolder(null);
    router.replace({pathname: "/", query: {}}, undefined, {shallow: true});
  };

  const onSendMessage = useCallback(
    async (message: string, files: File[] = []) => {
      if (!userId) return;

      let chatIdToSend = currentChatId;

      if (!chatIdToSend) {
        const folderKey = currentFolderId || null;
        const newChatName = message.slice(0, 20) || "New Chat";

        chatIdToSend = await addNewChat(newChatName, folderKey || "default", userId);
        selectChat(chatIdToSend);

        updateQuery(chatIdToSend, folderKey);
      }

      await sendMessageToChat(chatIdToSend, message, files);
    },
    [
      currentChatId,
      currentFolderId,
      addNewChat,
      selectChat,
      userId,
      sendMessageToChat,
      updateQuery,
    ]
  );

  // Если есть pendingMessage после создания чата — отправляем
  useEffect(() => {
    if (currentChatId && pendingMessage) {
      sendMessageToChat(currentChatId, pendingMessage.message, pendingMessage.files);
      setPendingMessage(null);
    }
  }, [currentChatId, pendingMessage, sendMessageToChat]);

  return {
    folders,
    chats,
    handleSelectChat,
    resetSelectedFoldersAndChats,
    handleSelectFolder,
    handleSearch,
    currentChatId,
    currentFolderId,
    onSendMessage,
    isLoaded,
  };
};
