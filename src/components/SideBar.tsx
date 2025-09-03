import { lazy, Suspense, use, useState } from "react";
import type { ProjectFormParams, Projects } from "../entities/entity";
import Header from "./Header";
import Nav from "./Nav";


const ProjectForm = lazy(() => import("./ProjectForm"));

const ProjectsList = lazy(() => import("./ProjectsList"));


const defaultFormState: ProjectFormParams = {
  intent: 'add',
  projectID: undefined,
  project_name: "",
  color: ""
}

export interface SideBarParamsType {
  projects: Promise<Projects>
}
// TODO: add lazy component and suspense all imported Components
export default function SideBar({ projects }: SideBarParamsType) {
  const [formState,] = useState(() => ({ ...defaultFormState }))
  const loadedProjects = use(projects);

  return (
    <>
      <aside className="project-aside">
        <Header className="header">
          {/* TODO: add logo */}
          <h1>lorem ipsum</h1>
        </Header>
        <Nav className={'project-nav'}>
          <Suspense fallback={<div>Loading Projects...</div>}>
            <ProjectsList projects={loadedProjects} />
          </Suspense>
        </Nav>
        <Suspense fallback={<div>Loading Project Form...</div>}>
          <ProjectForm projectData={formState} />
        </Suspense>
      </aside>
    </>
  )
}