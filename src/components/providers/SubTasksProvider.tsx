import { createContext, use, useCallback, useMemo, useState, useTransition } from "react";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../../api";
import { SubTask } from "../../models/DashboardModel";
import authHeader, { checkValidToken } from "../../utils/auth";

type SubTaskMap = Record<number, SubTask[]>;

interface SubTaskContextType
{
  subTaskRegistry: SubTaskMap;
  setSubTasksForTask: (taskID: number, subTasks: SubTask[]) => void;
  toggleSubTask: (taskID: number, subTaskID: number) => void;
  isMutating: boolean;
}


// eslint-disable-next-line react-refresh/only-export-components
export const SubTaskContext = createContext<SubTaskContextType | undefined>(undefined);

export const SubTaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) =>
{
  const [subTaskRegistry, setSubTaskRegistry] = useState<SubTaskMap>({});
  const [isMutating, startTransition] = useTransition();
  const { username } = useParams<{ username: string }>();

  const setSubTasksForTask = useCallback((taskID: number, subTasks: SubTask[]) =>
  {
    setSubTaskRegistry(prev => ({ ...prev, [taskID]: subTasks }));
  }, []);


  const toggleSubTask = useCallback((taskID: number, subTaskID: number) =>
  {
    const previousSubTasks = subTaskRegistry[taskID];

    const targetSubTask = previousSubTasks.find(st => st.subTaskID === subTaskID);

    if (!targetSubTask) return;

    const nextTargetState = !targetSubTask.isCompleted;

    // 2. Instantly update UI cache state optimistically (zero latency checkbox flip)
    setSubTaskRegistry(prev =>
    {
      const currentList = prev[taskID] ?? [];
      const updatedList = currentList.map(st =>
        st.subTaskID === subTaskID ? { ...st, isCompleted: nextTargetState } : st
      );
      return { ...prev, [taskID]: updatedList };
    });

    startTransition(async () =>
    {
      await checkValidToken();
      try
      {
        const headers = { ...authHeader(), 'Content-Type': 'application/json' };
        const url = `${API_BASE_URL}/projects/${username ?? ''}/tasks/${String(taskID)}/sub-tasks/toggle`;

        const response = await fetch(url, {
          headers,
          method: "PATCH",
          credentials: 'include',
          body: JSON.stringify({
            subTaskID,
            is_completed: nextTargetState
          }),
        });

        if (!response.ok)
        {
          throw new Error("Server rejected subtask toggle mutation update request");
        }
      } catch (error)
      {
        console.error("Failed to sync subtask status to MySQL backend:", error);

        setSubTaskRegistry(prev => ({
          ...prev,
          [taskID]: previousSubTasks
        }));

      }
    });
  }, [subTaskRegistry, username]);

  const memoData = useMemo(() => ({ subTaskRegistry, setSubTasksForTask, toggleSubTask, isMutating }), [isMutating, setSubTasksForTask, subTaskRegistry, toggleSubTask]);

  return (
    <SubTaskContext value={memoData}>
      {children}
    </SubTaskContext>
  );

}


// eslint-disable-next-line react-refresh/only-export-components
export const useSubTasks = () =>
{
  const context = use(SubTaskContext);
  if (!context) throw new Error("useSubTasks must be used within a SubTaskProvider");
  return context;
};