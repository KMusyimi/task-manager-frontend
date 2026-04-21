import type { Project } from "./ProjectsModel";


export interface UserValidationFields {
  email: boolean | null;
  password: boolean | null;
}
export interface ChangePasswordParams {
  currentPw: string;
  newPw: string;
  confirmPw: string;
  intent: 'changePw'
}
export interface LoginParams {
  username: string; password: string;
}

export interface CreateUserParams extends LoginParams {
  email: string;
}

export interface UserResponse {
  userID: number;
  username: string;
  email: string;
  profileImgUrl: string;
}

export interface ProjectsResponse {
  projects: Project[];
}



export type EditUserParams = Omit<UserResponse, 'profileImgUrl'> & {
  intent: 'edit-profile';
  password: string;
};