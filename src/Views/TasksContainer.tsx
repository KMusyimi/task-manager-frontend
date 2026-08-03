import { memo, Suspense, useCallback, useEffect, useState } from "react";
import { Outlet, useLoaderData, useOutletContext } from "react-router-dom";

import type { tasksLoader } from "../utils/loaders";

import { RouterElSpinner } from "../components/general/Spinner";
import { SubTaskProvider } from "../components/providers/SubTasksProvider";
import Skeleton from "../components/skeleton/Skeleton";
import TaskAddFormModal from "../components/tasks/TaskAddForm";
import TaskBoard from "../components/tasks/TaskBoardView";
import { TaskListView } from "../components/tasks/TaskListView";
import { useMediaQuery } from "../hooks/ViewPortHooks";
import { KanbanColumn, SegmentedTasksResponse } from "../models/DashboardModel";
import { DashboardCtxParams } from "./DashboardLayout";

const skeletonCards = Array.from({ length: 3 });

const TaskCardSkeleton = memo(() =>
{
  return (
    <div className="task-card">
      <Skeleton type={"line"} width={'135px'} height={'20px'} />
      <Skeleton type={"line"} width={'100%'} height={'65px'} />
      <Skeleton type={"line"} width={'35%'} />
      <Skeleton type={"line"} width={'50%'} />
      <Skeleton type={"line"} width={'35%'} />
    </div>)
})

const TaskContainerSkeleton = memo(() =>
{
  return (
    <div className="tasks-container">
      <div className="tasks-wrapper" style={{ height: 'fit-content' }}>
        {skeletonCards.map((_, i) => (<TaskCardSkeleton key={`${i.toString()}-r`} />))
        }
      </div>
    </div>
  )
})


function TasksView()
{
  const { view } = useOutletContext<DashboardCtxParams>();

  const isMobile = useMediaQuery("(max-width: 768px)");
  const { tasks, projectID } = useLoaderData<typeof tasksLoader>();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [defaultColumnID, setDefaultColumnID] = useState(1);


  const openForm = useCallback((columnID?: number) =>
  {
    setIsFormOpen(true);
    setDefaultColumnID(columnID ?? 1);
  }, []);

  const closeForm = useCallback(() =>
  {
    setDefaultColumnID(1);
    setIsFormOpen(false);
  }, []);


  useEffect(() =>
  {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [projectID]);

  return (
    <>
      <div className="tasks-container"
        style={{ touchAction: 'pan-y', WebkitOverflowScrolling: 'touch' }}>

        <SubTaskProvider>
          <Suspense fallback={<RouterElSpinner />}>
            {view === 'board' ?
              <TaskBoard
                key={projectID ?? view}
                isMobile={isMobile}
                openForm={openForm}
                tasks={tasks as KanbanColumn[]} />
              :
              <TaskListView
                key={projectID ?? 'all'}
                isMobile={isMobile}
                openForm={openForm}
                currentProject={projectID ?? null}
                tasks={tasks as SegmentedTasksResponse}
              />
            }
          </Suspense>
        </SubTaskProvider>
        {isFormOpen &&
          <TaskAddFormModal
            defaultColumnID={defaultColumnID}
            closeForm={closeForm} />}
      </div>
      <Outlet />
    </>
  )
}


TaskContainerSkeleton.displayName = 'TaskContainerSkeleton';
TaskCardSkeleton.displayName = 'TaskCardSkeleton';

export default memo(TasksView);