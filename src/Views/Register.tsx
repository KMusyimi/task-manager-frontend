import { lazy, memo, Suspense, type JSX } from "react";
import { useActionData } from "react-router-dom";
import { AuthFormSkeleton } from "../components/users/AuthLayout";
import useActionError from "../hooks/ActionErrorHook";
import type { ActionFuncError } from "../models/entity";
import type { signupAction } from "../utils/actions";


const RegistrationForm = lazy(() => import("../components/users/RegistrationForm"));


function Register(): JSX.Element {
  const errData = useActionData<typeof signupAction>();
  useActionError(errData as ActionFuncError);

  return (
    <div className={'register-form--container'}>
      <hgroup>
        <h1>Sign Up Your journey starts here.</h1>
        <h4>Register</h4>
      </hgroup>

      <Suspense fallback={<AuthFormSkeleton />}>
        <RegistrationForm />
      </Suspense>
    </div>

  )
}

export default memo(Register);