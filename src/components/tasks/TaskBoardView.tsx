import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd";
import { CSSProperties, lazy, memo, Suspense, useRef, useState, useTransition } from "react";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../../api";
import { KanbanColumn, Task } from "../../models/DashboardModel";
import authHeader from "../../utils/auth";
import { capitalize, checkDueStatus, getColumnCls, PRIORITY_SYMBOLS } from "../../utils/utils";
import IconWrapper, { IconName } from "../general/IconWrapper";
import { useToggleSubTask } from "./hooks/toggleSubTask";
import ProgressBarContainer from "./ProgressBarContainer";
import TasksEmpty from './TaskEmpty';
import { SubTasksSkeleton } from "./TasksSkeletons";
import { Tags } from "./TasksTags";


const SubTasks = lazy(() => import('./SubTasks'));


export interface ToggleSubTaskPayload
{
  subTaskID: number;
  isCompleted: boolean;
}

interface KanbanParams
{
  column: KanbanColumn;
  hasTasks: boolean;
}

interface TaskBoardParams
{
  openForm: (columnID?: number) => void;
  tasks: KanbanColumn[];
  isMobile: boolean;
}



const TaskCardBoard = memo(({ task, style }: { task: Task, style: CSSProperties }) =>
{
  const { isOpen, onToggle } = useToggleSubTask();
  const labelFor = `task-${task.taskID.toString()}`;
  const dueStatus = checkDueStatus(task.startDate, task.endDate);
  const isOverDue = dueStatus === 'overdue';

  const priorityCls = task.priority.toLocaleLowerCase();

  return (
    <div className="task-card task-card--board" style={style}>
      <div className="title-wrapper el-grd">
        <label className="label-container el-flx" htmlFor={labelFor}>
          <input id={labelFor} name="complete-task" type="checkbox" />
          <IconWrapper name={task.isCompleted ? 'CheckedIcon' : 'UncheckedIcon'} />
          <span className="task-key">{task.taskKey}</span>
        </label>
        <div className="el-flx">
          <span className={`pill priority priority--${priorityCls} el-flx`} >
            <IconWrapper name={PRIORITY_SYMBOLS[task.priority] as IconName} />
            {capitalize(task.priority)}
          </span>
          <button className="context-menu--btn" type="button"><IconWrapper className="dot-menu" name='FaEllipsis' /></button>
        </div>
      </div>
      <div className="task-main el-flx" style={{ cursor: task.totalSubtasks ? 'pointer' : 'grab' }}
        onClick={(e) => { onToggle(e, task.taskID) }}>

        <h4 className="task-title">{task.title}</h4>
        {!!task.description && <span className="description field-wrapper">{task.description}</span>}

        <ProgressBarContainer
          isOpen={isOpen}
          taskID={task.taskID}
          initialCompleted={task.completedSubtasks}
          initialTotal={task.totalSubtasks} />

        <Suspense fallback={<SubTasksSkeleton taskID={task.taskID} />}>
          <SubTasks
            isOpen={isOpen}
            taskID={task.taskID}
            total={task.totalSubtasks}
          />
        </Suspense>
        <Tags tags={task.tags} />
      </div>

      <div className="task-footer el-flx">
        <div className="el-flx">
          <IconWrapper name="BiComment" />
          <IconWrapper name="RiAttachment2" />
          <div className={`due-badge due-badge--${dueStatus} el-flx`}>
            <IconWrapper name={(task.isCompleted || !isOverDue) ? 'FiCalendar' : 'PiLightning'} />
            <span>{task.displayDate}</span>
          </div>
        </div>
      </div>
    </div>)
})


