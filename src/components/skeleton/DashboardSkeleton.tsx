import { memo } from "react";
import Skeleton from "./Skeleton";


const skeletonLines = Array.from({ length: 3 });
const skeletonBox = Array.from({ length: 2 });

const TaskSectionSkeleton = memo(() => {
  
  return (
    <>
      <section className="task-section">
        <header className="task-header flex" >
          <Skeleton type={"line"} width={'90%'} height={'40px'} />
          <Skeleton type={"line"} width={'45%'} height={'1em'} />
        </header>
        <div className="tasks-container">
          {skeletonLines.map((_, i) => (
            <div key={`${i.toString()}-r`} className="task-card">
              <Skeleton type={"line"} width={'135px'} height={'20px'} />
              <Skeleton type={"line"} width={'100%'} height={'65px'} />
              <Skeleton type={"line"} width={'35%'} />
              <Skeleton type={"line"} width={'50%'} />
              <Skeleton type={"line"} width={'35%'} />
            </div>))}
        </div>
      </section>
    </>
  )
})


const InputWrapperSkeleton = memo(() => {
  return (
    <div className="project-form" >
      <div className="input-wrapper">
        <div className="form-dropdown--btn" >
          <Skeleton type="box" className="color-placeholder" />
          <div className={'dropdown-icon'}>&#8964;</div>
        </div>
        <Skeleton type="box" className="project-input" />
        <Skeleton type="box" className="submit-btn" />
      </div>
    </div >
  )
})

function DashboardSkeleton() {
  return (
    <>
      <aside className="project-sidebar">
        <div className="sidebar-header">
          <div className="logo-wrapper">
            <Skeleton type={"box"} className="logo" width={'40'} height={'40'} />
            <Skeleton type={"line"} width={'65px'} height={'22px'} />
          </div>
        </div>

        <nav className="projects-nav">
          <ul className={'nav-list'}>
            {skeletonBox.map((_, i) => (
              <li key={`r-${i.toString()}`} className="nav-list-items">
                <Skeleton type="box" className="items-container" />
              </li>
            ))}
          </ul>
        </nav>
        <div className="project-form">
          <InputWrapperSkeleton />
        </div>
      </aside>
      <TaskSectionSkeleton />
    </>)
}

TaskSectionSkeleton.displayName =  'TaskSectionSkeleton';
InputWrapperSkeleton.displayName = 'InputWrapperSkeleton';

export default memo(DashboardSkeleton);
