import { type ActionFunctionArgs, redirect } from "react-router-dom";
import { addProject, changePassword, createAccount, deleteProject, duplicateProject, editUserProfile, loginUser, logout, updateProject, uploadProfileImage } from "../api";
import { requireAuth } from "./auth";
import { processFormData } from "./utils";
import type { ActionFuncError, FormParams } from "../models/entity";

const currentTimestamp = Date.now();



const projectActionObj = {
  add: async ({ username, payload }: { username: string, payload: FormParams }) => {
    const resp = await addProject(username, payload);
    if ('isError' in resp) {
      console.error('projectAction add errors ->', resp.message)
      return { error: resp.message, status: resp.status, timestamp: currentTimestamp }
    }

    const projectID = encodeURIComponent(resp.projectID);
    const msg = encodeURIComponent(resp.message);

    return redirect(`.?projectID=${projectID}&message=${msg}`);
  },

  edit: async ({ username, payload }: { username: string, payload: FormParams }) => {
    const resp = await updateProject(username, payload);
    if ('isError' in resp) {
      console.error('projectAction edit errors ->', resp.message)
      return { error: resp.message, status: resp.status, timestamp: currentTimestamp }
    }
    const projectID = encodeURIComponent(resp.projectID);
    const msg = encodeURIComponent(resp.message);

    return redirect(`.?projectID=${projectID}&message=${msg}`);
  },

  duplicate: async ({ username, payload }: { username: string, payload: FormParams }) => {
    const resp = await duplicateProject(username, payload.projectID);
    if ('isError' in resp) {
      console.error('projectAction duplicate errors ->', resp.message)
      return { error: resp.message, status: resp.status, timestamp: currentTimestamp }
    }

    const projectID = encodeURIComponent(resp.projectID);
    const msg = encodeURIComponent(resp.message);

    return redirect(`.?projectID=${projectID}&message=${msg}`);
  },

  delete: async ({ username, payload }: { username: string, payload: FormParams }) => {
    const resp = await deleteProject(username, payload.projectID);
    if ('isError' in resp) {
      console.error('projectAction delete errors ->', resp.message)
      return { error: resp.message, status: resp.status, timestamp: currentTimestamp }
    }
    const msg = encodeURIComponent(resp.message);
    return redirect(`.?message=${msg}`);
  }
}

const userActionObj = {
  edit: async ({ username, payload, search }: { username: string, payload: FormParams, search?: string }) => {
    const response = await editUserProfile(username, payload);
    if ('isError' in response) {
      console.error('userProfileAction edit-profile errors ->', response.message)
      return { error: response.message, status: response.status, timestamp: currentTimestamp } as ActionFuncError
    }
    const { loginUsername, message } = response;
    
    const msg = encodeURIComponent(message);
    const finalUrl = `/projects/${loginUsername}/profile?message=${msg}&${search ?? ''}`
    
    return redirect(finalUrl);
  },

  changePw: async ({ username, payload }: { username: string, payload: FormParams }) => {
    const response = await changePassword(username, payload);
    if ('isError' in response) {
      console.error('userProfileAction edit-profile errors ->', response.message)
      return { error: response.message, status: response.status, timestamp: currentTimestamp } as ActionFuncError
    }
    localStorage.removeItem('token');
    const msg = encodeURIComponent(response.message);
    return redirect(`/auth/login/?message=${msg}`);
  }
}


export async function signupAction({ request }: ActionFunctionArgs) {
  const payload = await processFormData(request);
  const response = await createAccount(payload);
  if ('isError' in response) {
    console.error('signup action errors ->', response.message)
    return {
      error: response.message,
      status: response.status,
      timestamp: currentTimestamp
    }
  }
  const msg = encodeURIComponent(response.message);
  return redirect(`/auth/login?message=${msg}`);
}


export async function loginAction({ request }: ActionFunctionArgs) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const redirectPath = searchParams.get("redirect");

  const payload = await processFormData(request);
  const response = await loginUser(payload);

  if ('isError' in response) {
    console.error('login action errors ->', response.message)
    return {
      error: response.message,
      status: response.status,
      timestamp: currentTimestamp
    }
  }
  const { login_username, message } = response;
  const basePath = redirectPath ?? `/projects/${login_username}`;
  const msg = encodeURIComponent(message);

  return redirect(`${basePath}?message=${msg}`);

}


export async function logoutAction() {
  const response = await logout();
  if ('isError' in response) {
    console.error('logoutAction errors ->', response.message)
    return { error: response.message, status: response.status, timestamp: currentTimestamp }
  }

  localStorage.removeItem('token');
  const msg = encodeURIComponent(response.message);

  return redirect(`/auth/login/?message=${msg}`);
}


// Projects action 
export async function projectAction({ params, request }: ActionFunctionArgs) {
  const { username } = params;
  if (!username) {
    return { error: 'Username is missing', status: 401, timestamp: currentTimestamp };
  }
  const payload = await processFormData(request);
  const key = payload.intent as keyof typeof projectActionObj;
  return await projectActionObj[key]({ username, payload });
}



export async function userProfileAction({ params, request }: ActionFunctionArgs) {
  const { username } = params;
  if (!username) {
    return { error: 'Username is missing', status: 401 };
  }
  await requireAuth(request);

  const payload = await processFormData(request);
  const url = new URL(request.url);

  const searchParams = url.searchParams;
  const search = searchParams.toString();

  const key = payload.intent as keyof typeof userActionObj;
  return await userActionObj[key]({ username, payload, search });
}


// TODO: add timestamp
export async function profileUploadAction({ params, request }: ActionFunctionArgs) {
  const { username } = params;

  if (!username) {
    return { success: false, error: 'Username is missing', status: 401, message: null };
  }

  await requireAuth(request);

  const formData = await request.formData();
  const response = await uploadProfileImage(username, formData);

  if ('isError' in response) {
    console.error('userProfileAction edit-profile errors ->', response.message)
    return { success: false, error: response.message, status: response.status, message: null }
  }

  return { success: true, message: response.message, error: null, status: null }
}