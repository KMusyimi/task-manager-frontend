import { memo, useCallback, useMemo, useTransition, type CSSProperties } from "react";
import { useContextMenu } from "../../hooks/ProviderHooks";
import type { AsideProject, AsideProjects } from "../../models/DashboardModel";

import { useNavigate, useSearchParams } from "react-router-dom";

import React from "react";
import IconWrapper from "../general/IconWrapper";

interface ULParams
{
  projects: AsideProjects;
}

interface ProjectLiProps
{
  project: AsideProject;
  isActive: boolean;
  viewFilter: string;
}


const NestedLi = memo(({ project, isActive, viewFilter }: ProjectLiProps) =>
{
  const navigate = useNavigate();
  const { displayMenu } = useContextMenu();
  const { projectID, projectName } = project;

  const [isPending, startTransition] = useTransition();

  const styles: CSSProperties = useMemo(() => ({
    backgroundColor: project.color,
  }), [project.color])

  const handleRowClick = useCallback((e: React.MouseEvent, projectID: string, projectName: string, viewParam: string) =>
  {
    // Prevent navigation if clicking the action button
    if ((e.target as HTMLElement).closest('.dot-menu-btn')) return;

    startTransition(() =>
    {
      
      const params = new URLSearchParams({
        view: viewParam,
        project_id: projectID,
        p_name: encodeURI(projectName),
      })
      void navigate(`?${params}`)
    });
  }, [navigate]);


  const listCls = isActive ? 'project-items list-items--grid active' : 'project-items list-items--grid';

  return (
    <li
      className={`${listCls} ${isPending ? 'loading' : ''}`}
      role="button"
      onClick={(e) => { handleRowClick(e, String(projectID), projectName, viewFilter) }}>

      <span className="color-placeholder" style={styles} aria-label="user project color"></span>

      <div className={'link-name'}>
        <span className="project-name" aria-label="project name">{projectName}</span>
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


function NestedProjectsLi({ projects }: ULParams)
{
  const [searchParams] = useSearchParams();

  const projectID = searchParams.get('project_id');
  const viewFilter = searchParams.get('view') ?? 'list';

  return (
    <>
      {projects.map((project) => (
        <NestedLi
          key={project.projectID}
          viewFilter={viewFilter}
          isActive={projectID === project.projectID.toString()}
          project={project} />))
      }
    </>
  )
}

NestedLi.displayName = 'NestedLi';

export default memo(NestedProjectsLi);