export type AuthPayload = {
  username: string;
  password: string;
};

export type AuthResponse =
  | {status: true; result: string}
  | {status: false; error: string};
