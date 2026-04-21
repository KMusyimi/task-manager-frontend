import { lazy, memo, Suspense, useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import { FaRegCircleCheck } from 'react-icons/fa6';
import { NavLink, useOutletContext } from "react-router-dom";

import type { AsideProjects } from "../../models/ProjectsModel";
import IconWrapper from "../general/IconWrapper";
import AddProjectForm from "./AddProjectForm";

import { useSidebar } from "../../hooks/ProviderHooks";
import LogoImg from "../general/LogoImg";

import { ProjectContextType } from "./ProjectsLayout";

import Skeleton from "../skeleton/Skeleton";
const LoadSpinner = () => import("../general/Spinner");

const LoadDropdownContent = () => import("./NestedProjectsLi");
const DropdownContent = lazy(LoadDropdownContent);
const LoadContextMenu = () => import("./ProjectContextMenu");


const activeCls = ({ isActive }: { isActive: boolean }) => (isActive ? 'link-name active' : 'link-name');

interface SideBarParamsType {
  projects: AsideProjects;
}


const DropdownSkeleton = memo(() => {
  const box = useMemo(() => Array.from({ length: 3 }), []);
  return (
    <div className=".dropdown-list">
      {box.map((_, i) => (
        <Skeleton key={`p-i ${i.toString()}`} type={"box"} className="project-items" />
      ))}
    </div>)
})


const SidebarHeader = memo(({ children }: { children: ReactNode }) => {
  return (
    <header className="sidebar-header">
      <div className="logo-wrapper">
        <LogoImg />
        <h1>Tasker</h1>
      </div>
      {children}
    </header>
  )
})


const ProjectNav = memo(({ count, children }: { count: number, children: ReactNode }) => {
  const [isToggled, setIsToggled] = useState(false);
  const hasPrefetched = useRef(false);

  const toggle = useCallback(() => { setIsToggled(prev => !prev); }, []);


  const onMouseEnterBtn = useCallback(() => {
    if (!hasPrefetched.current) {
      LoadDropdownContent()
        .then(() => { hasPrefetched.current = true; })
        .catch((e: unknown) => { console.error('Failed to prefetch lazy component ', e) })
    }
  }, [])

  const listCls = isToggled ? 'nav-list-items expanded' : 'nav-list-items';

  return (
    <nav className={'projects-nav'} aria-label="Main Navigation">
      <ul className="nav-list">
        <li className={listCls}>
          <div className='items-container list-items--grid'>
            <span className="color-placeholder"></span>

            <NavLink
              className={activeCls}
              to={'.'}
              end>
              <span className="project-name">Projects</span>
              <span className="task-count"> &#40;{count}&#41; </span>
            </NavLink>

            <button type="button"
              className="dropdown-btn"
              onMouseEnter={onMouseEnterBtn}
              aria-expanded={isToggled}
              onClick={toggle}>
              <span className="dropdown-icon">{isToggled ? '▴' : '▾'}</span>
            </button>
          </div>
          {isToggled &&
            <div className={'dropdown-panel'}>
              {children}
            </div>}
        </li>

        <li className="nav-list-items">
          <div className='items-container list-items--grid'>
            <i className="icon"><FaRegCircleCheck /></i>
            <NavLink
              to={'completed'}
              className={activeCls}>Completed</NavLink>
          </div>
        </li>
      </ul>
    </nav>)
})



function ProjectsSideBar({ projects }: SideBarParamsType) {
  const { isMobile } = useOutletContext<ProjectContextType>();
  const { closeSidebar, isSidebarOpen } = useSidebar();

  const projectsLength = projects.length;

  const hasProjects = projectsLength > 0;
  const isMobileSidebarOpen = isMobile && isSidebarOpen;

  const onMouseEnter = useCallback(() => {
    LoadSpinner()
      .then(LoadContextMenu)
      .catch((e: unknown) => { console.error('Failed to prefetch lazy component ', e) })
  }, [])
  return (
    <>
      <aside className={`project-sidebar ${(isMobileSidebarOpen) ? 'open' : ''}`}>
        <SidebarHeader>
          {isMobile && <button
            type="button"
            className="close-menu-btn mobile-only"
            onClick={closeSidebar}>
            <IconWrapper name='FaXmark' className="close-icon" />
          </button>}
        </SidebarHeader>

        <ProjectNav count={projectsLength}>
          {hasProjects ? (
            <ul className="dropdown-list" onMouseEnter={onMouseEnter}>
              <Suspense fallback={<DropdownSkeleton />}>
                <DropdownContent projects={projects} />

              </Suspense>
            </ul>
          )
            : <p className="empty-state">No projects found</p>}
        </ProjectNav>
        <AddProjectForm />
      </aside>
    </>
  )
}

ProjectNav.displayName = 'ProjectNav';

export default memo(ProjectsSideBar)