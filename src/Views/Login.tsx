import { lazy, memo, Suspense, useMemo, type JSX } from "react";
import { Link, useActionData } from "react-router-dom";

import type { loginAction } from "../utils/actions";
import useActionError from "../hooks/ActionErrorHook";
import type { ActionFuncError } from "../models/entity";
import { useToastMessage } from "../hooks/MessageHandlerHook";
import LogoImg from "../components/general/LogoImg";
import Skeleton from "../components/skeleton/Skeleton";

const LoginForm = lazy(() => import("../components/users/LoginForm"));

const LoginFormSkeleton = memo(() => {
  const skeletons = useMemo(() => Array.from({ length: 2 }), []);

  return (<>
    <div className="auth-form">
      {skeletons.map((_, i) => (
        <div key={`sk-${i.toString()}`} className="input-wrapper">
          <Skeleton type="line" className="label-f14" width={'25%'} />
          <Skeleton type="box" height={50} />
        </div>))}
      <div className="btn-wrapper">
        <Skeleton type="line" width={'65%'} />
        <Skeleton type="box" className=" submit--btn" />
      </div>
    </div>
  </>)
})


function Login(): JSX.Element {
  const errData = useActionData<typeof loginAction>();
  useToastMessage();
  useActionError(errData as ActionFuncError);


  return (
    <>
      <div className="container auth-container auth-container--login">
        <div className="bgi-img-wrapper">
          <picture>
            <source media="(min-width: 768px)" srcSet="/images/bgi-login-desktop.webp"></source>
            <img src="/images/bgi-login-mobile.webp" alt="An image of a elephant with long tasks" fetchPriority="high" />
          </picture>
          <LogoImg />
        </div>
        <div className="bg--form">
          <div className="login-form-container">
            <hgroup>
              <h1>Welcome back to Tasker!</h1>
              <h4>Login</h4>
            </hgroup>
            <Suspense fallback={<LoginFormSkeleton />}>
              <LoginForm />
            </Suspense>
          </div>

          <footer className="user-footer">
            <p>Don't have an account?<Link className="signup-link" to={'/signup'}>Register</Link></p>
          </footer>
        </div>
      </div>
    </>
  )
}

export default memo(Login);