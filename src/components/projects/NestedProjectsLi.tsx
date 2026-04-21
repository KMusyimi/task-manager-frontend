import { memo, useCallback, useMemo, useTransition, type CSSProperties } from "react";
import { useContextMenu } from "../../hooks/ProviderHooks";
import type { AsideProject, AsideProjects } from "../../models/ProjectsModel";

import { NavigateFunction, useNavigate } from "react-router-dom";

import React from "react";
import { useProjectIDSearchParams } from "../../hooks/ProjectIDHook";
import IconWrapper from "../general/IconWrapper";

interface ULParams {
  projects: AsideProjects;
}

interface ProjectLiProps {
  project: AsideProject;
  isActive: boolean
}


const NestedLi = memo(({ project, isActive }: ProjectLiProps) => {
  const navigate = useNavigate();
  const { displayMenu } = useContextMenu();
  
  const [isPending, startTransition] = useTransition();

  const styles: CSSProperties = useMemo(() => ({
    backgroundColor: project.color,
  }), [project.color])

  const activeProject = useMemo(() => (isActive ? project.projectName : null), [isActive, project.projectName]);
  console.log(activeProject);

  const handleRowClick = useCallback((e: React.MouseEvent, navigate: NavigateFunction, projectID: string) => {
    const linkTo = `?projectID=${projectID}`;
    // Prevent navigation if clicking the action button
    if ((e.target as HTMLElement).closest('.dot-menu-btn')) return;

    startTransition(() => {
      void navigate(linkTo);
    });
  }, []);

  
  const listCls = isActive ? 'project-items list-items--grid active' : 'project-items list-items--grid';
  console.log(isPending);
  return (
    <li
      className={`${listCls} ${isPending ? 'loading' : ''}`}
      role="button"
      onClick={(e) => { handleRowClick(e, navigate, project.projectID.toString()) }}>
      
      <span className="color-placeholder" style={styles} aria-label="user project color"></span>
      
      <div className={'link-name'}>
        <span className="project-name" aria-label="project name">{project.projectName}</span>
        <span className="task-count" aria-label="projects count"> ({project.taskCount})</span>
      </div>
      
      <button
        type="button"
        className="dot-menu-btn"
        onClick={(e) => { displayMenu(e, project) }}>
        <IconWrapper className="dot-menu" name='FaEllipsis' />
      </button>
    </li>
  )
});


function NestedProjectsLi({ projects }: ULParams) {
  const activeID = useProjectIDSearchParams();

  return (
    <>
      {projects.map((project) => (
        <NestedLi
          key={project.projectID}
          isActive={activeID === project.projectID.toString()}
          project={project} />))
      }
    </>
  )
}

NestedLi.displayName = 'NestedLi';

export default memo(NestedProjectsLi);