import {Folder} from "../../folder";
import {User} from "../../user";

export type Chat = {
  _id: string;
  owner: User;
  folder: Folder | null;
  name: string;
  createdAt: string;
};
