export type ApiSuccess<T> = {
  status: true;
  result: T;
};

export type ApiError = {
  status: false;
  error: string;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
