import { lazy, memo, type JSX } from "react";
import { useActionData } from "react-router-dom";
import useActionError from "../hooks/ActionErrorHook";
import type { signupAction } from "../utils/actions";


const RegistrationForm = lazy(() => import("../components/users/RegistrationForm"));


function Register(): JSX.Element {
  const errData = useActionData<typeof signupAction>();
  useActionError(errData);

  return (<RegistrationForm />)
}

export default memo(Register);