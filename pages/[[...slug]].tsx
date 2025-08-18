import {NextPage} from "next";
import {ChatComponent} from "@/src/features/chat";
import {useChatPage} from "@/src/entities/chat";
import {useLoadingStore} from "@/src/shared/store";

const HomePage: NextPage = () => {
  const {
    currentChatId,
    currentFolderId,
    filteredFolders,
    filteredChats,
    handleSelectChat,
    handleSelectFolder,
    handleSearch,
    searchQuery,
    notFound,
  } = useChatPage();

  const isLoading = useLoadingStore(state => state.isLoading);

  if (notFound && !isLoading) {
    return (
      <div style={{padding: 20, color: "red", textAlign: "center", fontWeight: "bold"}}>
        Чат или папка не найдены
      </div>
    );
  }

  return (
    <div style={{position: "relative"}}>
      <ChatComponent
        currentChatId={currentChatId}
        currentFolderId={currentFolderId}
        filteredFolders={filteredFolders}
        filteredChats={filteredChats}
        handleSelectChat={handleSelectChat}
        handleSelectFolder={handleSelectFolder}
        handleSearch={handleSearch}
      />
    </div>
  );
};

export default HomePage;
