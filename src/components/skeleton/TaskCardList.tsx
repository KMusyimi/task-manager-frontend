import TaskCardSkeleton from "./TaskCardSkeleton";

export default function TaskListSkeleton() {
  return (
    <>
    {Array(3).fill(null).map((_, i)=>(
      <TaskCardSkeleton key={`${i.toString()}-t`} />
    ))}
    </>
  );
}