const KanbanDroppable = memo(({ column, hasTasks }: KanbanParams) =>
{

  return (
    <Droppable droppableId={String(column.columnID)}>
      {(provided, snapshot) => (
        <div
          className="el-flx tasks-board--wrapper"
          ref={provided.innerRef}
          {...provided.droppableProps}>

          {!hasTasks ? <>{!snapshot.isDraggingOver && <TasksEmpty />}</> :
            <>
              {column.tasks.map((task, index) => (
                <Draggable
                  key={task.taskID}
                  draggableId={String(task.taskID)}
                  index={index}>
                  {(provided, snapshot) => (

                    <div className="tasks-card--bg"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        minHeight: snapshot.isDragging ? 175 : 'fit-content',
                        background: snapshot.isDragging ? "var(--secondary-blue)" : "transparent",
                        border: snapshot.isDragging ? "1px dashed var(--primary-blue)" :
                          "1px dashed transparent"
                      }}
                    >
                      <TaskCardBoard task={task} style={{
                        boxShadow: snapshot.isDragging
                          ? "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
                          : "var(--card-shadow)", ...provided.draggableProps.style
                      }} />
                    </div>
                  )}
                </Draggable>
              ))
              }
            </>
          }
          {snapshot.isDraggingOver &&
            <div className="el-flx" style={{
              alignItems: 'center',
              width: '100%', height: 185,
              border: '4px dotted var(--border-color)',
              borderRadius: '1em'
            }}>
              <span style={{
                display: 'block', color: 'var(--text-muted)',
                margin: 'auto'
              }}>Move here</span>
            </div>}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
})


function TaskBoard({ tasks, isMobile, openForm }: TaskBoardParams)
{
  const { username } = useParams<{ username: string }>();

  const [boardData, setBoardData] = useState<KanbanColumn[]>(() => tasks);
  const [, startTransition] = useTransition();

  const columnRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const scrollToColumn = (columnId: number) =>
  {
    const targetElement = columnRefs.current[columnId];
    if (targetElement)
    {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: 'nearest',
        inline: 'center',
      });
    }
  };



  const handleDragEnd = (result: DropResult) =>
  {
    const { source, destination, draggableId } = result;

    // Dropped outside a valid droppable area
    if (!destination) return;

    // Dropped in the exact same spot it started
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
    {
      return;
    }

    const taskId = parseInt(draggableId);
    const sourceColId = parseInt(source.droppableId);
    const destColId = parseInt(destination.droppableId);
    const newPosition = destination.index;

    // Create a deep copy of the state for optimistic rendering
    const updatedBoard = [...boardData];

    const sourceColumn = updatedBoard.find((col) => col.columnID === sourceColId);
    const destColumn = updatedBoard.find((col) => col.columnID === destColId);

    if (!sourceColumn || !destColumn) return;

    // Remove task from the source column
    const [movedTask] = sourceColumn.tasks.splice(source.index, 1);

    // Update internal tracking fields
    movedTask.position = newPosition;

    // Add task to the destination column
    destColumn.tasks.splice(destination.index, 0, movedTask);

    // Re-index remaining positions within columns to ensure proper array mapping
    sourceColumn.tasks.forEach((task, index) => (task.position = index));
    destColumn.tasks.forEach((task, index) => (task.position = index));

    // Update local React state instantly (Smooth user interaction)
    setBoardData(updatedBoard);

    // 3. Send payload sync down to your backend reorder API
    startTransition(async () =>
    {
      try
      {
        const headers = { ...authHeader(), 'Content-Type': 'application/json' };
        const url = `${API_BASE_URL}/projects/${username ?? ''}/tasks/board/reorder`;

        const response = await fetch(url, {
          method: "PATCH",
          headers,
          body: JSON.stringify({
            taskID: taskId,
            destinationColumnId: destColId,
            newPosition: newPosition,
          }),
        });

        if (!response.ok) throw new Error("Sync failed");

      } catch (error)
      {
        console.error("Backend failed to save state, consider refreshing", error);
        // Fallback: Re-fetch original server state here if handling strict failure recovery
      }

    })
  };

  const boardColumns = isMobile ? `repeat(1, minmax(285px, 85svw))` : `repeat(${boardData.length.toString()}, minmax(285px, 1fr))`;


  return (
    <Suspense fallback={null}>
      <DragDropContext onDragEnd={handleDragEnd}>
        {isMobile && <div className="mobile-nav"
        >
          {boardData.map((column) => (
            <button
              type="button"
              key={column.columnID}
              onClick={() => { scrollToColumn(column.columnID) }}>
              {column.columnName} ({column.tasks.length})
            </button>
          ))}
        </div>}
        <div className="board-container kanban-grid-board el-grd"
          style={{
            gridTemplateColumns: boardColumns,
            WebkitOverflowScrolling: "touch",
          }}
        >
          {boardData.map((column) =>
          {
            const cls = getColumnCls(column.columnName);
            const tasksLength = column.tasks.length;
            const hasTasks = !!tasksLength;
            return (
              <div
                key={column.columnID}
                ref={(el) => { columnRefs.current[column.columnID] = el; }}
                className={`kanban-column el-flx`}>

                <div className={`el-flx column-name--wrapper ${cls}`} >
                  <span className={`status-marker`} />
                  <h3 className="column-name">{column.columnName}</h3>
                  <span className="task-count el-flx" >{column.tasks.length}</span>
                  <button
                    type={'button'}
                    onClick={() => { openForm(column.columnID) }}
                    className="add-task--btn">
                    <IconWrapper name='FaPlus' />
                  </button>
                </div>
                <KanbanDroppable
                  key={column.columnID}
                  hasTasks={hasTasks}
                  column={column} />
              </div>
            )
          }
          )
          }
        </div>

      </DragDropContext>
    </Suspense>
  )
}

KanbanDroppable.displayName = 'TaskKanbanColumn';
TaskCardBoard.displayName = 'TaskCardBoard';
export default memo(TaskBoard);