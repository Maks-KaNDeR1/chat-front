import React, {createContext, useContext, useEffect, useState} from "react";
import {useRouter} from "next/router";
import {FolderType} from "@/src/entities/folder";

const LOCAL_STORAGE_KEY = "folders";

interface FoldersContextType {
  folders: Record<string, FolderType>;
  currentFolderId: string | null;
  addNewFolder: (name: string) => Promise<string>;
  updateFolderName: (id: string, newName: string) => void;
  deleteFolder: (id: string) => void;
  selectFolder: (id: string | null) => void;
}

const defaultContextValue: FoldersContextType = {
  folders: {},
  currentFolderId: null,
  addNewFolder: () => Promise.resolve(""),
  updateFolderName: () => {},
  deleteFolder: () => {},
  selectFolder: () => {},
};

const Context = createContext<FoldersContextType>(defaultContextValue);

export function useFolderContext() {
  return useContext(Context);
}

export function FoldersProvider({children}: {children: React.ReactNode}) {
  const [folders, setFolders] = useState<Record<string, FolderType>>({});
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setFolders(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load folders:", e);
    }
  }, []);

  const saveToLocalStorage = (foldersToSave: Record<string, FolderType>) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(foldersToSave));
  };

  const addNewFolder = async (name: string): Promise<string> => {
    const newId = `new_folder_${Date.now()}`;
    const newFolder: FolderType = {id: newId, name, date: Date.now().toString()};

    setFolders(prev => {
      const updated = {...prev, [newId]: newFolder};
      saveToLocalStorage(updated);
      return updated;
    });

    return newId;
  };

  const updateFolderName = (id: string, newName: string) => {
    setFolders(prev => {
      if (!prev[id]) return prev;
      const updated = {
        ...prev,
        [id]: {...prev[id], name: newName, date: Date.now().toString()},
      };
      saveToLocalStorage(updated);
      return updated;
    });
  };

  const deleteFolder = (id: string) => {
    setFolders(prev => {
      const updated = {...prev};
      delete updated[id];
      saveToLocalStorage(updated);
      return updated;
    });

    if (currentFolderId === id) {
      setCurrentFolderId(null);

      router.push("/");
    }

    setCurrentFolderId(prevId => (prevId === id ? null : prevId));
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
        deleteFolder,
        selectFolder,
      }}
    >
      {children}
    </Context.Provider>
  );
}
