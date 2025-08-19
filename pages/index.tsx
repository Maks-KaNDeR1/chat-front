import {NextPage} from "next";
import {ChatComponent} from "@/src/features/chat";

const HomePage: NextPage = () => {
  // const isLoading = useLoadingStore(state => state.isLoading);

  // if (notFound && !isLoading) {
  //   return (
  //     <div style={{padding: 20, color: "red", textAlign: "center", fontWeight: "bold"}}>
  //       Чат или папка не найдены
  //     </div>
  //   );
  // }

  return (
    <div style={{position: "relative"}}>
      <ChatComponent />
    </div>
  );
};

export default HomePage;
