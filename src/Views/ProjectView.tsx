import { lazy, Suspense, use } from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import Header from "../components/Header";

import type { projectsLoader } from "../utils/loaders";
import { MdOutlineLightMode } from "react-icons/md";
import { ThemeContext } from "../components/ThemeProvider";
import { FaRegMoon } from "react-icons/fa6";
import DeleteModalProvider from "../components/DeleteModalProvider";


const Sidebar = lazy(() => import('../components/SideBar'));
const Logout = lazy(() => import('../components/Logout'));
const DeleteModal = lazy(() => import("../components/DeleteModal"));


export default function ProjectLayout() {
  const { projects } = useLoaderData<typeof projectsLoader>();
  const { theme, handleThemeToggle } = use(ThemeContext)

  return (
    <>
      <Header className="header">
        <h1>my header</h1>
        <button
          className="theme-btn"
          type="button"
          onClick={handleThemeToggle}
          aria-label="Toggle Theme">
          <i className="them-icon">
            {theme === 'dark' ? <MdOutlineLightMode /> : <FaRegMoon />}
          </i>
        </button>
        {/* TODO: add a user profile  */}
        <Suspense fallback={<div>Loading logout...</div>}>
          <Logout />
        </Suspense>
      </Header>
      <main className="main">
        <DeleteModalProvider>
          <Suspense fallback={<div>Loading content...</div>}>
            <Sidebar projects={projects} />
            <DeleteModal />
          </Suspense>
          <Outlet />
        </DeleteModalProvider>
      </main>
      {/* TODO: add a footer */}
    </>
  )
}