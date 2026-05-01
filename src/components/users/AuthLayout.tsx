import { CSSProperties, memo, Suspense, useMemo } from "react";
import Skeleton from "../skeleton/Skeleton";
import { Link, Outlet, useLocation } from "react-router-dom";
import LogoImg from "../general/LogoImg";

const styles: CSSProperties = { fontFamily: `"Poppins",'Poppins-Fallback',sans-serif`, marginBottom: 0, fontSize: '1.25em' }



export const AuthFormSkeleton = memo(({ isLogin }: { isLogin: boolean }) => {
  const skeletons = useMemo(() => Array.from({ length: isLogin ? 2 : 3 }), [isLogin]);
  
  return (
    <div className="auth-form">
      {skeletons.map((_, i) => (
        <div key={`sk-${i.toString()}`} className="input-wrapper">
          <Skeleton type="line" className="label-f14" width={'25%'} />
          <Skeleton type="box" height={50} />
        </div>))}
      <div className="btn-wrapper">
        {isLogin && <Skeleton type="line" width={'65%'} />}
        <div className="skeleton submit--btn" />
      </div>
    </div>
  )
})


const BgImgWrapper = memo(({ isLogin }: { isLogin: boolean }) => {
  const desktopImg = isLogin ? "/images/bgi-login-desktop.webp" : "/images/bgi-register-desktop.webp";

  const mobileImg = isLogin ? "/images/bgi-login-mobile.webp" : "/images/bgi-register-mobile.webp";

  return (
    <div className="bgi-img-wrapper">
      <picture>
        <source media="(min-width: 768px)" srcSet={desktopImg} />
        <img
          src={mobileImg}
          alt="An image of a elephant with long tasks"
          fetchPriority="high" />
      </picture>

      <div className="logo-wrapper">
        <LogoImg />
        <h1 style={styles}>Tasker</h1>
      </div>
    </div>)
})


function AuthLayout() {
  const { pathname } = useLocation();
  const isLogin = pathname.includes('login');

  const divCls = isLogin ? 'login-form--container' : 'register-form--container';

  return (
    <div className="container auth-container">
      <BgImgWrapper isLogin={isLogin} />

      <div className="bg--form">
        <div className={divCls}>
          <hgroup>
            <h1>{isLogin ? 'Welcome back to Tasker!' : 'Sign Up Your journey starts here.'}</h1>
            <h4>{isLogin ? 'Login' : 'Register'}</h4>
          </hgroup>

          <Suspense fallback={<AuthFormSkeleton isLogin={isLogin} />}>
            <Outlet />
          </Suspense>

        </div>

        <footer className="user-footer">
          {isLogin ? <p>Don't have an account?<Link className="signup-link" to={'/auth/signup'}>Register</Link></p> :
            <p>Already have an account?<Link className="login-link" to={'/auth/login'}>Login</Link></p>}
        </footer>
      </div>
    </div>)
}

AuthFormSkeleton.displayName = 'AuthFormSkeleton';
BgImgWrapper.displayName = 'BgImgWrapper';


export default memo(AuthLayout);