import {NextPage} from "next";
import {ChatComponent} from "@/src/features/chat";
import {useChatPage} from "@/src/entities/chat";

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
    sendMessage,
  } = useChatPage();

  if (notFound) {
    return (
      <div style={{padding: 20, color: "red", textAlign: "center", fontWeight: "bold"}}>
        Chat or folder not found
      </div>
    );
  }

  return (
    <ChatComponent
      currentChatId={currentChatId}
      currentFolderId={currentFolderId}
      filteredFolders={filteredFolders}
      filteredChats={filteredChats}
      handleSelectChat={handleSelectChat}
      handleSelectFolder={handleSelectFolder}
      handleSearch={handleSearch}
      sendMessage={sendMessage}
    />
  );
};

export default HomePage;
