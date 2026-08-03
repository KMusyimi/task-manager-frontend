import { lazy, memo, type JSX } from "react";
import { useActionData } from "react-router-dom";

import useActionError from "../hooks/ActionErrorHook";
import { useToastMessage } from "../hooks/MessageHandlerHook";
import type { loginAction } from "../utils/actions";

const LoginForm = lazy(() => import("../components/general/Auth/LoginForm"));


function Login(): JSX.Element {
  const errData = useActionData<typeof loginAction>();
  useToastMessage(errData?.error? 'error': 'success');
  useActionError(errData);

  return (<LoginForm />)
}

export default memo(Login);