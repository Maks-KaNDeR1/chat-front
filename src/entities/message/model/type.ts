import {Chat} from "../../chat";

export type Message = {
  owner: Chat;
  role: "user" | "assistant" | "system";
  type: "text" | "file";
  text: string;
  imageUrls: string[];
  meta: Record<string, any>;
  createdAt: string;
  name: string;
  _id: string;
};
