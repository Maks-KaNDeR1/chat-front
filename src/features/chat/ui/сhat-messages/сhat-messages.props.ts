import {DialogType, ProcessedFile} from "@/src/entities/dialog";

export interface ChatMessagesProps {
  name: string;
  dialog: DialogType[];
  onSendMessage: (message: string, files: ProcessedFile[]) => void;
  addNewChat: (name: string) => void;
}
