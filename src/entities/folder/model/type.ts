import {User} from "../../user";

export type Folder = {
  id: string;
  owner: User;
  name: string;
  createdAt: string;
};
