import { type ActionFunctionArgs, redirect } from "react-router-dom";
import { addProject, createAccount, deleteProject, duplicateProject, loginUser, logout, updateProject } from "../api";
import type { FormParams } from "../entities/entity";
import { requireAuth } from "./auth";


export async function signupAction({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    const payload: FormParams = {}

    // TODO: make the code into a helper function
    Object.keys(data).forEach(item => {
      payload[item] = data[item] as string;
    })

    const response = await createAccount(payload);
    return redirect(`/login?message=${response.message}`);
  } catch (e) {
    return e as { message: string }
  }
}


export async function loginAction({ request }: ActionFunctionArgs) {
  try {
    const redirectPath = new URL(request.url).searchParams.get('redirect');
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    const payload: FormParams = {};

    Object.keys(data).forEach(item => {
      payload[item] = data[item] as string
    });
    const loginResp = await loginUser(payload);

    return redirect(redirectPath ?? `/projects/${loginResp.user}`);

  } catch (e: unknown) {
    return e as { message: string }
  }
}


export async function logoutAction({ request }: ActionFunctionArgs) {
  try {
    // TODO: delete console logging
    console.log('logging out...')
    await requireAuth(request);
    const data = await logout();
    localStorage.removeItem('token');
    return redirect(`/login/?message=${data.message}`)

  } catch (e: unknown) {
    if (e instanceof Error) {
      return e.message
    }
    return e as { message: string };
  }
}


// Projects action 
export async function projectAction({ params, request }: ActionFunctionArgs) {
  try {
    // TODO: change open value to 1 and close value to 0
    // Check if token id still valid and refresh token
    await requireAuth(request);
  
    const { username } = params
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const payload: FormParams = {};

    Object.keys(data).forEach(el => {
      payload[el] = data[el] as string;
    });

    switch (payload.intent) {
      case 'add':
        {
          const project = await addProject(username ?? '', payload);
          return redirect(`./${project.projectID.toString()}`);
        }

      case 'edit':
        {
          // ed-f stands for edit form
          const project = await updateProject(username ?? '', payload);
          return redirect(`./${project.projectID.toString()}?edt-form=close&message=${project.message}`);
        }
      case 'duplicate': {
        const project = await duplicateProject(username ?? '', payload.projectID);
        return redirect(`./${project.projectID.toString()}?message=${project.message}`);
      }
      case 'delete': {
        const results = await deleteProject(username ?? '', payload.projectID);
        return redirect(`.?message=${results.message}`);
      }
    }
  }
  catch (e: unknown) {
    return e as { message: string }
  }
}
