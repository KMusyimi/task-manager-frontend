import { lazy } from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import "@fontsource-variable/bricolage-grotesque/index.css";
import "@fontsource/geist-sans/400.css";
import "@fontsource/geist-sans/500.css";
import "@fontsource/geist-sans/600.css"; 
import "@fontsource/dm-mono/400.css";
import "@fontsource/dm-mono/500.css";
import './App.css';
import './components/general/style/Spinner.css';
import './components/skeleton/style/Skeleton.css';

import AuthLayout from './components/general/Auth/AuthLayout';
import { dashboardAction, loginAction, logoutAction, profileUploadAction, signupAction, taskAction, userProfileAction } from './utils/actions';
import { dashboardLoader, subTasksLoader, tasksLoader } from './utils/loaders';
import DashboardLayout from './Views/DashboardLayout';
import Error from './Views/ErrorView';
import NotFound from './Views/NotFound';
import Homepage from './Views/Homepage';

const TasksDashboard = lazy(() => import('./Views/TasksContainer'));
const Register = lazy(() => import('./Views/Register'));
const Login = lazy(() => import('./Views/Login'));


const router = createBrowserRouter(createRoutesFromElements(
  <Route path={'/'}>
    <Route index element={<Homepage/>} />
    {/* TODO: add a redirect page */}
    <Route path={'projects'}
      id='project-root'
      element={<DashboardLayout />}
      loader={dashboardLoader}
      errorElement={<Error />}>

      <Route
        path={':username'}
        element={<TasksDashboard />}
        loader={tasksLoader} action={dashboardAction}>

        <Route path={'tasks'} element={null} action={taskAction} />
        <Route
          path='profile'
          id='user-profile'
          element={null} action={userProfileAction}/>
        <Route
          path={'profile/upload'}
          action={profileUploadAction}
          element={null}
        />
        <Route
          path={'profile/logout'}
          element={null}
          action={logoutAction} />

        <Route
          path={'tasks/:taskID/sub-tasks'}
          element={null}
          loader={subTasksLoader} />
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
  </Route>
))


function App()
{
  return (<RouterProvider router={router} />)
}

export default App
