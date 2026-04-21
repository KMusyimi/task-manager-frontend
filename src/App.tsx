import { lazy } from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import './App.css';
import Login from './Views/Login';
import DashboardView from './Views/DashboardView';
import Register from './Views/Register';
import UsersView from './Views/UsersView';
import ProjectLayout from './components/projects/ProjectsLayout';
import { loginAction, logoutAction, profileUploadAction, projectAction, signupAction, userProfileAction } from './utils/actions';
import { projectsLoader, projectsRedirectLoader, userProfileLoader } from './utils/loaders';

const ProfileUpload = lazy(() => import('./Views/ProfileUpload'));
const Logout = lazy(() => import('./Views/Logout'));
const Error = lazy(() => import('./components/general/Error'));

const NotFound = lazy(() => import('./components/general/NotFound'));



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
          element={<UsersView />}
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
      path={'login'}
      element={<Login />}
      errorElement={<Error />}
      action={loginAction} />

    <Route
      path='signup'
      element={<Register />}
      action={signupAction}
      errorElement={<Error />} />

    <Route path='*' element={<NotFound />} />
  </Route>))


function App() {
  return (<RouterProvider router={router} />)
}

export default App
