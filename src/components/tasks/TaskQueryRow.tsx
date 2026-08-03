import { lazy, memo, Suspense, useCallback, useEffect, useState, useTransition } from "react";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../../api";
import { ColumnSegment, SegmentedTasksResponse, Task } from "../../models/DashboardModel";
import authHeader, { checkValidToken } from "../../utils/auth";
import { capitalize, checkDueStatus, PRIORITY_SYMBOLS } from "../../utils/utils";
import IconWrapper, { IconName } from "../general/IconWrapper";
import Skeleton from "../skeleton/Skeleton";
import { useToggleSubTask } from "./hooks/toggleSubTask";
import ProgressBarContainer from "./ProgressBarContainer";
import TasksEmpty from './TaskEmpty';
import { Tags } from "./TasksTags";
const SubTasks = lazy(() => import('./SubTasks'));

interface SegmentProps
{
  columnID: number;
  projectID?: number | null;
  updateTaskCount: (columnID: number, count: number) => void;
  initialData: ColumnSegment;
}



const TaskCardRow = memo(({ task }: { task: Task }) =>
{
  const { isOpen, onToggle } = useToggleSubTask();
  const labelFor = `task-${task.taskID.toString()}`;

  const dueStatus = checkDueStatus(task.startDate, task.endDate);
  const isOverDue = dueStatus === 'overdue';
  const priorityCls = task.priority.toLocaleLowerCase();
  const statusCls = task.status.split(' ').join('-').toLocaleLowerCase();
  const hasTags = !!task.tags.length

  return (
    <div className="task-card task-card--row" >
      <div className="el-flx" style={{ flexDirection: 'row', width: "100%", alignItems: 'start', gap: '.385em' }}>

        <label className="label-container el-flx"
          onClick={(e) => { e.stopPropagation() }}
          htmlFor={labelFor} style={{ flex: '0 0 auto', cursor: 'pointer' }}>
          <input id={labelFor} name="complete-task" type="checkbox" />
          <IconWrapper name={task.isCompleted ? 'CheckedIcon' : 'UncheckedIcon'} />
        </label>
        <div style={{ width: '100%', cursor: 'pointer' }} onClick={(e) => { onToggle(e, task.taskID) }}>

          <div className="task-section--main el-flx">

            <div className="task-card--right">
              <div className="task-header el-flx" style={{ marginBottom: hasTags ? '.35em' : '0' }}>
                <div className="title-wrapper el-flx">
                  <span className="task-key">{task.taskKey}</span>
                  <h4 className="task-title">{task.title}</h4>
                </div>
                <button className="mobile-only context-menu--btn" type="button"><IconWrapper className="dot-menu" name='FaEllipsis' /></button>
              </div>

              <div className="el-flx">
                <Tags tags={task.tags} />
                <ProgressBarContainer
                  isOpen={isOpen}
                  taskID={task.taskID}
                  initialCompleted={task.completedSubtasks}
                  initialTotal={task.totalSubtasks} />

              </div>
            </div>

            <div className="task-card--left">
              <div className="el-flx">
                <span className={`pill priority priority--${priorityCls} el-flx`} >
                  <IconWrapper name={PRIORITY_SYMBOLS[task.priority] as IconName} />
                  {capitalize(task.priority)}
                </span>
                <span className={`pill status status--${statusCls} el-flx`}>
                  <span className={'status-marker badge-marker'} />
                  {task.status}
                </span>
                <div className={`due-badge due-badge--${dueStatus} el-flx`}>
                  <IconWrapper name={(task.isCompleted || !isOverDue) ? 'FiCalendar' : 'PiLightning'} />
                  <span>{task.displayDate}</span>
                </div>
                <button className="desktop-only context-menu--btn" type="button"><IconWrapper className="dot-menu" name='FaEllipsis' /></button>
              </div>
            </div>
          </div>
          <Suspense fallback={<Skeleton type="box" width={125} height={26} />}>
            <SubTasks
              isOpen={isOpen}
              taskID={task.taskID}
              total={task.totalSubtasks} />
          </Suspense>
        </div>
      </div>
    </div>
  )
})




export function TaskQueryRow({ columnID, projectID, initialData, updateTaskCount }: SegmentProps)
{
  const { username } = useParams<{ username: string }>();

  const [isMutating, startTransition] = useTransition();

  const [tasks, setTasks] = useState<Task[]>(() => initialData.tasks);
  const [page, setPage] = useState<number>(initialData.page);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [serverHasMore, setServerHasMore] = useState<boolean>(initialData.hasMore);

  const tasksCount = tasks.length;

  useEffect(() =>
  {
    updateTaskCount(columnID, tasksCount);
  }, [columnID, tasksCount, updateTaskCount])

  // TODO: move to custom hook

  useEffect(() =>
  {
    if (page === 1) return;

    startTransition(async () =>
    {
      setIsLoading(true);
      try
      {
        const projectQuery = projectID ? `&project_id=${String(projectID)}` : "";

        await checkValidToken();

        const headers = { ...authHeader() };
        const response = await fetch(`${API_BASE_URL}/projects/${username ?? ''}/tasks/list?column_id=${String(columnID)}&page=${String(page)}&size=10${projectQuery}`, {
          method: "GET",
          headers,
          credentials: 'include'
        })
        if (!response.ok)
        {
          throw new Error("Network response error");
        }

        const data = await response.json() as SegmentedTasksResponse;
        const serverTasks = data.segments[String(columnID)]

        if (serverTasks.tasks.length > 0)
        {
          setTasks((prev) =>
          {
            const currentIds = new Set(prev.map((t) => t.taskID));
            const freshItems = serverTasks.tasks.filter((t: Task) => !currentIds.has(t.taskID));
            return [...prev, ...freshItems];
          });


          setServerHasMore(serverTasks.hasMore);
        } else
        {
          setServerHasMore(false);
          setPage((prevPage) => Math.max(1, prevPage - 1));
        }

      } catch (err)
      {
        console.error("Failed fetching segment next loop pass:", err);
        setPage((prevPage) => Math.max(1, prevPage - 1));
      } finally
      {
        setIsLoading(false);
      }
    })
  }, [columnID, page, projectID, username]);

  const navigateToPage = useCallback(() =>
  {
    if (!serverHasMore || isLoading) return;

    setPage(prev => prev + 1);


  }, [isLoading, serverHasMore]);

  const hasTasks = !!tasksCount

  return (
    <>
      {!hasTasks ? <TasksEmpty /> :
        <div className="task-wrapper--list" >
          {tasks.map((task) => (
            <TaskCardRow key={task.taskID} task={task} />
          ))}

          {serverHasMore && tasks.length >= initialData.size && (
            <button

              type="button"
              onClick={() => { navigateToPage() }}
              disabled={isLoading || isMutating}
              style={{ width: '100%', fontWeight: '500', fontSize: '.885rem', padding: '.5em', borderRadius: '.5em' }}
              className="load-more--btn"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
                  Loading fresh tasks...
                </span>
              ) : (
                "Load More Tasks"
              )}
            </button>
          )}
        </div>
      }
    </>)
}


