import { lazy } from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import './App.css';
import AuthLayout from './components/users/AuthLayout';
import { loginAction, logoutAction, profileUploadAction, projectAction, signupAction, userProfileAction } from './utils/actions';
import { projectsLoader, projectsRedirectLoader, userProfileLoader } from './utils/loaders';
import ProjectLayout from './Views/ProjectsLayout';
import UsersLayout from './Views/UsersLayout';

const ProfileUpload = lazy(() => import('./Views/ProfileUpload'));
const Logout = lazy(() => import('./Views/Logout'));
const Error = lazy(() => import('./Views/ErrorView'));
const Register = lazy(() => import('./Views/Register'));
const Login = lazy(() => import('./Views/Login'));

const DashboardView = lazy(() => import('./Views/DashboardView'));
const NotFound = lazy(() => import('./Views/NotFound'));



const router = createBrowserRouter(createRoutesFromElements(
  <Route path={'/'}>
    <Route index element={<h1>Homepage</h1>} />
    {/* TODO: add a redirect page */}
    <Route path={'projects'}
      id='project-root'
      element={<ProjectLayout />}
      loader={userProfileLoader}
      errorElement={<Error />}>

      <Route index element={<></>} loader={projectsRedirectLoader} />

      <Route
        path={':username'}
        element={<DashboardView />}
        loader={projectsLoader}
        action={projectAction} >

        <Route
          path='profile'
          id='user-profile'
          element={<UsersLayout />}
          action={userProfileAction}>
          <Route
            path={'upload'}
            action={profileUploadAction}
            element={<ProfileUpload />}
          />
          <Route
            path={'logout'}
            element={<Logout />}
            action={logoutAction} />
        </Route>

      </Route>

    </Route>
    <Route
      path='auth'
      element={<AuthLayout />}
      errorElement={<Error />}>
      <Route
        path={'login'}
        element={<Login />}
        action={loginAction} />

      <Route
        path='signup'
        element={<Register />}
        action={signupAction} />
    </Route>

    <Route path='*' element={<NotFound />} />
  </Route>))


function App() {
  return (<RouterProvider router={router} />)
}

export default App
