export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface ApiErrorResponse {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}
