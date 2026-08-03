import type { TasksEntity } from "./DashboardModel";


export interface UserValidationFields
{
  email: boolean | null;
  password: boolean | null;
}
export interface ChangePasswordParams
{
  currentPw: string;
  newPw: string;
  confirmPw: string;
  intent: 'changePw'
}
export interface LoginParams
{
  username: string; password: string;
}

export interface CreateUserParams extends LoginParams
{
  email: string;
}

export interface UserResponse
{
  userID: number;
  username: string;
  email: string;
  profileImgUrl: string;
  bio: string | null;
  role: string | null;
  department: string | null;
  phoneNumber: string | null;
  joinedIn: string;
  avatarColor: string;
  avatarVersion: number;
}

export interface TasksResponse
{
  page: number;
  size: number;
  tasks: TasksEntity;
  total: number;
  hasMore: boolean;
}

export type EditUserParams = Omit<UserResponse, 'profileImgUrl'> & {
  intent: 'edit';
  password: string;
};