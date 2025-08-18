import {useState, useCallback, useEffect} from "react";
import {useRouter} from "next/router";
import {useChatContext, useFolderContext, useMessageContext} from "@/src/app/providers";
import {useInitSelectionFromPath, useSortedAndFiltered} from "../lib";
import {useAuthStore} from "@/src/features/auth";
import {useFetchUser} from "../../user";
import {useLoadingStore} from "@/src/shared/store";

export const useChatPage = () => {
  useFetchUser();
  const {
    chats,
    currentChatId,
    selectChat,
    addNewChat,
    loading: chatsLoading,
  } = useChatContext();
  const {
    folders,
    currentFolderId,
    selectFolder,
    loading: foldersLoading,
  } = useFolderContext();
  const {sendMessageToChat, loadMessagesForChat} = useMessageContext();
  const router = useRouter();
  const isLoaded = !chatsLoading && !foldersLoading;
  const isAuthorized = useAuthStore(state => state.isAuthorized);
  const userId = useAuthStore(state => state.user?._id);
  const [searchQuery, setSearchQuery] = useState("");

  console.log(isAuthorized);

  useEffect(() => {
    if (!isAuthorized) {
      router.push("/login");
    } else {
      if (router.asPath === "/login" || router.asPath === "/register") {
        router.push("/");
      }
    }
  }, [isAuthorized, router]);

  const {setLoading} = useLoadingStore();

  useEffect(() => {
    if (isAuthorized) {
      setLoading(!isLoaded);
    }
  }, [isLoaded]);

  // Для временного хранения сообщения до создания чата
  const [pendingMessage, setPendingMessage] = useState<{
    message: string;
    files: File[];
  } | null>(null);

  // Инициализация выбора папки и чата из URL
  const {notFound} = useInitSelectionFromPath(
    folders,
    chats,
    currentChatId,
    currentFolderId,
    selectFolder,
    selectChat,
    isLoaded
  );

  const {filteredFolders, filteredChats} = useSortedAndFiltered(
    folders,
    chats,
    searchQuery
  );

  const handleSelectChat = useCallback(
    async (chatId: string, folderId?: string | null) => {
      if (!chatId) return;

      selectChat(chatId);
      if (folderId && folderId !== "default") {
        selectFolder(folderId);
        router.push(`/${folderId}/${chatId}`);
      } else {
        selectFolder(null);
        router.push(`/${chatId}`);
      }

      await loadMessagesForChat(chatId);
    },
    [selectChat, selectFolder, router, loadMessagesForChat]
  );

  const handleSelectFolder = (folderId: string | null) => selectFolder(folderId);

  const handleSearch = (query: string) => setSearchQuery(query);

  const resetSelectedFoldersAndChats = () => {
    selectChat(null);
    selectFolder(null);
  };

  const onSendMessage = useCallback(
    async (message: string, files: File[] = []) => {
      if (!userId) return;

      let chatIdToSend = currentChatId;

      // Если нет текущего чата — создаём
      if (!chatIdToSend) {
        const folderKey = currentFolderId || "default";
        const newChatName = message.slice(0, 20) || "New Chat";

        // создаём чат
        chatIdToSend = await addNewChat(newChatName, folderKey, userId);
        selectChat(chatIdToSend);

        router.push(
          folderKey && folderKey !== "default"
            ? `/${folderKey}/${chatIdToSend}`
            : `/${chatIdToSend}`
        );
      }

      await sendMessageToChat(chatIdToSend, message, files);
    },
    [
      currentChatId,
      currentFolderId,
      addNewChat,
      selectChat,
      userId,
      router,
      sendMessageToChat,
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
    filteredFolders,
    filteredChats,
    handleSelectChat,
    resetSelectedFoldersAndChats,
    handleSelectFolder,
    handleSearch,
    searchQuery,
    currentChatId,
    currentFolderId,
    notFound,
    onSendMessage,
    isLoaded,
  };
};
