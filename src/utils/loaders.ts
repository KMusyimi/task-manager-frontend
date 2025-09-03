import { redirect, type LoaderFunctionArgs } from "react-router-dom";
import { API_URL, getProjects, getTasks } from "../api";
import authHeader, { requireAuth } from "./auth";
import type { ErrorDetail } from "../entities/entity";

export function loginLoader({ request }: LoaderFunctionArgs) {
  return new URL(request.url).searchParams.get('message');
}


export async function projectsLoader({ params, request }: LoaderFunctionArgs) {
  const { username } = params;
  await requireAuth(request);
  return { projects: getProjects(username ?? '') }
}


export async function tasksLoader({ params, request }: LoaderFunctionArgs) {
  const { username } = params;
  await requireAuth(request);
  return { tasks: getTasks(username ?? '', params.projectID ?? '') }
}


export async function projectsRedirect({ request }: LoaderFunctionArgs) {
  await requireAuth(request);
  const userMeUrl = `${API_URL}/users/me`;

  const headers = { ...authHeader() };

  const resp = await fetch(userMeUrl, {
    method: "GET",
    headers,
  });

  if (!resp.ok) {
    const errorData = await resp.json() as ErrorDetail;
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw { status: resp.status, statusText: resp.statusText, message: errorData.detail };
  }
  const user = await resp.json() as { username: string }
  return redirect(user.username);
}