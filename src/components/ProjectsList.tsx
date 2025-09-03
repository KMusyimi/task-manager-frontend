import { lazy, Suspense, useCallback, useId, useMemo, useRef, useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { NavLink } from "react-router-dom";
import type { Projects } from "../entities/entity";


const ProjectItem = lazy(() => import("./ProjectItems"));

interface ProjectListParamsType {
  projects: Projects
}

//TODO: Change to project wrapper
export default function ProjectsList({ projects }: ProjectListParamsType) {
  const id = useId();

  const [toggle, setToggle] = useState(true);

  const ulRef = useRef<HTMLUListElement | null>(null);

  const styles: React.CSSProperties = {
    maxHeight: ulRef.current ? 325 : 0,
    height: 'auto',
    overflowY: ulRef.current ? 'scroll' : 'hidden',
    transition: 'max-height .4s cubic-bezier(0.4, 0, 1, 1)'
  }

  const handleToggle = useCallback(() => {
    setToggle(prev => !prev);
  }, []);

  const projectListItems = useMemo(() => {
    return projects.map((project, idx) => {
      return (
        <Suspense key={`p-${id}-${idx.toString()}`} fallback={<div>Loading project...</div>}>
          <ProjectItem
            idx={idx}
            project={project}
          />
        </Suspense>
      )
    })
  }, [id, projects]);

  return (
    <>
      <div className="projects-wrapper">
        {/* TODO: move to own component */}
        <div>
          <NavLink
            className={({ isActive }) => isActive ? 'active' : ''}
            to={'.'} end>Projects</NavLink>
          <span className="task-count">({projects.length})</span>
          <button
            type='button'
            onClick={handleToggle} ><RiArrowDropDownLine
              style={{ rotate: ulRef.current ? '180deg' : '0deg', transition: 'rotate 0.35s cubic-bezier(0.4, 0, 1, 1)' }} /></button>
        </div>
        {toggle && (
          <Suspense fallback={<div>Loading projects...</div>}>
            <ul
              ref={ulRef}
              className="projects-list"
              style={styles}
            >
              {projectListItems}
            </ul>
          </Suspense>
        )
        }
      </div>
    </>
  )
}
