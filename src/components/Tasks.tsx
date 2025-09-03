import moment from "moment";
import { Suspense, use, useMemo } from "react";
import { Link, useLoaderData } from "react-router-dom";
import Header from "./Header";
import type { tasksLoader } from "../utils/loaders";
import type { Task } from "../entities/entity";

export function TaskCard({ task }: { task: Task }) {
  return (
    <Link to={`task/${task.taskID.toString()}`} className="task-card" style={{
      display: 'block',
      border: '1px solid greenyellow', marginBottom: '.45em', borderRadius: '.5em'
    }}>
      <p className={`priority-${task.priority}`}>{task.priority}</p>
      <h2 className="title">{task.title}</h2>
      <p className="project-name">{task.projectName}</p>
      <p className="due-date">{moment(task.endDate).format('D MMMM')}</p>
      {/* TODO:: add project icon svg */}
    </Link>)
}


export default function Tasks() {
  const { tasks } = useLoaderData<typeof tasksLoader>();
  const loadedTasks = use(tasks);

  const myTasks = useMemo(() => {
    return loadedTasks.map(task => { return (<TaskCard key={task.taskID} task={task} />) })
  }, [loadedTasks])

  return (
    <section className="task-section">
      <Header className="task-header">
        <h1>Tasks</h1>
      </Header>
      <div className="task-container">
        <Suspense fallback={<h1>Loading...</h1>}>
          {myTasks}
        </Suspense>
      </div>
    </section>)
}
// TODO: delete sample data
// endDate
// "2025-09-17T13:00:22"
// priority
// "LOW"
// projectName
// "Gym"
// startDate
// "2025-08-20T12:27:27"
// status
// "completed"
// taskID
// 5
// title
// "reading"