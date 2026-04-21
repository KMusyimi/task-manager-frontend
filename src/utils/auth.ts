/* eslint-disable @typescript-eslint/only-throw-error */
import { redirect } from "react-router-dom";
import { API_URL } from "../api";
import type { ErrorDetail } from "../models/entity";
import { jwtDecode } from "jwt-decode";


interface AuthorizationHeader {
  Authorization: string;
}

const loginMessage = 'To access your account and its features, please log in.'

export default function authHeader() {
  const token = getAuthToken();
  return { Authorization: `Bearer ${token ?? ''}` } as AuthorizationHeader;
}

export const getAuthToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const parsed = JSON.parse(token) as string;
    return typeof parsed === 'string' ? parsed : token;
  } catch {
    return token;
  }
}

export const storeAccessToken = (accessToken: string) => {
  localStorage.setItem('token', JSON.stringify(accessToken));
}


export async function requireAuth(request: Request) {
  console.log("Require Authorization");
  const url = new URL(request.url);

  const pathname = url.pathname;

  const token = getAuthToken();
  if (!token) {
    const params = new URLSearchParams({
      message: loginMessage,
      redirect: pathname
    });
    throw redirect(`/login?${params.toString()}`);
  }
  // checking if the token is still valid or has expired 
  try {
    const decoded: { exp: number } = jwtDecode(token);

    const currentTimeInSeconds = Date.now() / 1000;
    const FIVE_MINUTES = 5 * 60;

    if (decoded.exp - currentTimeInSeconds < FIVE_MINUTES) {
      console.log("Token expiring soon, refreshing...");
      
      const resp = await refreshUserToken(pathname);
      
      if (resp && 'token' in resp) {
        localStorage.setItem('token', JSON.stringify(resp.token));
      }
    }

  } catch (err) {
    localStorage.removeItem('token');
    if (err instanceof Response) throw err;
    console.error("Network or unexpected error", err);
    throw redirect("/login");
  }

  return null;
}


async function refreshUserToken(pathname: string) {

  const userMeUrl = `${API_URL}/auth/users/me`;

  const headers = { ...authHeader() };

  const resp = await fetch(userMeUrl, {
    method: "GET",
    headers,
  });
  if (resp.ok) return null;

  if (resp.status === 401) {
    const refreshUrl = `${API_URL}/auth/refresh`;

    const refreshResp = await fetch(refreshUrl, {
      method: "POST",
      headers,
      credentials: "include"
    })

    if (refreshResp.ok) {
      const data = await refreshResp.json() as { accessToken: string };
      return { token: data.accessToken };
    }

    const errorData = await refreshResp.json() as ErrorDetail;
    console.error(`Error refreshing token: ${errorData.detail}`);

    const params = new URLSearchParams({
      message: "Session expired. Please login again.",
      redirect: pathname
    });

    throw redirect(`/login?${params.toString()}`);
  }

  return null;
}
