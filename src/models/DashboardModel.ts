
interface PriorityTypes
{
  HIGH: number; MEDIUM: number; LOW: number
}
export const PriorityMap: PriorityTypes = { 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3 } as const


export type AsideProject = Omit<Project, 'tasks'>;
export type AsideProjects = AsideProject[];
export type TasksEntity = Task[];

export interface Project
{
  projectID: number;
  projectName: string;
  color: string;
  taskCount: number;
}
export interface Tag
{
  name: string;
  color: string;
}
export interface Task
{
  taskID: number;
  taskKey:string;
  title: string;
  description: string | null;
  projectName: string;
  tags: Tag[];
  position: number;
  status: string;
  priority: keyof typeof PriorityMap;
  isCompleted: boolean;
  startDate: number | null;
  endDate: number | null;
  color?: string | null;
  displayDate?: string;
  totalSubtasks: number;
  completedSubtasks: number;
}

export interface ColumnSegment
{
  columnID: number;
  columnName: string;
  page: number;
  size: number;
  total: number;
  hasMore: boolean;
  tasks: Task[];
}

export interface SegmentedTasksResponse
{
  projectID: number | null;
  segments: Record<string, ColumnSegment>;
}
export interface CreateTaskForm
{
  projectID: number;
  description: string;
  priorityID: number;
  columnID: number;
  title: string;
  startDate: string | null; 
  endDate: string |null;
}
export interface SubTask
{
  subTaskID: number;
  title: string;
  isCompleted: boolean;
  taskID: number;
  position: number;
}

export interface CreateSubTask
{
  id: string;
  title: string;
}

export interface KanbanColumn
{
  columnID: number;
  columnName: string;
  tasks: Task[];
}

export type Projects = Project[];

