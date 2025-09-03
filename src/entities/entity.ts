import type { Key } from "react";

export interface RecommendationEntity {
  id: number | Key;
  title: string;
  create_date?: Date;
}
export interface TokenResponse {
  user: string;
  message: string;
  accessToken: string;
  tokenType: string;
}
export interface ErrorDetail {
  detail: string;
}

export type FormParams = Record<string, string>;

export interface UserValidationFields {
  email: boolean | null;
  password: boolean | null;
}

export interface ProjectFormParams {
  intent: 'add' | 'edit';
  projectID?: string | number;
  project_name: string;
  color: string;
}

export interface Project {
  projectID: number;
  projectName: string;
  color: string;
  taskCount: number;
}

export interface Task {
  taskID: number
  projectName: string
  title: string
  status: string
  priority: string
  startDate: Date
  endDate: Date
}
export type DeleteModalParams = Record<string, string>

export type TasksEntity = [Task]
export type Projects = [Project]