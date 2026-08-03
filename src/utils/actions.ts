import { type ActionFunctionArgs, redirect } from "react-router-dom";
import { addProject, changePassword, createAccount, createTask, deleteProject, duplicateProject, editUserProfile, loginUser, logout, updateProject, uploadProfileImage } from "../api";
import type { ActionFuncError, FormParams } from "../models/entity";
import { requireAuthToken } from "./auth";
import { processFormData } from "./utils";

const currentTimestamp = Date.now();

interface ProjectActionParams
{
  username: string;
  payload: FormParams;
  search: string;
}

const projectActionObj = {
  add: async ({ username, payload, search }: ProjectActionParams) =>
  {

    const resp = await addProject(username, payload);
    if ('isError' in resp)
    {
      console.error('projectAction add errors ->', resp.message)
      return { error: resp.message, status: resp.status, timestamp: currentTimestamp }
    }

    const searchParams = new URLSearchParams(
      search.startsWith('?') ? search.slice(1) : search || ''
    );

    searchParams.set('message', resp.message || 'Added project successfully');

    return redirect(`.?${searchParams.toString()}`);
  },

  edit: async ({ username, payload, search }: ProjectActionParams) =>
  {
    const resp = await updateProject(username, payload);
    if ('isError' in resp)
    {
      console.error('projectAction edit errors ->', resp.message)
      return { error: resp.message, status: resp.status, timestamp: currentTimestamp }
    }

    const searchParams = new URLSearchParams(
      search.startsWith('?') ? search.slice(1) : search || ''
    );

    searchParams.set('message', resp.message || 'Edited project successfully');

    return redirect(`.?${searchParams.toString()}`);
  },

  duplicate: async ({ username, payload, search }: ProjectActionParams) =>
  {
    const resp = await duplicateProject(username, payload.projectID);
    if ('isError' in resp)
    {
      console.error('projectAction duplicate errors ->', resp.message)
      return { error: resp.message, status: resp.status, timestamp: currentTimestamp }
    }


    const searchParams = new URLSearchParams(
      search.startsWith('?') ? search.slice(1) : search || ''
    );

    searchParams.set('message', resp.message || 'Project duplicated successfully');

    // 3. Construct a bulletproof query string
    return redirect(`.?${searchParams.toString()}`);
  },

  delete: async ({ username, payload }: ProjectActionParams) =>
  {
    const resp = await deleteProject(username, payload.projectID);
    if ('isError' in resp)
    {
      console.error('projectAction delete errors ->', resp.message)
      return { error: resp.message, status: resp.status, timestamp: currentTimestamp }
    }

    const searchParams = new URLSearchParams();
    searchParams.set('message', resp.message || 'Edited project successfully');

    return redirect(`.?${searchParams.toString()}`);
  }
}

const userActionObj = {
  edit: async ({ username, payload, search }: { username: string, payload: FormParams, search?: string }) =>
  {
    const response = await editUserProfile(username, payload);
    if ('isError' in response)
    {
      console.error('userProfileAction edit-profile errors ->', response.message)
      return { error: response.message, status: response.status, timestamp: currentTimestamp } as ActionFuncError
    }
    const { loginUsername, message } = response;

    const msg = encodeURIComponent(message);

    const finalUrl = `/projects/${loginUsername}/profile?message=${msg}&${search ?? ''}`

    return redirect(finalUrl);
  },

  changePw: async ({ username, payload }: { username: string, payload: FormParams }) =>
  {
    const response = await changePassword(username, payload);
    if ('isError' in response)
    {
      console.error('userProfileAction edit-profile errors ->', response.message)
      return { error: response.message, status: response.status, timestamp: currentTimestamp } as ActionFuncError
    }
    localStorage.removeItem('token');
    const msg = encodeURIComponent(response.message);
    return redirect(`/auth/login/?message=${msg}`);
  }
}


export async function signupAction({ request }: ActionFunctionArgs)
{
  const payload = await processFormData(request);
  const response = await createAccount(payload);
  if ('isError' in response)
  {
    console.error('signup action errors ->', response.message)
    return {
      error: response.message,
      status: response.status,
      timestamp: currentTimestamp
    }
  }
  const msg = encodeURIComponent(response.message);

  const params = new URLSearchParams({
    message: msg
  });

  return redirect(`/auth/login?${params.toString()}`);
}


export async function loginAction({ request }: ActionFunctionArgs)
{
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const redirectPath = searchParams.get("redirect");

  const payload = await processFormData(request);
  const response = await loginUser(payload);

  if ('isError' in response)
  {
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

  const params = new URLSearchParams({
    message: msg,
  })

  return redirect(`${basePath}?${params.toString()}`);

}


export async function logoutAction({ request }: ActionFunctionArgs)
{
  const payload = await processFormData(request);
  if ('intent'in payload){
    const response = await logout();
    if ('isError' in response)
    {
      console.error('logoutAction errors ->', response.message)
      return { error: response.message, status: response.status, timestamp: currentTimestamp }
    }
    localStorage.removeItem('token');
  
    const msg = encodeURIComponent(response.message);
  
    return redirect(`/auth/login/?message=${msg}`);
  }
}


// Projects action 
export async function dashboardAction({ params, request }: ActionFunctionArgs)
{
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const search = searchParams.toString();
  const { username } = params;

  const payload = await processFormData(request);
  const key = payload.intent as keyof typeof projectActionObj;

  if (!username)
  {
    return { error: 'Username is missing', status: 401, timestamp: currentTimestamp };
  }

  await requireAuthToken(request);

  return await projectActionObj[key]({ username, payload, search });
}



export async function userProfileAction({ params, request }: ActionFunctionArgs)
{
  const payload = await processFormData(request);
  const url = new URL(request.url);

  const searchParams = url.searchParams;
  const search = searchParams.toString();
  const { username } = params;

  if (!username)
  {
    return { error: 'Username is missing', status: 401 };
  }

  await requireAuthToken(request);

  const key = payload.intent as keyof typeof userActionObj;
  return await userActionObj[key]({ username, payload, search });
}


// TODO: add timestamp
export async function profileUploadAction({ params, request }: ActionFunctionArgs)
{
  const formData = await request.formData();
  const { username } = params;

  if (!username)
  {
    return { success: false, error: 'Username is missing', status: 401, message: null };
  }

  await requireAuthToken(request);

  const response = await uploadProfileImage(username, formData);

  if ('isError' in response)
  {
    console.error('userProfileAction edit-profile errors ->', response.message)
    return { success: false, error: response.message, status: response.status, message: null }
  }
  return redirect(`.?message=${response.message}`)
}


export async function taskAction({ params, request }: ActionFunctionArgs)
{
  const payload = await processFormData(request);

  const url = new URL(request.url);
  const search = url.searchParams.toString();

  const { username } = params;

  if (!username)
  {
    return { error: 'Username or task id  is missing', status: 401 };
  }

  await requireAuthToken(request);

  const response = await createTask(username, payload);

  if ('isError' in response)
  {
    console.error('task action create task errors ->', response.message)
    return { success: false, error: response.message, status: response.status, message: null }
  }


  const msg = encodeURIComponent(response.message);

  const urlParams = new URLSearchParams({
    message: msg
  }).toString();

  return redirect(`?${search}&${urlParams}`);
}