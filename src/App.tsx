import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import './App.css';
import Tasks from './components/Tasks';
import Login from './Views/Login';
import ProjectLayout from './Views/ProjectView';
import SignUp from './Views/SignUp';
import { loginAction, logoutAction, projectAction, signupAction } from './utils/actions';
import { loginLoader, projectsLoader, projectsRedirect, tasksLoader } from './utils/loaders';
import NotFound from './components/NotFound';
import Error from './components/Error';



const router = createBrowserRouter(createRoutesFromElements(
  <Route path={'/'}>
    <Route index element={<h1>Homepage</h1>}/>
    <Route
      path={'login'}
      element={<Login />}
      loader={loginLoader}
      errorElement={<Error />}
      action={loginAction}/>

    <Route
      path='signup'
      element={<SignUp />}
      action={signupAction}
      errorElement={<Error />}/>

    <Route
      path='/projects'
      element={<></>}
      loader={projectsRedirect}
      errorElement={<Error />}/>

    <Route
      path='/projects/:username'
      element={<ProjectLayout />}
      loader={projectsLoader}
      action={projectAction}
      errorElement={<Error />}
    >
      <Route index element={<Tasks />} loader={tasksLoader}/>
      <Route path=':projectID' element={<Tasks />} loader={tasksLoader}/>
    </Route>
    
    <Route path={'logout'} action={logoutAction} errorElement={<Error />}/>
    <Route path='*' element={<NotFound />}/>
  </Route>))


function App() {
  return (<RouterProvider router={router} />)
}

export default App
