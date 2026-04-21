
export interface TokenResponse {
  username: string;
  message: string;
  accessToken: string;
  tokenType: string;
}
export interface LoginParams {
  username: string; password: string;
}
export interface CreateUserParams extends LoginParams {
  email: string;
}
export interface UserProfileFormParams {
  userID: number;
  loginName: string;
  email: string;
}

