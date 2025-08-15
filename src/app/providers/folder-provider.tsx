import React, {createContext, useContext, useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Folder} from "@/src/entities/folder";
import {
  getFolders,
  createFolder,
  updateFolder,
  deleteFolder,
} from "@/src/entities/folder/api";
import {useAuthStatus} from "@/src/features/auth";

interface FoldersContextType {
  folders: Record<string, Folder>;
  currentFolderId: string | null;
  addNewFolder: (name: string, ownerId: string) => Promise<string>;
  updateFolderName: (id: string, newName: string) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;
  selectFolder: (id: string | null) => void;
  loading: boolean;
}

const defaultContextValue: FoldersContextType = {
  folders: {},
  currentFolderId: null,
  addNewFolder: () => Promise.resolve(""),
  updateFolderName: async () => {},
  deleteFolder: async () => {},
  selectFolder: () => {},
  loading: true,
};

const Context = createContext<FoldersContextType>(defaultContextValue);

export function useFolderContext() {
  return useContext(Context);
}

export function FoldersProvider({children}: {children: React.ReactNode}) {
  const [folders, setFolders] = useState<Record<string, Folder>>({});
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const router = useRouter();
  const {isAuthorized} = useAuthStatus();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFolders = async () => {
      setLoading(true);

      try {
        const res = await getFolders();

        if (res.status) {
          const foldersMap: Record<string, Folder> = {};
          res.result.forEach(f => {
            foldersMap[f.id] = f;
          });
          setFolders(foldersMap);
        }
      } catch (e) {
        console.error("Failed to load folders:", e);
      } finally {
        setLoading(false);
      }
    };

    // if (isAuthorized) {
    fetchFolders();
    // }
  }, [isAuthorized]);

  const addNewFolder = async (name: string, ownerId: string): Promise<string> => {
    const res = await createFolder(ownerId, name);
    if (res.status) {
      setFolders(prev => ({...prev, [res.result.id]: res.result}));
      return res.result.id;
    }
    throw new Error("Failed to create folder");
  };

  const updateFolderName = async (id: string, newName: string) => {
    const folder = folders[id];
    if (!folder) return;

    const updatedFolder = {...folder, name: newName};
    const res = await updateFolder(id, updatedFolder);

    if (res.status) {
      setFolders(prev => ({...prev, [id]: res.result}));
    }
  };

  const deleteFolderHandler = async (id: string) => {
    try {
      const res = await deleteFolder(id);
      if (res?.result) {
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
      }}
    >
      {children}
    </Context.Provider>
  );
}
