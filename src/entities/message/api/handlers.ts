import {apiClient, ApiResponse} from "@/src/shared/api";
import {Message} from "../model";

export const getChatMessages = (chatId: string): Promise<ApiResponse<Message[]>> => {
  return apiClient(`/api/chats/${chatId}/messages`, "get");
};

export const sendMessage = (
  chatId: string,
  formData: FormData
): Promise<ApiResponse<{message: Message; answer: Message}>> => {
  return apiClient(`/api/chats/${chatId}/messages/send`, "post", formData);
};
