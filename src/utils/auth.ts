/* eslint-disable @typescript-eslint/only-throw-error */
import { redirect } from "react-router-dom";
import { API_URL } from "../api";
import type { ErrorDetail, TokenResponse } from "../entities/entity";


interface AuthorizationHeader {
  Authorization: string;
}

const loginMessage = 'To access your account and its features, please log in.'

export default function authHeader() {
  const token = getToken();
  return { Authorization: `Bearer ${token}` } as AuthorizationHeader;
}

export const getToken = () => {
  const token = localStorage.getItem('token')
  return token ? JSON.parse(token) as string : ''
}

export const storeAccessToken = (data: TokenResponse) => {
  localStorage.setItem('token', JSON.stringify(data.accessToken));
}


export async function requireAuth(request: Request) {
  const token = getToken();
  const pathname = new URL(request.url).pathname;
  if (!token) {
     
    throw redirect(`/login?message=${loginMessage}&&redirect=${pathname}`);
  }
  // checking if the token is still valid or has expired 
  await isTokenValid(pathname);
  return null;
}


async function isTokenValid(pathname: string) {
  const userMeUrl = `${API_URL}/users/me`;
  const refreshUrl = `${API_URL}/refresh`;

  const headers = { ...authHeader() };
  try {
    const userResp = await fetch(userMeUrl, {
      method: "GET",
      headers,
    });
    if (userResp.ok) {
      return null;
    }
    if (userResp.status === 401) {
      const refreshResp = await fetch(refreshUrl, {
        method: "POST",
        headers,
        credentials: "include"
      })
      if (refreshResp.ok) {
        const data = await refreshResp.json() as { accessToken: string };
        localStorage.setItem('token', JSON.stringify(data.accessToken));
        return null;
      }


      const errorData = await refreshResp.json() as ErrorDetail;
      console.error(`Error refreshing token: ${errorData.detail}`);

       
      throw redirect(`/login?message=${loginMessage}&&redirect=${pathname}`);
    }

    console.error(`Unexpected error: ${userResp.statusText}`);
    return null;

  } catch (error) {
    console.error("Network or fetch error:", error);
     
    throw redirect(`/login?message=${loginMessage}&&redirect=${pathname}`);
  }
}

export function checkUserIsLoggedIn() {
  const token = getToken();
  if (token) {
    redirect('/')
  }
}
