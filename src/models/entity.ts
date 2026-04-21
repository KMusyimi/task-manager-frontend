import type { Key } from "react";
import type { CreateUserParams } from "./AuthModel";


export type theme = 'dark' | 'light';

export interface RecommendationEntity {
  id: number | Key;
  title: string;
  create_date?: Date;
}
export interface TokenResponse {
  username: string;
  message: string;
  accessToken: string;
  tokenType: string;
}
export interface ErrorDetail {
  detail: string;
}
export interface ActionFuncError {
  error?: string, status?: number, timestamp?: number
}

export type FormParams = Record<string, string>;

export interface UserValidationFields {
  email: boolean | null;
  password: boolean | null;
}
export interface ChangePasswordParams {
  currentPw: string
  newPw: string
  confirmPw: string
}

export interface ProjectFormParams {
  intent: 'add' | 'edit' | 'duplicate' | 'delete';
  inputName: 'projectID';
  payloadID: string;
  projectName: string;
  color: string;
}
export type EditUserParams = Omit<CreateUserParams, 'username'> & {
  userID: number
  intent: 'edit-profile'
  loginName: string;
}
export interface ProjectResponseSuccess {
  projectID: number
  message: string,
}

export type DeleteModalParams = Record<string, string>
export interface ContextMenuPosition {
  top: string | number;
  left: string | number;
}

export interface ErrorResponse{
  
}
