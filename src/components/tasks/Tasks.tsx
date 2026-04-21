import { memo } from "react";
import { useInfiniteScroll } from '../../hooks/CustomHooks';
import type { Task, TasksEntity } from "../../models/ProjectsModel";

import Skeleton from "../skeleton/Skeleton";


const skeletonsCount = Array.from({ length: 3 });

const TaskCardSkeleton = memo(() => {
  return (
    <div className="task-card">
      <Skeleton type={"line"} width={'135px'} height={'20px'} />
      <Skeleton type={"line"} width={'100%'} height={'65px'} />
      <Skeleton type={"line"} width={'35%'} />
      <Skeleton type={"line"} width={'50%'} />
      <Skeleton type={"line"} width={'35%'} />
    </div>
  )
})


const TaskCard = memo(({ task }: { task: Task }) => {
  return (
    <div className="task-card">
      <h1 className="title">{task.title}</h1>
      {task.description && <p className="description">{task.description}</p>
      }
      <p className={`priority ${task.priority}`}>{task.priority}</p>
      <span className="project-wrapper">
        <p className="project-name">{task.projectName}</p>
      </span>
      <p className="due-date">{task.displayDate}</p>
    </div>
  )
});


const EmptyStateSvg = memo(() => {
  return (
    <svg
      width="180"
      height="180"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background Circle */}
      <circle cx="100" cy="100" r="80" fill="#f8fafc" />

      {/* Clipboard / Box Silhouette */}
      <rect x="60" y="70" width="80" height="90" rx="8" fill="#e2e8f0" />
      <rect x="75" y="60" width="50" height="15" rx="4" fill="#cbd5e1" />

      {/* Empty Lines */}
      <rect x="75" y="95" width="50" height="4" rx="2" fill="#94a3b8" opacity="0.5" />
      <rect x="75" y="110" width="35" height="4" rx="2" fill="#94a3b8" opacity="0.5" />
      <rect x="75" y="125" width="45" height="4" rx="2" fill="#94a3b8" opacity="0.5" />

      {/* Floating Sparkles */}
      <path d="M150 60L152 64L156 66L152 68L150 72L148 68L144 66L148 64L150 60Z" fill="#fbbf24" />
      <circle cx="45" cy="90" r="3" fill="#60a5fa" />
    </svg>)
})

function TaskContainer({ tasksArr }: { tasksArr: TasksEntity }) {
  const { visibleData, triggerRef, hasMore, isLoading } = useInfiniteScroll(tasksArr);
  const tasksCls = tasksArr.length > 0 ? 'tasks-container' : 'tasks-container empty';

  return (
    <>
      <div className={tasksCls}>
        {visibleData.length > 0 ?
          <>
            {visibleData.map((task) => (<TaskCard key={task.taskID} task={task} />))}
          </>
          : <div className="empty-state">
            <EmptyStateSvg />
            <span>
              Currently no tasks to display</span>
          </div>}

      </div>
      {visibleData.length > 0 && (
        <div className="trigger-container" ref={triggerRef}>
          {hasMore ? (
            isLoading ? (
              // Show skeletons while fetching more
              skeletonsCount.map((_, i) => <TaskCardSkeleton key={`sk-${i.toString()}`} />)
            ) : (
              // Invisible spacer to trigger the Intersection Observer
              <div className="invisible-spacer" aria-hidden="true" />
            )
          ) : (
            // Only show this when we are officially out of data
            <p className="end-text">🎉 You've caught up with all tasks!</p>
          )}
        </div>)}
    </>
  )
}

EmptyStateSvg.displayName = 'EmptyStateSvg';
TaskCardSkeleton.displayName = 'TaskCardSkeleton';
TaskCard.displayName = 'TaskCard';

export default memo(TaskContainer);