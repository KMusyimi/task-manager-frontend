import { useEffect, useMemo } from "react";
import { useFetcher } from "react-router-dom";
import { SubTask } from "../../../models/DashboardModel";
import { useSubTasks } from "../../providers/SubTasksProvider";

interface FetcherResponse
{
  subTasks: SubTask[];
  response: { status?: string, message?: string };
}

export function useFetchSubTask(isOpen: Record<number, boolean>, taskID: number)
{
  const fetcher = useFetcher<FetcherResponse>();
  const { subTaskRegistry, setSubTasksForTask, toggleSubTask } = useSubTasks();

  const hasLoadedBefore = Object.hasOwn(subTaskRegistry, taskID);
  const isLoading = fetcher.state === "loading" && !hasLoadedBefore;

  const subTasks = useMemo(() =>
  {
    return subTaskRegistry[taskID] ?? [];
  }, [subTaskRegistry, taskID]);

  useEffect(() =>
  {
    if (isOpen[taskID] && !hasLoadedBefore && fetcher.state === "idle")
    {
      fetcher.load(`tasks/${String(taskID)}/sub-tasks`)
        .catch((e: unknown) => { console.error('Failed to pre-populate provider context', e); });
    }
  }, [fetcher, hasLoadedBefore, isOpen, taskID]);

  useEffect(() =>
  {
    if (fetcher.data?.subTasks)
    {
      const subtasks = fetcher.data.subTasks;
      setSubTasksForTask(taskID, subtasks);
    }
  }, [fetcher.data?.subTasks, setSubTasksForTask, taskID]);

  

  return { subTasks, isLoading, hasLoadedBefore, toggleSubTask }
}
