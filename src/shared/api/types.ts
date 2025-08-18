export type ApiSuccess<T> = {
  success: true;
  result: T;
};

export type ApiError = {
  success: false;
  error: string;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
