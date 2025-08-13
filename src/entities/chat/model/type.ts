export interface ChatsCollection {
  [key: string]: ChatType;
}

export interface ChatType {
  id: string;
  name: string;
  folder: string | null;
  date: string;
}

export interface ChatRequestType {
  name: string;
  folder: string | null;
}
