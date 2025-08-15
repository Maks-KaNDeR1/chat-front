import {useEffect, useRef, useState} from "react";
import {useRouter} from "next/router";
import {parsePath} from "@/src/shared/lib";
import {Folder} from "../../folder";
import {Chat} from "../model";

export const useInitSelectionFromPath = (
  folders: Record<string, Folder>,
  chats: Record<string, Record<string, Chat>>,
  currentChatId: string | null,
  currentFolderId: string | null,
  selectFolder: (id: string | null) => void,
  selectChat: (id: string | null) => void,
  isLoaded: boolean
) => {
  const [notFound, setNotFound] = useState(false);
  const initializedRef = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if ((!router.isReady || initializedRef.current) && !isLoaded) return;

    const finish = (found = true) => {
      if (!found) setNotFound(true);
      initializedRef.current = true;
    };

    const slugParts = Array.isArray(router.query.slug) ? router.query.slug : [];
    if (slugParts.length === 0) return finish();

    const {folderId, chatId} = parsePath(slugParts, folders, chats);
    const folderExists = folderId && folders[folderId];
    const chatExists =
      chatId && Object.values(chats).some(group => group[chatId as string]);

    console.log(folderId, chatId);

    if (slugParts.length === 1) {
      if (folderExists && !chatId) {
        selectFolder(folderId);
        return finish();
      }
      if (chatExists && !folderId) {
        selectChat(chatId);
        return finish();
      }
      return finish(false);
    }

    if (slugParts.length >= 2) {
      if (folderExists && chatExists) {
        selectFolder(folderId);
        selectChat(chatId);
        return finish();
      }
      return finish(false);
    }
  }, [
    router.isReady,
    router.query.slug,
    folders,
    chats,
    // selectFolder,
    // selectChat,
    isLoaded,
  ]);

  return {notFound: false};
};
