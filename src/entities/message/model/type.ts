import {Chat} from "../../chat";
import {User} from "../../user";

export type Message = {
  chat: Chat;
  owner: User;
  role: "user" | "assistant" | "system";
  type: "text" | "file";
  text: string;
  imageUrls: string[];
  meta: Record<string, any>;
  createdAt: string;
};
