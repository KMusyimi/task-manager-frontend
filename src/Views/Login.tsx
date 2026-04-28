import { lazy, memo, Suspense, type JSX } from "react";
import { useActionData } from "react-router-dom";

import { AuthFormSkeleton } from "../components/users/AuthLayout";
import useActionError from "../hooks/ActionErrorHook";
import { useToastMessage } from "../hooks/MessageHandlerHook";
import type { loginAction } from "../utils/actions";

const LoginForm = lazy(() => import("../components/users/LoginForm"));


function Login(): JSX.Element {
  const errData = useActionData<typeof loginAction>();
  useToastMessage();
  useActionError(errData);


  return (
    <div className="login-form--container">
      <hgroup>
        <h1>Welcome back to Tasker!</h1>
        <h4>Login</h4>
      </hgroup>

      <Suspense fallback={<AuthFormSkeleton />}>
        <LoginForm />
      </Suspense>
    </div>
  )
}

export default memo(Login);