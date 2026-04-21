import { jwtDecode } from "jwt-decode";
import { redirect, type LoaderFunctionArgs } from "react-router-dom";
import { getProjects, UserProfile } from "../api";
import { requireAuth } from "./auth";



export async function authenticateLoader(request: Request) {
  await requireAuth(request);
}


export async function userProfileLoader({ params, request }: LoaderFunctionArgs) {
  await authenticateLoader(request);
  const { username } = params;
  const name = username ?? '';
  const user = await UserProfile(name);

  return { user }
}

export async function projectsLoader({ params, request }: LoaderFunctionArgs) {
  await authenticateLoader(request);
  const { username } = params;
  const name = username ?? '';

  return { projectsResp: getProjects(name) }
}




export function projectsRedirectLoader() {
  try {
    const token = localStorage.getItem('token');
    console.log('hello from get user');
    const authToken = token ? JSON.parse(token) as string : null;
    if (authToken) {
      const decoded: { sub: string } = jwtDecode(authToken);
      return redirect(decoded.sub);
    }
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    else throw redirect('/login');

  } catch (e: unknown) {
    console.error('Error when accessing token', e);
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw redirect('/login');
  }

}