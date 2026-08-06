import type { TokenResponse } from "./models/AuthModel";
import { KanbanColumn, Projects, SegmentedTasksResponse, SubTask } from "./models/DashboardModel";
import type { ErrorDetail, ProjectResponseSuccess, SubmitData } from "./models/entity";
import type { UserResponse } from "./models/UserModel";
import authHeader, { storeAccessToken } from "./utils/auth";

// export const API_BASE_URL = 'http://localhost:8000';
// export const API_BASE_URL = 'https://task-manager-web-app-fe7y.onrender.com';
export const API_BASE_URL = String(import.meta.env.VITE_API_URL) || "http://localhost:8000";


export async function loginUser(formData: SubmitData)
{

  const resp = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    credentials: 'include',
    body: new URLSearchParams({
      grant_type: 'password',
      username: formData.username,
      password: formData.password,
      client_id: '',
      client_secret: ''
    }).toString()
  })

  if (!resp.ok)
  {
    const errorData = await resp.json() as ErrorDetail;

    console.error(resp.statusText, errorData.detail);
    return {
      isError: true,
      status: resp.status,
      message: errorData.detail
    };
  }

  // TODO: store token in state
  const respData = await resp.json() as TokenResponse

  const { accessToken } = respData;
  await storeAccessToken(accessToken);
  localStorage.setItem('username', respData.username);

  return { message: respData.message, login_username: respData.username };

}
export async function createAccount(formData: SubmitData)
{
  const registerUrl = `${API_BASE_URL}/auth/register`;

  const headers = {
    "Content-Type": "application/json"
  }

  const resp = await fetch(registerUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(formData)
  });
  if (!resp.ok || resp.status === 204)
  {
    const errorData = await resp.json() as ErrorDetail;
    console.error(resp.statusText, errorData.detail);
    return {
      isError: true,
      status: resp.status,
      message: errorData.detail
    };
  }
  const data = await resp.json() as { message: string, userID: number };
  return { message: data.message };
}


export async function logout()
{
  const authorizationHeader = authHeader();
  const logoutUrl = `${API_BASE_URL}/auth/logout`;
  const headers = { ...authorizationHeader };
  const resp = await fetch(logoutUrl, {
    method: "POST",
    headers,
    credentials: 'include'
  })

  if (!resp.ok)
  {
    const errorData = await resp.json() as ErrorDetail;
    console.error(resp.statusText, errorData.detail);
    return {
      isError: true,
      status: resp.status,
      message: errorData.detail
    };
  }

  const data = await resp.json() as { message: string };

  return data;
}


export async function addProject(username: string, project: SubmitData)
{
  const authorizationHeader = authHeader();
  const projectURL = `${API_BASE_URL}/projects/${username}/`;
  const headers = {
    ...authorizationHeader,
    'Content-Type': 'application/json'
  }
  const resp = await fetch(projectURL, {
    method: "POST",
    headers,
    credentials: 'include',
    body: JSON.stringify(project)
  });

  if (!resp.ok)
  {
    const errorData = await resp.json() as ErrorDetail;
    console.error(resp.statusText, errorData.detail);
    return {
      isError: true,
      status: resp.status,
      message: errorData.detail
    };
  }

  const data = await resp.json() as ProjectResponseSuccess;

  return data;
}


export async function getProjects(username: string)
{
  const authorizationHeader = authHeader();
  const headers = { ...authorizationHeader };
  const resp = await fetch(`${API_BASE_URL}/projects/${username}/`, {
    method: "GET",
    headers,
    credentials: 'include'
  })

  if (!resp.ok)
  {
    const errorData = await resp.json() as ErrorDetail;
    console.error(resp.statusText, errorData.detail);
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw {
      statusText: resp.statusText,
      status: resp.status,
      message: errorData.detail
    };
  }

  const data = await resp.json() as Projects;
  return data;
}

export async function createTask(username: string, formData: SubmitData)
{
  const authorizationHeader = authHeader();
  const headers = {
    ...authorizationHeader,
    'Content-Type': 'application/json'
  };

  const resp = await fetch(`${API_BASE_URL}/projects/${username}/tasks/`,
    {
      method: "POST",
      headers,
      credentials: 'include',
      body: JSON.stringify(formData)
    }
  )

  if (!resp.ok)
  {
    const errorData = await resp.json() as ErrorDetail;
    console.error(resp.statusText, errorData.detail);
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw {
      statusText: resp.statusText,
      status: resp.status,
      message: errorData.detail
    };
  }
  const data = await resp.json() as { message: string, status: string };
  return data
}

export async function getTasksList(username: string, queryParams: string, page = '1')
{
  const authorizationHeader = authHeader();
  const headers = { ...authorizationHeader };

  const resp = await fetch(`${API_BASE_URL}/projects/${username}/tasks/list?page=${page}${queryParams}&size=10`, {
    method: "GET",
    headers,
    credentials: 'include'
  })

  if (!resp.ok)
  {
    const errorData = await resp.json() as ErrorDetail;
    console.error(resp.statusText, errorData.detail);
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw {
      statusText: resp.statusText,
      status: resp.status,
      message: errorData.detail
    };
  }

  const data = await resp.json() as SegmentedTasksResponse;
  return data;
}

export async function getTasksBoard(username: string, filter?: string)
{
  const authorizationHeader = authHeader();
  const headers = { ...authorizationHeader };
  const resp = await fetch(`${API_BASE_URL}/projects/${username}/tasks/board?${filter ?? ""}`, {
    method: "GET",
    headers,
    credentials: 'include'
  })

  if (!resp.ok)
  {
    const errorData = await resp.json() as ErrorDetail;
    console.error(resp.statusText, errorData.detail);
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw {
      statusText: resp.statusText,
      status: resp.status,
      message: errorData.detail
    };
  }

  const data = await resp.json() as KanbanColumn[];

  return data;
}

