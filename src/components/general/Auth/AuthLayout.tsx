import './module/style.css';
import { CSSProperties, memo, Suspense, useMemo } from "react";
import Skeleton from "../../skeleton/Skeleton";
import { Link, Outlet, useLocation } from "react-router-dom";
import { FaArrowLeft } from 'react-icons/fa6';



interface configTypes
{
  containerCls: string;
  h1Label: string;
  label: string;
  desktopImgSrc: string;
  mobileImgSrc: string;
  helperLabel: string;
  linkCls: string;
  linkTo: string;
  linkLabel: string;
}
interface ConfigParams
{
  login: configTypes;
  register: configTypes;
}

const AUTH_CONFIG: ConfigParams = {
  login: {
    containerCls: 'form-container login-form--container',
    h1Label: 'Welcome back to Tasker!',
    label: 'Login',
    desktopImgSrc: '/images/bgi-login-desktop.webp',
    mobileImgSrc: '/images/bgi-login-mobile.webp',
    helperLabel: "Don't have an account?",
    linkCls: 'register-link',
    linkTo: '/auth/signup',
    linkLabel: 'Create account'
  },
  register: {
    containerCls: 'form-container register-form--container',
    h1Label: 'Sign Up Your journey starts here.',
    label: 'Register',
    desktopImgSrc: '/images/bgi-register-desktop.webp',
    mobileImgSrc: '/images/bgi-register-mobile.webp',
    helperLabel: "Already have an account?",
    linkCls: 'login-link',
    linkTo: '/auth/login',
    linkLabel: 'Login'
  }
}

export const AuthFormSkeleton = memo(({ isLogin }: { isLogin: boolean }) =>
{
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


const homeLinkStyles: CSSProperties = {
  position: 'absolute',
  padding: '.45em 1em',
  backgroundColor: 'var(--secondary-grey)',
  borderRadius: '.5em',
  color: "#fff",
  zIndex: 10,
  top: '1rem',
  left: '1rem',
  letterSpacing: '0.025em',
  alignItems: 'center',
  fontSize: '.75rem',
  fontWeight: '500', gap: '.285rem'
}

const BgImgWrapper = memo(({ desktopImgSrc, mobileImgSrc }: {
  desktopImgSrc: string;
  mobileImgSrc: string;
}) =>
{

  return (
    <div className={'bgi-wrapper'} style={{ position: 'relative' }}>
      <Link to={'/'} className={'glass el-flx'} style={homeLinkStyles}><FaArrowLeft />
      Home</Link>
      <picture>
        <source media="(min-width: 768px)" srcSet={desktopImgSrc} />
        <img
          src={mobileImgSrc}
          alt="An image of a elephant with long tasks"
          fetchPriority="high" />
      </picture>
    </div>
  )
})


function AuthLayout()
{
  const { pathname } = useLocation();
  const isLogin = pathname.includes('login');

  const authConfigKey = isLogin ? 'login' : 'register';

  const config = AUTH_CONFIG[authConfigKey];

  return (
    <div className="container auth-container">
      <BgImgWrapper
        desktopImgSrc={config.desktopImgSrc}
        mobileImgSrc={config.mobileImgSrc} />

      <div className="bg--form el-flx">
        <div className="gradient-container">
          <div className="bg-glow-violet" />
          <div className="bg-glow-indigo" />
        </div>
        <div className={config.containerCls}>

          <hgroup>
            <h1 className='el-flx' style={{ alignItems: 'start', gap: '.185em' }}>
              {config.h1Label}</h1>
            <h4>{config.label}</h4>
          </hgroup>
        
          <Suspense fallback={<AuthFormSkeleton isLogin={isLogin} />}>
            <Outlet />
          </Suspense>
        </div>

        <div className="user-footer">
          <p>{config.helperLabel}<Link className={config.linkCls} to={config.linkTo}>{config.linkLabel}</Link></p>
        </div>
      </div>
    </div>)
}

AuthFormSkeleton.displayName = 'AuthFormSkeleton';
BgImgWrapper.displayName = 'BgImgWrapper';


export default memo(AuthLayout);