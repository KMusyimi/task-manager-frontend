import React, { lazy, Suspense, use, useCallback, useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { NavLink, useFetcher, useSearchParams } from "react-router-dom";
import type { Project, ProjectFormParams } from "../entities/entity";
import { DeleteContext } from "./DeleteModalProvider";
import List from "./List";
import OptionsMenu from "./OptionsMenu";


const ProjectForm = lazy(() => import("./ProjectForm"));

interface ProjectProps {
  idx: number;
  project: Project
}

const formState: ProjectFormParams = {
  projectID: undefined,
  project_name: "",
  color: "",
  intent: "add"
}

export default function ProjectItem({ idx, project }: ProjectProps) {
  const [toggleMenu, setToggleMenu] = useState<Record<number, boolean>>({});
  const [toggleForm, setToggleForm] = useState<Record<number, boolean>>({});

  const [editState, setEditState] = useState<ProjectFormParams>(() => ({ ...formState }));
  const { handleDltPayload } = use(DeleteContext);

  const [searchParams, setSearchParams] = useSearchParams();

  const fetcher = useFetcher();

  const handleEditParams = useCallback(() => {
    const param = searchParams.get('edt-form');

    handleParams(param);

    function handleParams(param: string | null) {
      if (param !== null && toggleForm[idx]) {
        setToggleMenu(prev => ({ ...prev, [idx]: !prev[idx] }));
        setSearchParams(prev => {
          prev.delete('edt-form');
          return prev;
        });

      }
    }
  }, [idx, searchParams, setSearchParams, toggleForm]);

  useEffect(() => {
    handleEditParams();
  }, [handleEditParams]);

  const handleToggleMenu = useCallback((idx: number) => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setToggleMenu(prev => ({ ...prev, [idx]: !prev[idx] }));
  }, [])

  const handleDeleteBtn = useCallback((projectID: string, name: string) => {
    handleDltPayload({ id: projectID, inputName: 'projectID', name, isOpen: true });
    setToggleMenu(prev => ({ ...prev, [idx]: !prev[idx] }));
  }, [handleDltPayload, idx]);


  const handleDisplayForm = useCallback((idx: number) => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setToggleMenu(prev => ({ ...prev, [idx]: !prev[idx] }));
    setEditState({
      intent: 'edit',
      projectID: project.projectID.toString(),
      project_name: project.projectName,
      color: project.color
    });

    setToggleForm(prev => ({ ...prev, [idx]: !prev[idx] }));
  }, [project.color, project.projectID, project.projectName])
  
  
  return (
    <List className="project-item">
      {/* TODO: add svg with project color */}
      {toggleForm[idx] ? (
        <ProjectForm
          projectData={editState} />) :
        <div className="items-container">
          <NavLink
            className={({ isActive }) => isActive ? 'active' : ''}
            to={project.projectID.toString()}
          >{project.projectName}</NavLink>
          <span className="task-count">({project.taskCount})</span>
          <button
            type="button"
            onClick={handleToggleMenu(idx)}
          ><BsThreeDots /></button>
        </div>
      }

      {/* TODO: move to own component modal , lazy import and suspense*/}
      {toggleMenu[idx] &&
        <Suspense fallback={<div>Loading menu...</div>}>
          <OptionsMenu>
            <fetcher.Form method="post">
              <input type="hidden" name="projectID" value={project.projectID} />
              <input type="hidden" name="intent" value={'duplicate'} />
              <button type="submit">Duplicate</button>
            </fetcher.Form>
            <button type="button" onClick={handleDisplayForm(idx)}>Edit</button>
            <button type='button'
              onClick={() => {
                handleDeleteBtn(project.projectID.toString(), project.projectName)
              }}
            >Delete</button>
          </OptionsMenu>
        </Suspense>
      }
    </List>
  )
}