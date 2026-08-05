/* eslint-disable @typescript-eslint/only-throw-error */
import { jwtDecode } from "jwt-decode";
import { redirect } from "react-router-dom";
import { API_BASE_URL } from "../api";
import type { ErrorDetail } from "../models/entity";


const loginMessage = 'To access your account and its features, please log in.'

export default function authHeader()
{
  const token = getAuthToken();
  return { Authorization: `Bearer ${token}` };
}

export const getAuthToken = (redirectPath?: string) =>
{
  const token = localStorage.getItem('token');

  if (!token )
  {
    console.error('User token missing.')
    const params = new URLSearchParams({
      message: loginMessage,
      redirect: redirectPath ?? ''
    });
    throw redirect(`/auth/login?${params.toString()}`);
  };

  try
  {
    const parsed = JSON.parse(token) as string;
    return typeof parsed === 'string' ? parsed : token;

  } catch
  {
    return token
  }
}

export const storeAccessToken = async (token: string): Promise<void> =>
{
  return new Promise((resolve, reject) =>
  {
    try
    {
      localStorage.setItem('token', JSON.stringify(token));
      // Dispatch a custom event so other tabs/components hear the change immediately
      window.dispatchEvent(new Event("token_updated"));
      resolve();
    } catch (error)
    {
      reject(error instanceof Error ? error : new Error(String(error)));
    }
  });
};


export function isTokenValid()
{
  const token = getAuthToken();
  try
  {
    const decoded: { exp: number } = jwtDecode(token);
    return decoded.exp * 1000 > Date.now();
  } catch
  {
    return false;
  }
}


export const checkValidToken = async () =>
{
  const token = getAuthToken();
  try
  {
    const decoded: { exp: number } = jwtDecode(token);

    const currentTimeInSeconds = Date.now() / 1000;
    const FIVE_MINUTES = 5 * 60;

    if (decoded.exp - currentTimeInSeconds < FIVE_MINUTES)
    {
      const resp = await refreshUserToken();

      if (resp && 'token' in resp)
      {
        await storeAccessToken(resp.token);
      }
    }

  } catch (err)
  {
    localStorage.removeItem('token');
    if (err instanceof Response) throw err;
    console.error("Network or unexpected error", err);
    throw redirect("/auth/login");
  }
}


export async function requireAuthToken(request: Request)
{
  const url = new URL(request.url);

  const segments = url.pathname.split('/').filter(Boolean);
  const username = segments[0] === 'projects' ? segments[1] : '';

  const redirectPath = segments[0] === 'projects'
    ? `/projects/${username}`
    : url.pathname;

  const token = getAuthToken(redirectPath);
  // checking if the token is still valid or has expired 
  try
  {
    const decoded: { exp: number } = jwtDecode(token);

    const currentTimeInSeconds = Date.now() / 1000;
    const FIVE_MINUTES = 5 * 60;

    if (decoded.exp - currentTimeInSeconds < FIVE_MINUTES)
    {
      const resp = await refreshUserToken(redirectPath);

      if (resp && 'token' in resp)
      {
        await storeAccessToken(resp.token);
      }
    }

  } catch (err)
  {
    localStorage.removeItem('token');
    if (err instanceof Response) throw err;
    console.error("Network or unexpected error", err);
    throw redirect("/auth/login");
  }

  return null;
}


export async function refreshUserToken(redirectPath?: string)
{

  const userMeUrl = `${API_BASE_URL}/auth/users/me`;
  const authorizationHeader = authHeader();
  const headers = { ...authorizationHeader };

  const resp = await fetch(userMeUrl, {
    method: "GET",
    headers,
  });
  if (resp.ok) return null;

  if (resp.status === 401)
  {
    const refreshUrl = `${API_BASE_URL}/auth/refresh`;

    const refreshResp = await fetch(refreshUrl, {
      method: "POST",
      credentials: "include"
    })

    if (refreshResp.ok)
    {
      const data = await refreshResp.json() as { accessToken: string };
      return { token: data.accessToken };
    }

    const errorData = await refreshResp.json() as ErrorDetail;
    console.error(`Error refreshing token: ${errorData.detail}`);

    const params = new URLSearchParams({
      message: "Session expired. Please login again.",
      redirect: redirectPath ?? '/projects'
    });

    throw redirect(`/auth/login?${params.toString()}`);
  }

  return null;
}
