export interface FilesBlockProps {
  // filesArr: string[];
  filesArr: string[];
  // filesArr: ProcessedFile[];
  filesFromUser: boolean;
  onFileClick: (fileUrl: string) => void;
}
