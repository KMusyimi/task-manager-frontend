import { memo } from "react";
import { useFetchSubTask } from "./hooks/fetchSubtask";
import IconWrapper from "../general/IconWrapper";

interface BtnParams
{
  taskID: number;
  initialTotal: number;
  initialCompleted: number;
  isOpen: Record<number, boolean>;
}


interface TaskProgressProps
{
  completed: number;
  total: number;
}


export const TaskProgressBar = memo(({ completed, total }: TaskProgressProps) =>
{
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const getProgressColor = (percentage: number): string =>
  {
    if (percentage === 100) return "#10b981";
    return "linear-gradient( to right, rgb(139 92 246),rgb(99 102 241)) ";

  };

  const progressColor = getProgressColor(percentage);
  return (
    <>
      <div
        className="progress-track"
        style={{
          flex: '1 0 auto',
          minWidth: '75px',
          height: "3.5px", backgroundColor: " color-mix(in srgb, var(--bg-secondary) 60%, transparent)", borderRadius: "9999px", overflow: "hidden"
        }}
      >
        <div
          className="progress-fill"
          style={{
            flex: '1 1 auto',
            width: `${String(percentage)}%`,
            height: "100%",
            borderRadius: 'inherit',
            background: progressColor,
            transition: "width 0.4s linear"
          }}
        />
      </div>
      <div className="count-indicator" style={{
        display: 'flex',
        fontFamily: 'var(--font-mono)',
        alignItems: 'center',
        whiteSpace: "nowrap",
        fontSize: "inherit",
        flex: '0 0 auto',
        fontWeight: '600',
        color: 'var(--text-muted)'
      }}>{percentage}% ({completed}/{total})</div>
    </>
  );

})


function ProgressBarContainer({ isOpen, taskID, initialTotal, initialCompleted }: BtnParams)
{
  const { subTasks, hasLoadedBefore } = useFetchSubTask(isOpen, taskID);


  const total = hasLoadedBefore ? subTasks.length : initialTotal;
  if (!total || total === 0) return null;


  const completed = hasLoadedBefore
    ? subTasks.filter(st => st.isCompleted).length
    : initialCompleted;


  return (
    <>

      <div className="el-flx"
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          color: 'var(--text-muted)',
          columnGap: '.5em',
          fontWeight: 500,
          fontSize: "0.685rem",
        }
        }>
        <TaskProgressBar completed={completed} total={total} />
        <span style={{ rotate: isOpen[taskID] ? '90deg' : '0deg', transition: 'rotate .25s ease' }}>
          <IconWrapper name="FaChevronRight" />
        </span>
      </div >

    </>
  )
}

TaskProgressBar.displayName = 'TaskProgressBar';
export default memo(ProgressBarContainer);



