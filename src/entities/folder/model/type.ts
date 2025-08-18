import {User} from "../../user";

export type Folder = {
  _id: string;
  owner: User;
  name: string;
  createdAt: string;
};