export async function getSubTasks(username: string, taskID: string)
{
  const authorizationHeader = authHeader();
  const projectURL = `${API_BASE_URL}/projects/${username}/tasks/${taskID}/sub-tasks`;
  const headers = {
    ...authorizationHeader,
    'Content-Type': 'application/json',
  }
  const resp = await fetch(projectURL, {
    method: "GET",
    headers,
    credentials: 'include',
  })
  if (!resp.ok)
  {
    const errorData = await resp.json() as ErrorDetail;
    console.error(resp.statusText, errorData.detail);
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw {
      statusText: resp.statusText,
      status: resp.status,
      message: errorData.detail
    };
  }
  const data = await resp.json() as SubTask[];

  return data;
}

export async function updateProject(username: string, formData: SubmitData)
{
  const authorizationHeader = authHeader();
  const projectURL = `${API_BASE_URL}/projects/${username}/${formData.projectID}`;
  const headers = {
    ...authorizationHeader,
    'Content-Type': 'application/json',
  }
  const resp = await fetch(projectURL, {
    method: "PUT",
    headers,
    credentials: 'include',
    body: JSON.stringify(formData)
  });

  if (!resp.ok)
  {
    const errorData = await resp.json() as ErrorDetail;
    console.error(resp.statusText, errorData.detail);
    return {
      isError: true,
      status: resp.status,
      message: errorData.detail
    };
  }

  const data = await resp.json() as ProjectResponseSuccess;
  const { message, projectID } = data;

  return { projectID, message };
}




export async function duplicateProject(username: string, projectID: string)
{
  const authorizationHeader = authHeader();
  const duplicateURL = `${API_BASE_URL}/projects/${username}/${projectID}/duplicate`;
  const headers = { ...authorizationHeader };
  const resp = await fetch(duplicateURL, {
    method: 'POST',
    headers,
    credentials: 'include'
  });
  if (!resp.ok)
  {
    const errorData = await resp.json() as ErrorDetail;
    console.error(resp.statusText, errorData.detail);
    return {
      isError: true,
      status: resp.status,
      message: errorData.detail
    };
  }

  const data = await resp.json() as ProjectResponseSuccess;

  return data;
}


export async function deleteProject(username: string, projectID: string)
{
  const authorizationHeader = authHeader();
  const deleteURL = `${API_BASE_URL}/projects/${username}/${projectID}`;
  const headers = { ...authorizationHeader };
  const resp = await fetch(deleteURL, {
    method: 'DELETE',
    headers,
    credentials: 'include'
  });
  if (!resp.ok)
  {
    const errorData = await resp.json() as ErrorDetail;
    console.error(resp.statusText, errorData.detail);
    return {
      isError: true,
      status: resp.status,
      message: errorData.detail
    };
  }

  const data = await resp.json() as { message: string };

  return data;
}

export async function UserProfile(username: string)
{
  const authorizationHeader = authHeader();
  const url = `${API_BASE_URL}/users/${username}/profile`;
  const headers = { ...authorizationHeader };

  const resp = await fetch(url, {
    method: 'GET',
    headers,
    credentials: 'include'
  })

  if (!resp.ok)
  {
    const errorData = await resp.json() as ErrorDetail;
    console.error(resp.statusText, errorData.detail);
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw {
      statusText: resp.statusText,
      status: resp.status,
      message: errorData.detail
    };
  }
  const respData = await resp.json() as UserResponse;
  return respData;
}


export async function editUserProfile(username: string, formData: SubmitData)
{
  const authorizationHeader = authHeader();
  const url = `${API_BASE_URL}/users/${username}/edit-profile`;

  const headers = { ...authorizationHeader, 'Content-Type': 'application/json' };

  const resp = await fetch(url, {
    method: "PUT",
    headers,
    credentials: 'include',
    body: JSON.stringify(formData)

  });

  if (!resp.ok)
  {
    const errorData = await resp.json() as ErrorDetail;
    console.error(resp.statusText, errorData.detail);
    return {
      isError: true,
      status: resp.status,
      message: errorData.detail
    };
  }

  const respData = await resp.json() as TokenResponse
  const { accessToken } = respData;
  await storeAccessToken(accessToken);

  return { message: respData.message, loginUsername: respData.username };
}

export async function uploadProfileImage(username: string, formData: FormData)
{
  const authorizationHeader = authHeader();
  const uploadProfileImgUrl = `${API_BASE_URL}/users/${username}/upload-profile`;

  const headers = { ...authorizationHeader };

  const resp = await fetch(uploadProfileImgUrl, {
    headers,
    method: "POST",
    credentials: 'include',
    body: formData
  });

  if (!resp.ok)
  {
    const errorData = await resp.json() as ErrorDetail;
    console.error(resp.statusText, errorData.detail);
    return {
      isError: true,
      status: resp.status,
      message: errorData.detail
    };
  }
  const respData = await resp.json() as { message: string }
  return respData;
}

export async function changePassword(username: string, formData: SubmitData)
{
  const authorizationHeader = authHeader();
  const url = `${API_BASE_URL}/users/${username}/change-password`;
  const headers = { ...authorizationHeader, 'Content-Type': 'application/json' };

  const resp = await fetch(url, {
    headers,
    method: "POST",
    credentials: 'include',
    body: JSON.stringify(formData)
  });
  if (!resp.ok)
  {
    const errorData = await resp.json() as ErrorDetail;
    console.error(resp.statusText, errorData.detail);
    return {
      isError: true,
      status: resp.status,
      message: errorData.detail
    };
  }
  const respData = await resp.json() as { message: string }
  return respData;
}


