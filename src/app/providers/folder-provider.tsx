import React, {createContext, useContext, useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Folder} from "@/src/entities/folder";
import {
  getFolders,
  createFolder,
  updateFolder,
  deleteFolder,
} from "@/src/entities/folder/api";
import {useAuthStore} from "@/src/features/auth";
import {enqueueSnackbar} from "notistack";

interface FoldersContextType {
  folders: Record<string, Folder>;
  setFolders: React.Dispatch<React.SetStateAction<Record<string, Folder>>>;
  currentFolderId: string | null;
  addNewFolder: (name: string, ownerId: string) => Promise<string>;
  updateFolderName: (id: string, newName: string) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;
  selectFolder: (id: string | null) => void;
  loading: boolean;
  loadingFolderIds: Record<string, boolean>;
}

const defaultContextValue: FoldersContextType = {
  folders: {},
  setFolders: () => {},
  currentFolderId: null,
  addNewFolder: () => Promise.resolve(""),
  updateFolderName: async () => {},
  deleteFolder: async () => {},
  selectFolder: () => {},
  loading: true,
  loadingFolderIds: {},
};

const Context = createContext<FoldersContextType>(defaultContextValue);

export function useFolderContext() {
  return useContext(Context);
}

export function FoldersProvider({children}: {children: React.ReactNode}) {
  const [folders, setFolders] = useState<Record<string, Folder>>({});
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const router = useRouter();
  const isAuthorized = useAuthStore(state => state.isAuthorized);
  const [loading, setLoading] = useState(true);
  const [loadingFolderIds, setLoadingFolderIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchFolders = async () => {
      setLoading(true);

      try {
        const res = await getFolders();

        if (res.success) {
          const foldersMap: Record<string, Folder> = {};
          res.result.forEach(f => {
            foldersMap[f._id] = f;
          });
          setFolders(foldersMap);
        }
      } catch (e) {
        console.error("Failed to load folders:", e);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthorized) {
      fetchFolders();
    }
  }, [isAuthorized]);

  const addNewFolder = async (name: string, ownerId: string): Promise<string> => {
    const res = await createFolder(ownerId, name);
    if (res.success) {
      setFolders(prev => ({...prev, [res.result._id]: res.result}));
      return res.result._id;
    }
    throw new Error("Failed to create folder");
  };

  const updateFolderName = async (id: string, newName: string) => {
    const folder = folders[id];
    if (!folder) return;

    setLoadingFolderIds(prev => ({...prev, [id]: true}));

    try {
      const res = await updateFolder(id, newName);

      if (res.success) {
        setFolders(prev => ({...prev, [id]: res.result}));
        enqueueSnackbar("Успешно переименовано", {variant: "success"});
      }
    } catch (e) {
      console.error("Failed to rename folder:", e);
      enqueueSnackbar("Ошибка при переименовании", {variant: "error"});
    } finally {
      setLoadingFolderIds(prev => {
        const copy = {...prev};
        delete copy[id];
        return copy;
      });
    }
  };

  const deleteFolderHandler = async (id: string) => {
    setLoadingFolderIds(prev => ({...prev, [id]: true}));

    try {
      const res = await deleteFolder(id);
      if (res?.success) {
        setFolders(prev => {
          const updated = {...prev};
          delete updated[id];
          return updated;
        });

        if (currentFolderId === id) {
          setCurrentFolderId(null);
          router.push("/");
        }
      }
    } catch (e) {
      console.error("Failed to delete folder:", e);
      enqueueSnackbar("Ошибка при удалении", {variant: "error"});
    } finally {
      setLoadingFolderIds(prev => {
        const copy = {...prev};
        delete copy[id];
        return copy;
      });
    }
  };

  const selectFolder = (id: string | null) => {
    setCurrentFolderId(id);
  };

  return (
    <Context.Provider
      value={{
        folders,
        currentFolderId,
        addNewFolder,
        updateFolderName,
        deleteFolder: deleteFolderHandler,
        selectFolder,
        loading,
        loadingFolderIds,
        setFolders,
      }}
    >
      {children}
    </Context.Provider>
  );
}
