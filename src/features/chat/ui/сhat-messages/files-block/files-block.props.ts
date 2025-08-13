import {ProcessedFile} from "@/src/entities/dialog";

export interface FilesBlockProps {
  filesArr: ProcessedFile[];
  filesFromUser: boolean;
  onFileClick: (fileUrl: string) => void;
}
