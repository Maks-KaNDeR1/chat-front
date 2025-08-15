import {useState, useCallback, useEffect} from "react";
import {useRouter} from "next/router";
import {useChatContext, useFolderContext, useMessageContext} from "@/src/app/providers";
import {useInitSelectionFromPath, useSortedAndFiltered} from "../lib";
import {useAuthStatus, useAuthStore} from "@/src/features/auth";

export const useChatPage = () => {
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
  const userId = useAuthStore.getState().user?.id;
  const isAuthorized = useAuthStatus(state => state.isAuthorized);

  const [searchQuery, setSearchQuery] = useState("");

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
    selectFolder(null);
    selectFolder(null);
  };

  const sendMessage = useCallback(
    async (message: string, files: File[] = []) => {
      if (!currentChatId) {
        const folderKey = currentFolderId || "default";
        // const folderKey = currentFolderId || null;;
        const newChatName = message.slice(0, 20) || "New Chat";

        if (userId) {
          // ПОКА ТОЛЬКО ЗАРЕГАНЫМ
          const newChatId = await addNewChat(newChatName, folderKey, userId);

          setPendingMessage({message, files});
          selectChat(newChatId);
          router.push(
            folderKey && folderKey !== "default"
              ? `/${folderKey}/${newChatId}`
              : `/${newChatId}`
          );
        }
      } else if (pendingMessage) {
        await sendMessageToChat(
          currentChatId,
          pendingMessage.message,
          pendingMessage.files
        );
        setPendingMessage(null);
      } else {
        await sendMessageToChat(currentChatId, message);
      }
    },
    [
      currentChatId,
      currentFolderId,
      addNewChat,
      pendingMessage,
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
    sendMessage,
    isLoaded,
  };
};
