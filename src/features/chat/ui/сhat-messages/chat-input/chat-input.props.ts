import {ProcessedFile} from "@/src/entities/dialog";

export interface ChatInputProps {
  onSend: (message: string, files: ProcessedFile[]) => void;
}
