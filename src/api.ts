import type { TokenResponse } from "./models/AuthModel";
import type { ErrorDetail, SubmitData, ProjectResponseSuccess  } from "./models/entity";
import type { ProjectsResponse, UserResponse } from "./models/UserModel";
import authHeader, { storeAccessToken } from "./utils/auth";

export const API_URL = 'http://localhost:8000';


export async function loginUser(formData: SubmitData) {

  const resp = await fetch(`${API_URL}/auth/login`, {
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

  if (!resp.ok) {
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
  storeAccessToken(accessToken);
  return { message: respData.message, login_username: respData.username };

}
export async function createAccount(formData: SubmitData) {
  const registerUrl = `${API_URL}/auth/register`;

  const headers = {
    "Content-Type": "application/json"
  }

  const resp = await fetch(registerUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(formData)
  });
  if (!resp.ok || resp.status === 204) {
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


export async function logout() {
  const logoutUrl = `${API_URL}/auth/logout`;
  const headers = { ...authHeader() };
  const resp = await fetch(logoutUrl, {
    method: "POST",
    headers,
    credentials: 'include'
  })

  if (!resp.ok) {
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


export async function addProject(username: string, project: SubmitData) {
  const projectURL = `${API_URL}/projects/${username}/`;
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


export async function getProjects(username: string) {
  const headers = { ...authHeader() };
  const resp = await fetch(`${API_URL}/projects/${username}/`, {
    method: "GET",
    headers,
    credentials: 'include'
  })

  if (!resp.ok) {
    const errorData = await resp.json() as ErrorDetail;
    console.error(resp.statusText, errorData.detail);
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw {
      statusText: resp.statusText,
      status: resp.status,
      message: errorData.detail
    };
  }

  const data = await resp.json() as ProjectsResponse;
  return data;
}


export async function updateProject(username: string, formData: SubmitData) {

  const projectURL = `${API_URL}/projects/${username}/${formData.projectID}`;
  const headers = {
    ...authHeader(),
    'Content-Type': 'application/json',
  }
  const resp = await fetch(projectURL, {
    method: "PUT",
    headers,
    credentials: 'include',
    body: JSON.stringify(formData)
  });

  if (!resp.ok) {
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

export async function UserProfile(username: string) {
  const url = `${API_URL}/users/${username}/profile`;
  const headers = { ...authHeader() };

  const resp = await fetch(url, {
    method: 'GET',
    headers,
    credentials: 'include'
  })

  if (!resp.ok) {
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


export async function editUserProfile(username: string, formData: SubmitData) {
  const url = `${API_URL}/users/${username}/edit-profile`;
  console.log(formData);
  const headers = { ...authHeader(), 'Content-Type': 'application/json' };

  const resp = await fetch(url, {
    method: "PUT",
    headers,
    credentials: 'include',
    body: JSON.stringify(formData)

  });

  if (!resp.ok) {
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
  storeAccessToken(accessToken);

  return { message: respData.message, loginUsername: respData.username };
}

export async function uploadProfileImage(username: string, formData: FormData) {
  const uploadProfileImgUrl = `${API_URL}/users/${username}/upload`;

  const headers = { ...authHeader() };

  const resp = await fetch(uploadProfileImgUrl, {
    headers,
    method: "POST",
    body: formData
  });

  if (!resp.ok) {
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

export async function changePassword(username: string, formData: SubmitData) {
  const url = `${API_URL}/users/${username}/change-password`;
  console.log(formData);
  const headers = { ...authHeader(), 'Content-Type': 'application/json' };

  const resp = await fetch(url, {
    headers,
    method: "POST",
    credentials: 'include',
    body: JSON.stringify(formData)
  });
  if (!resp.ok) {
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