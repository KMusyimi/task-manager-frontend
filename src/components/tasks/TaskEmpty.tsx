import { memo } from "react";

function TasksEmpty()
{
  return (
    <div className="tasks-container empty el-flx">
      <svg
        width="180"
        height="180"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >

        <circle cx="100" cy="100" r="80" fill="var(--bg-secondary)" />


        <rect x="60" y="70" width="80" height="90" rx="8" fill="var(--primary-grey)" />
        <rect x="75" y="60" width="50" height="15" rx="4" fill="var(--secondary-grey)" />

        <rect x="75" y="95" width="50" height="4" rx="2" fill="var(--text-muted)" opacity="0.5" />
        <rect x="75" y="110" width="35" height="4" rx="2" fill="var(--text-muted)" opacity="0.5" />
        <rect x="75" y="125" width="45" height="4" rx="2" fill="var(--text-muted)" opacity="0.5" />

        <path d="M150 60L152 64L156 66L152 68L150 72L148 68L144 66L148 64L150 60Z" fill="#fbbf24" />
        <circle cx="45" cy="90" r="3" fill="var(--primary-blue)" />
      </svg>
      <p>Currently no tasks to display. Click the create task button above ☝🏼 to add a new task.</p>
    </div>
  )
}



export default memo(TasksEmpty)