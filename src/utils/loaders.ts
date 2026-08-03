import { type LoaderFunctionArgs } from "react-router-dom";
import { getProjects, getSubTasks, getTasksBoard, getTasksList, UserProfile } from "../api";
import { requireAuthToken } from "./auth";



const taskObj = {
  list: ({ username, projectQuery, page }: { username: string, projectQuery: string, page: string }) => getTasksList(username, projectQuery, page),

  board: ({ username, projectQuery }: { username: string, projectQuery: string }) => getTasksBoard(username, projectQuery)
}

export async function authenticateLoader(request: Request)
{
  await requireAuthToken(request);
}

export async function subTasksLoader({ params, request }: LoaderFunctionArgs)
{
  await authenticateLoader(request);

  const { username, taskID } = params;
  const name = username ?? '';
  const task = taskID?.toString() ?? "";

  return { subTasks: await getSubTasks(name, task) }
}

export async function dashboardLoader({ params, request }: LoaderFunctionArgs)
{
  await authenticateLoader(request);
  const { username } = params;
  const name = username ?? '';
  const user = await UserProfile(name);


  return { user, projectsPromise: getProjects(name), currentTimestamp: String(Date.now()) }
}

export async function tasksLoader({ params, request }: LoaderFunctionArgs)
{
  await authenticateLoader(request);
  const { username } = params;
  const name = username ?? '';

  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const rawProjectID = searchParams.get("project_id");
  console.log('loader project id -> ', rawProjectID);

  const isValidProjectId =
    rawProjectID !== null &&
    rawProjectID !== 'null' &&
    rawProjectID !== 'undefined' &&
    rawProjectID.trim() !== '';

  const projectID = isValidProjectId ? rawProjectID : null;

  const viewKey = (searchParams.get("view") ?? 'list') as keyof typeof taskObj;

  const pageParam = searchParams.get("page") ?? '1';

  const projectQuery = projectID ? `&project_id=${projectID}` : "";

  const page = rawProjectID ? '1' : pageParam;

  const args = { username: name, projectQuery, page }
  const fetchTaskFn = taskObj[viewKey];

  try
  {
    const tasksData = await fetchTaskFn({ ...args });
    return { tasks: tasksData, projectID };
  } catch (error)
  {
    console.error(`[tasksLoader] Error loading tasks for project ${String(projectID)}:`, error);
    // Return safe fallback shape to keep TasksContainer from receiving `null`
    return {
      tasks: { segments: {} },
      projectID,
      error: "Failed to load tasks"
    };
  }
}

