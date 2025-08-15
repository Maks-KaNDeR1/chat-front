import {Message} from "@/src/entities/message";

export interface ChatMessagesProps {
  name: string;
  message: Message[];
  addNewChat: (name: string) => void;
}
