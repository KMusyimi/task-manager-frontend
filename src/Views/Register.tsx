import { lazy, memo, Suspense, useMemo, type JSX } from "react";
import { Link, useActionData } from "react-router-dom";
import type { signupAction } from "../utils/actions";
import useActionError from "../hooks/ActionErrorHook";
import type { ActionFuncError } from "../models/entity";
import LogoImg from "../components/general/LogoImg";
import Skeleton from "../components/skeleton/Skeleton";


const RegistrationForm = lazy(() => import("../components/users/RegistrationForm"));

const RegisterFormSkeleton = memo(() => {
  const skeletons = useMemo(() => Array.from({ length: 3 }), []);
  
  return (
    <>
      <div className="auth-form">
        {skeletons.map((_, i) => (
          <div key={`sk-${i.toString()}`} className="input-wrapper">
            <Skeleton type="line" className="label-f14" width={'25%'} />
            <Skeleton type="box" height={50}/>
          </div>))}
        <div className="btn-wrapper">
          <div className="skeleton submit--btn" />
        </div>
      </div>
    </>)
})

function Register(): JSX.Element {
  const errData = useActionData<typeof signupAction>();
  useActionError(errData as ActionFuncError);

  return (
    <>
      <div className="container auth-container auth-container--register">
        <div className="bgi-img-wrapper">
          <picture>
            <source media="(min-width: 768px)" srcSet="/images/bgi-register-desktop.webp"></source>
            <img src="/images/bgi-register-mobile.webp" alt="An image of a elephant with long tasks" fetchPriority="high" />
          </picture>
          <LogoImg />
        </div>
        <div className="bg--form">
          <div className={'register-form--container'}>
            <hgroup>
              <h1>Sign Up Your journey starts here.</h1>
              <h4>Register</h4>
            </hgroup>
            <Suspense fallback={<RegisterFormSkeleton />}>
              <RegistrationForm />
            </Suspense>
          </div>
          <footer className="user-footer">
            <p>Already have an account?<Link to={'/login'}>Login</Link></p>
          </footer>
        </div>
      </div>
    </>
  )
}

export default memo(Register);