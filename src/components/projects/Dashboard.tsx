import { memo, use, useMemo } from "react";

import { useOutletContext } from "react-router-dom";
import { useProjectIDSearchParams } from "../../hooks/ProjectIDHook";
import { PriorityMap, type Task } from "../../models/ProjectsModel";
import { ProjectsResponse } from "../../models/UserModel";
import { ProjectContextType } from "../../Views/ProjectsLayout";
import TaskContainer from '../tasks/Tasks';
import ProjectsSideBar from "./ProjectsSideBar";



interface DashboardParams {
  dataPromise: Promise<ProjectsResponse>
}

const compareTaskByPriority = (taskA: Task, taskB: Task) => {
  // - If A < B (priorityA is numerically smaller, meaning higher priority), A comes first (-1).
  // - If A > B (priorityA is numerically larger, meaning lower priority), B comes first (1).
  // - If A = B (priorities are equal), maintain current order (0).
  const priorityA = PriorityMap[taskA.priority];
  const priorityB = PriorityMap[taskB.priority];

  //  Primary Sort: Priority
  if (priorityA !== priorityB) {
    return priorityA - priorityB; // Shorthand for -1, 1, 0
  }

  // Secondary Sort: Date (only if priorities are equal)
  // Handle cases where one or both tasks might not have a date
  const timeA = taskA.endDate ?? Infinity;
  const timeB = taskB.endDate ?? Infinity;

  return timeA - timeB;
};

function Dashboard({ dataPromise }: DashboardParams) {
  const { username } = useOutletContext<ProjectContextType>();

  const response = use(dataPromise);

  const { projects } = response;
  const activeID = useProjectIDSearchParams();


  const { projectsArr, tasksArr } = useMemo(() => {
    const targetID = activeID ? Number(activeID) : null;

    const pArr = projects.map(({ tasks, ...metadata }) => ({
      ...metadata, taskCount: tasks.length
    }));

    const tasks = targetID
      ? projects.find(p => p.projectID === targetID)?.tasks ?? []
      : projects.flatMap(p => p.tasks);

    const tArr = [...tasks].sort(compareTaskByPriority);

    return {
      projectsArr: pArr,
      tasksArr: tArr
    };
  }, [activeID, projects]);


  return (
    <>
      <ProjectsSideBar projects={projectsArr} />

      <section className="task-section">
        <header className="task-header">
          <h1>Welcome back,
            <span className={`username-target`}>{username}</span>
          </h1>
          <p>What are you doing today?</p>
        </header>
        <TaskContainer tasksArr={tasksArr} />
      </section>
    </>)
}

export default memo(Dashboard);