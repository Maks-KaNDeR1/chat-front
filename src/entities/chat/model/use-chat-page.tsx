import {useState, useCallback, useEffect} from "react";
import {useRouter} from "next/router";
import {useChatContext, useFolderContext, useDialogContext} from "@/src/app/providers";
import {useInitSelectionFromPath, useSortedAndFiltered} from "../lib";
import {ProcessedFile} from "@/src/entities/dialog";

export const useChatPage = () => {
  const {chats, selectChat, currentChatId, addNewChat} = useChatContext();
  const {folders, selectFolder, currentFolderId} = useFolderContext();
  const {sendMessageToChat} = useDialogContext();
  const router = useRouter();
  const sender = Math.random() < 0.5 ? "User" : "Bot";

  const [searchQuery, setSearchQuery] = useState("");

  // Для временного хранения сообщения, которое нужно отправить после создания нового чата
  const [pendingMessage, setPendingMessage] = useState<{
    message: string;
    files: ProcessedFile[];
  } | null>(null);

  // Инициализация выбора папки и чата из URL, возвращает {notFound}
  const {notFound} = useInitSelectionFromPath(
    folders,
    chats,
    currentChatId,
    currentFolderId,
    selectFolder,
    selectChat
  );

  const {filteredFolders, filteredChats} = useSortedAndFiltered(
    folders,
    chats,
    searchQuery
  );

  const handleSelectChat = useCallback(
    (chatId: string, folderId?: string | null) => {
      if (!chatId) return;

      if (folderId && folderId !== "default") {
        selectFolder(folderId);
        selectChat(chatId);
        router.push(`/${folderId}/${chatId}`);
      } else {
        selectFolder(null);
        selectChat(chatId);
        router.push(`/${chatId}`);
      }
    },
    [selectFolder, selectChat, router]
  );

  const handleSelectFolder = useCallback(
    (folderId: string | null) => {
      selectFolder(folderId);
      router.push(folderId ? `/${folderId}` : "/");
    },
    [selectFolder, router]
  );

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const sendMessage = useCallback(
    (message: string, files: ProcessedFile[]) => {
      if (!currentChatId) {
        const newChatName = message.slice(0, 20) || "New Chat";
        const folderKey = currentFolderId || "default";

        addNewChat(folderKey, {name: newChatName, folder: currentFolderId || null});

        // Сохраняем сообщение, чтобы отправить после создания чата
        setPendingMessage({message, files});
      } else {
        sendMessageToChat(sender, currentChatId, message, files);
      }
    },
    [currentChatId, sender, currentFolderId, addNewChat, sendMessageToChat]
  );

  // Когда currentChatId изменился и есть ожидающее сообщение — отправляем его
  useEffect(() => {
    if (currentChatId && pendingMessage) {
      sendMessageToChat(
        sender,
        currentChatId,
        pendingMessage.message,
        pendingMessage.files
      );
      setPendingMessage(null);
      // handleSelectChat(currentChatId);
    }
  }, [currentChatId, pendingMessage, sendMessageToChat]);

  return {
    filteredFolders,
    filteredChats,
    handleSelectChat,
    handleSelectFolder,
    handleSearch,
    searchQuery,
    currentChatId,
    currentFolderId,
    notFound,
    sendMessage,
  };
};
