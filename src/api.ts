import type { ErrorDetail, FormParams, Project, Projects, TasksEntity, TokenResponse } from "./entities/entity";
import authHeader, { storeAccessToken } from "./utils/auth";

export const API_URL = 'http://localhost:8000';


export async function loginUser(creds: FormParams) {

  const resp = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    credentials: 'include',
    body: new URLSearchParams({
      grant_type: 'password',
      username: creds.username,
      password: creds.password,
      client_id: '',
      client_secret: ''
    }).toString()
  })

  if (!resp.ok) {
    const errorData = await resp.json() as ErrorDetail;
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw { status: resp.status, statusText: resp.statusText, message: errorData.detail };
  }
  const data = await resp.json() as TokenResponse;

  // TODO: store token in state
  storeAccessToken(data);
  return data;
}
export async function createAccount(creds: FormParams) {
  const registerUrl = `${API_URL}/register`;

  const headers = {
    "Content-Type": "application/json"
  }

  const resp = await fetch(registerUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(creds)
  });
  if (!resp.ok || resp.status === 204) {
    const errorData = await resp.json() as ErrorDetail;
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw { status: resp.status, statusText: resp.statusText, message: errorData.detail };
  }
  const data = await resp.json() as { message: string, userID: number };
  // TODO: remember pass for testuser1 "hashpass1!"
  return data;
}


export async function logout() {
  const logoutUrl = `${API_URL}/logout`;
  const headers = { ...authHeader() };
  const resp = await fetch(logoutUrl, {
    method: "POST",
    headers,
    credentials: 'include'
  })

  if (!resp.ok) {
    const errorData = await resp.json() as ErrorDetail;
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw { status: resp.status, statusText: resp.statusText, message: errorData.detail };
  }
  const data = await resp.json() as { message: string };

  return data;
}


export async function addProject(username: string, project: FormParams) {
  const projectURL = `${API_URL}/projects/${username}`;
  const headers = {
    ...authHeader(),
    'Content-Type': 'application/json'
  }
  const resp = await fetch(projectURL, {
    method: "POST",
    headers,
    credentials: 'include',
    body: JSON.stringify(project)
  });

  if (!resp.ok) {
    const errorData = await resp.json() as ErrorDetail;
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw { status: resp.status, statusText: resp.statusText, message: errorData.detail };
  }
  const data = await resp.json() as Project;

  return data;
}


export async function getProjects(username: string): Promise<Projects> {
  const headers = { ...authHeader() };
  const resp = await fetch(`${API_URL}/projects/${username}`, {
    method: "GET",
    headers,
    credentials: 'include'
  })

  if (!resp.ok) {
    const errorData = await resp.json() as ErrorDetail;
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw { status: resp.status, statusText: resp.statusText, message: errorData.detail };
  }
  const data = await resp.json() as Projects;

  return data
}


export async function updateProject(username: string, creds: FormParams) {
  const projectURL = `${API_URL}/projects/${username}/${creds.projectID}`;
  const headers = {
    ...authHeader(),
    'Content-Type': 'application/json',
  }
  const resp = await fetch(projectURL, {
    method: "PUT",
    headers,
    credentials: 'include',
    body: JSON.stringify(creds)
  });

  if (!resp.ok) {
    const errorData = await resp.json() as ErrorDetail;
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw { status: resp.status, statusText: resp.statusText, message: errorData.detail };
  }
  const data = await resp.json() as { message: string, projectID: number };

  return data;
}


export async function getTasks(username: string, projectID: string | undefined): Promise<TasksEntity> {
  const endpoint = projectID ? `${projectID}/tasks` : `tasks`;
  const headers = { ...authHeader() };
  const resp = await fetch(`${API_URL}/projects/${username}/${endpoint}`, {
    method: "GET",
    headers,
    credentials: 'include'
  })

  if (!resp.ok) {
    const errorData = await resp.json() as ErrorDetail;
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw { status: resp.status, statusText: resp.statusText, message: errorData.detail };
  }
  const data = await resp.json() as TasksEntity;

  return data;
}


export async function duplicateProject(username: string, projectID: string) {
  const duplicateURL = `${API_URL}/projects/${username}/${projectID}/duplicate`;
  const headers = { ...authHeader() };
  const resp = await fetch(duplicateURL, {
    method: 'POST',
    headers,
    credentials: 'include'
  });
  if (!resp.ok) {
    const errorData = await resp.json() as ErrorDetail;
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw { status: resp.status, statusText: resp.statusText, message: errorData.detail };
  }
  const data = await resp.json() as { message: string, projectID: number };

  return data;
}


export async function deleteProject(username: string, projectID: string) {
  const deleteURL = `${API_URL}/projects/${username}/${projectID}`;
  const headers = { ...authHeader() };
  const resp = await fetch(deleteURL, {
    method: 'DELETE',
    headers,
    credentials: 'include'
  });
  if (!resp.ok) {
    const errorData = await resp.json() as ErrorDetail;
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw { status: resp.status, statusText: resp.statusText, message: errorData.detail };
  }
  const data = await resp.json() as { message: string };

  return data;
}