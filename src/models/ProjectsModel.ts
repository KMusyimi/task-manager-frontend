
interface PriorityTypes {
  HIGH: number; MEDIUM: number; LOW: number
}
export const PriorityMap: PriorityTypes = { 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3 } as const


export type AsideProject = Omit<Project, 'tasks'>;
export type AsideProjects = AsideProject[];
export type TasksEntity = Task[];

export interface Project {
  projectID: number;
  projectName: string;
  color: string;
  taskCount: number;
  tasks: TasksEntity;
}
export interface Task {
  taskID: number;
  title: string;
  color: string;
  description: string;
  projectName: string;
  status: string;
  priority: keyof typeof PriorityMap;
  startDate: number;
  endDate?: number;
  displayDate?: string
}
export type Projects = Project[];

