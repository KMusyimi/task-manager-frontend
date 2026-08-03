import React, { memo, useCallback, useRef } from "react";
import { CreateSubTask } from "../../models/DashboardModel";
import IconWrapper from "../general/IconWrapper";

interface SubTasksInputParams
{
  subtasks: CreateSubTask[];
  setSubTasks: React.Dispatch<React.SetStateAction<CreateSubTask[]>>
}
const MAX_SUBTASKS = 10;

function SubTasksInput({ subtasks, setSubTasks }: SubTasksInputParams)
{
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isLimitReached = subtasks.length >= MAX_SUBTASKS;

  const onInput = useCallback((e: React.InputEvent<HTMLInputElement>, idx: number) =>
  {
    const { value } = e.currentTarget;
    setSubTasks(prev =>
    {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], title: value };
      return updated;
    });
  }, [setSubTasks]);

  const removeSubtaskField = useCallback((index: number) =>
  {

    const updatedSubtasks = subtasks.filter((_, i) => i !== index);
    setSubTasks(updatedSubtasks);

    setTimeout(() =>
    {
      const focusIndex = index > 0 ? index - 1 : 0;
      inputRefs.current[focusIndex]?.focus();
    }, 0);
  }, [setSubTasks, subtasks]);

  const addSubtaskField = useCallback((currentIndex: number) =>
  {
    if (subtasks.length >= MAX_SUBTASKS) return;

    setSubTasks(prev =>
    {
      const updated = [...prev];
      const insertAt = currentIndex + 1;

      //  Generate a stable unique key using high-precision timestamps
      const newSubtask = {
        id: `st-${window.crypto.randomUUID()}-${String(Math.random())}`,
        title: ''
      };

      updated.splice(insertAt, 0, newSubtask);
      return updated;
    });

    setTimeout(() =>
    {
      const targetIndex = currentIndex + 1;
      inputRefs.current[targetIndex]?.focus();
    }, 0);
  }, [setSubTasks, subtasks.length]);

  const onBlur = useCallback((e: React.FocusEvent<HTMLInputElement>, idx: number) =>
  {
    const { value } = e.currentTarget;
    setSubTasks(prev =>
    {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], title: value.trimEnd() };
      return updated;
    });
  }, [setSubTasks])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>, idx: number) =>
  {

    if (e.key === 'Enter')
    {
      e.preventDefault();
      if (!isLimitReached)
      {
        addSubtaskField(idx);
      }
    }

    if (e.key === 'Backspace' && subtasks[idx].title === '')
    {
      e.preventDefault();
      removeSubtaskField(idx);
    }
  }, [addSubtaskField, isLimitReached, removeSubtaskField, subtasks]);



  return (
    <div className="input-wrapper subtasks-input el-flx">
      <span>subtasks</span>
      {subtasks.map((subTask, idx) => (
        <div className="subtask-input--wrapper el-flx"
          key={subTask.id}
          style={{ width: "100%", alignItems: 'center', justifyContent: 'space-between', gap: '.5em', flexDirection: 'row', padding: '.185em .335em' }}>

          <span className="custom-square" style={{
            display: 'inline-block',
            width: '.888rem', height: '.888rem',
            border: '2px solid var(--secondary-grey)', borderRadius: '.45em'
          }}></span>


          <label htmlFor={`st-input-${String(idx)}`} style={{ flex: '1 1 auto' }}>
            <input
              ref={(el) => { inputRefs.current[idx] = el; }}
              type="text"
              id={`st-input-${String(idx)}`}
              name="title"
              className="subtask-input"
              maxLength={55}
              onClick={(e)=>{e.stopPropagation()}}
              onKeyDown={(e) => { handleKeyDown(e, idx) }}
              onBlur={(e) => { onBlur(e, idx) }}
              onInput={(e) => { onInput(e, idx) }}
              value={subTask.title}
              placeholder={`Subtask ${String(idx + 1)}`}
            />
          </label>

          <button
            className="close-btn"
            type="button"
            onClick={() => { removeSubtaskField(idx) }}
          ><IconWrapper name='FaXmark' /></button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => { addSubtaskField(subtasks.length - 1) }}
        disabled={isLimitReached}
      >
        {isLimitReached ? "Maximum subtasks reached" : "+ Add Subtask"}
      </button>
    </div>
  )
}


export default memo(SubTasksInput);