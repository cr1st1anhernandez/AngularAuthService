export interface RegisterResponse {
  numOfErrors: number;
  message: string;
}

export interface LoginResponse {
  jwt?: string;
  error?: string;
}
