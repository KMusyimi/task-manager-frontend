import { memo, useCallback, useState } from "react";
import { SegmentedTasksResponse } from "../../models/DashboardModel";


import { getColumnCls } from "../../utils/utils";
import IconWrapper from "../general/IconWrapper";
import Skeleton from "../skeleton/Skeleton";
import { TaskQueryRow } from "./TaskQueryRow";


const skeletonCards = Array.from({ length: 3 });


interface TaskListParams
{
  openForm: (columnID?: number) => void;
  currentProject: string | null;
  tasks: SegmentedTasksResponse;
  isMobile: boolean;
}



// const compareTaskByPriority = (taskA: Task, taskB: Task) =>
// {
//   // - If A < B (priorityA is numerically smaller, meaning higher priority), A comes first (-1).
//   // - If A > B (priorityA is numerically larger, meaning lower priority), B comes first (1).
//   // - If A = B (priorities are equal), maintain current order (0).
//   const priorityA = PriorityMap[taskA.priority];
//   const priorityB = PriorityMap[taskB.priority];

//   //  Primary Sort: Priority
//   if (priorityA !== priorityB)
//   {
//     return priorityA - priorityB; // Shorthand for -1, 1, 0
//   }

//   // Secondary Sort: Date (only if priorities are equal)
//   // Handle cases where one or both tasks might not have a date
//   const timeA = taskA.endDate ?? Infinity;
//   const timeB = taskB.endDate ?? Infinity;

//   return timeA - timeB;
// };

const TaskCardSkeleton = memo(() =>
{
  return (<div className="task-card">
    <Skeleton type={"line"} width={'135px'} height={'20px'} />
    <Skeleton type={"line"} width={'100%'} height={'65px'} />
    <Skeleton type={"line"} width={'35%'} />
    <Skeleton type={"line"} width={'50%'} />
    <Skeleton type={"line"} width={'35%'} />
  </div>)
})

const TaskWrapperSkeleton = memo(() =>
{
  return (
    <div className="tasks-rows" style={{ height: 'fit-content' }}>
      {skeletonCards.map((_, i) => (<TaskCardSkeleton key={`${i.toString()}-r`} />))
      }
    </div>
  )
})



export const EmptyStateSvg = memo(() =>
{
  return (
    <svg
      width="180"
      height="180"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >

      <circle cx="100" cy="100" r="80" fill="#f8fafc" />


      <rect x="60" y="70" width="80" height="90" rx="8" fill="#e2e8f0" />
      <rect x="75" y="60" width="50" height="15" rx="4" fill="#cbd5e1" />

      <rect x="75" y="95" width="50" height="4" rx="2" fill="#94a3b8" opacity="0.5" />
      <rect x="75" y="110" width="35" height="4" rx="2" fill="#94a3b8" opacity="0.5" />
      <rect x="75" y="125" width="45" height="4" rx="2" fill="#94a3b8" opacity="0.5" />

      <path d="M150 60L152 64L156 66L152 68L150 72L148 68L144 66L148 64L150 60Z" fill="#fbbf24" />
      <circle cx="45" cy="90" r="3" fill="#60a5fa" />
    </svg>)
})



export function TaskListView({ tasks, openForm }: TaskListParams)
{

  const segmentsArray = Object.values(tasks.segments);
  const [taskCount, setTaskCount] = useState<Record<number, number>>({});

  const updateTaskCount = useCallback((columnID: number, count: number) =>
  {
    setTaskCount(prev => ({ ...prev, [columnID]: count }));
  }, [])



  return (
    <div className="tasks-bgc">
      {segmentsArray.map((segment) =>
      {
        const cls = getColumnCls(segment.columnName);
        return (
          <div key={segment.columnID} className="tasks-list--view">
            <div className={`column-name--wrapper el-flx ${cls}`}>
              <span className={`status-marker`} />
              <h3 className="column-name">{segment.columnName}</h3>
              <span className="task-count el-flx">{taskCount[segment.columnID]}</span>
              <button
                type={'button'}
                onClick={() => { openForm(segment.columnID) }}
                className="add-task--btn">
                <IconWrapper name='FaPlus' />
              </button>
            </div>
            <TaskQueryRow
              columnID={segment.columnID}
              projectID={tasks.projectID ?? null}
              updateTaskCount={updateTaskCount}
              initialData={segment}
            />
          </div>
        )
      })}
    </div>

  )
}


TaskWrapperSkeleton.displayName = 'TaskContainerSkeleton';
TaskCardSkeleton.displayName = 'TaskCardSkeleton';

export default memo(TaskListView);