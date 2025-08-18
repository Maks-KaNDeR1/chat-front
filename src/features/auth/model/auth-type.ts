export type AuthPayload = {
  username: string;
  password: string;
};

export type AuthResponse =
  | {success: true; result: string}
  | {success: false; error: string};
