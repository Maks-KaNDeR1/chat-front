export type MessageFilesType = "string" | "file" | "img" | "video";

export interface ProcessedFile {
  name: string;
  type: string;
  base64: string;
}

export interface DialogType {
  sender: string;
  message: string | string[];
  files: ProcessedFile[];
}
