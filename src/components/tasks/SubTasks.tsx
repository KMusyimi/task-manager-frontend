import { CSSProperties, memo, Suspense } from "react";
import { SubTask } from "../../models/DashboardModel";
import { useFetcher, useParams } from "react-router-dom";
import { useFetchSubTask } from "./hooks/fetchSubtask";
import { SubTasksSkeleton } from "./TasksSkeletons";
import IconWrapper from "../general/IconWrapper";


interface FetcherResponse
{
  subTasks: SubTask[];
  response: { status?: string, message?: string };
}

interface SubTasksListProps
{
  isOpen: Record<number, boolean>;
  taskID: number;
  total: number;
}

const spanStyles: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  color: 'var(--text-muted)',
  fontWeight: '600',
  alignSelf:"center"
}


function SubTasksList({ isOpen, taskID, total }: SubTasksListProps)
{
  const { username } = useParams<{ username: string }>();
  const fetcher = useFetcher<FetcherResponse>();

  const { subTasks, isLoading, toggleSubTask } = useFetchSubTask(isOpen, taskID);


  return (
    <div className="subtask-container el-flx" onClick={(e) => { e.stopPropagation(); }}
    >
      <span className="el-flx">Subtasks
        <span className="count-indicator" style={{ ...spanStyles }}>{total}</span>

      </span>
      {isOpen[taskID] && total > 0 && (
        <>
          {isLoading ? (<SubTasksSkeleton />) : (
            <Suspense fallback={<SubTasksSkeleton taskID={taskID} />}>
              <div style={{ display: "flex", flexDirection: "column" }}
                onClick={(e) => { e.stopPropagation(); }}
              >
                {(
                  subTasks.map((subTask) =>
                  {
                    const stID = String(subTask.subTaskID);
                    return (
                      <div key={stID} className="subtask-wrapper el-flx" style={{
                        cursor: 'pointer',
                        marginBottom: '.385em', gap: '.385em', alignItems: 'center'
                      }}>
                        <label onClick={(e) => { e.stopPropagation() }}
                          className="label-container el-flx"
                          htmlFor={`st-${stID}`} style={{ cursor: 'pointer' }}>
                          <input
                            id={`st-${stID}`}
                            type="checkbox"
                            checked={subTask.isCompleted}
                            onClick={(e) => { e.stopPropagation(); }}
                            onChange={() => { toggleSubTask(taskID, subTask.subTaskID) }}
                          />
                          <IconWrapper name={subTask.isCompleted ? 'CheckedIcon' : 'UncheckedIcon'} />
                        </label>
                        <span className="title" style={{ textDecoration: subTask.isCompleted ? "line-through" : "none", fontWeight: '400', fontSize: '.75rem' }}>
                          {subTask.title}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </Suspense>
          )}

        </>
      )}
      {/*TODO:  Keeping your working fetcher creation form intact */}
      <fetcher.Form
        className="el-flx"
        method="POST"
        action={`/projects/${username ?? ''}/tasks/${String(taskID)}/sub-tasks`}

        onSubmit={(e) =>
        {
          const form = e.currentTarget;
          setTimeout(() => { form.reset(); }, 0);
        }}
      >
        <IconWrapper name='FaPlus' />
        <input
          type="text"
          name="title"
          placeholder="Add a sub-task..."
          required
        />
        <button
          className="el-flx"
          type="submit"
        >
          <kbd style={{ fontFamily: 'inherit' }}>↵</kbd>
        </button>
      </fetcher.Form>

    </div>
  );
}




export default memo(SubTasksList);