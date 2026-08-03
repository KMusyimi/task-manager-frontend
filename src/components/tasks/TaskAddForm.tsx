import React, { CSSProperties, memo, Suspense, use, useCallback, useEffect, useRef, useState } from "react";
import { useFetcher, useRouteLoaderData, useSearchParams } from "react-router-dom";
import TextareaAutosize from 'react-textarea-autosize';
import { CreateSubTask, Project, Projects, Tag } from "../../models/DashboardModel";
import { dashboardLoader } from "../../utils/loaders";
import IconWrapper from "../general/IconWrapper";
import LogoImg from "../general/LogoImg";
import Overlay from "../general/Overlay";
import { RouterElSpinner } from "../general/Spinner";
import SubTasksInput from "./SubTasksInput";
import TagsInput from "./TagsInput";
import Skeleton from "../skeleton/Skeleton";
import { motion } from "framer-motion";
import { usePopover } from "../../hooks/Popover";

const hiddenLabelStyles: CSSProperties = {
  display: 'block', opacity: 0, position: "absolute",
  visibility: 'hidden', maxWidth: 0, maxHeight: 0
}

interface TaskAddFormParams
{
  closeForm: () => void;
  defaultColumnID: number;
}

interface ProjectDropdownParams
{
  projects: Projects;
  onInput: (key: string, value: string | number) => void;

}

const getNowString = () =>
{
  const now = new Date();

  const pad = (num: number) => String(num).padStart(2, '0');

  const year = String(now.getFullYear());
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};


const PRIORITY_CONFIG = [
  { value: 1, label: "High", color: 'var(--priority-high-text)' },
  { value: 2, label: "Medium", color: 'var(--priority-medium-text)' },
  { value: 3, label: "Low", color: 'var(--priority-low-text)' }
];

const DATETIME_CONFIG = [
  { id: 'startDate', name: 'startDate', label: 'Start Date' },
  { id: 'endDate', name: 'endDate', label: 'Due Date' }
]

const popoverStyles: CSSProperties = {
  // position: "fixed",
  inset: 'auto',
  positionTryFallbacks: 'flip-block, flip-inline',
  margin: 0,
  marginBlockStart: 6,
  top: 'anchor(bottom)',
  left: 'anchor(left)',
  cursor: 'pointer',
}


const ProjectsDropDown = memo(({ projects, onInput }: ProjectDropdownParams) =>
{
  const [isOpen, setIsOpen] = useState(false);
  const [searchParam] = useSearchParams();

  const onToggle = useCallback((isOpen: boolean) => { setIsOpen(isOpen) }, []);
  const popoverRef = usePopover(onToggle);

  const projectID = searchParam.get('project_id');

  const [selectedOption, setSelectedOption] = useState<Project>(() =>
  {
    if (projectID)
    {
      const filteredProject = projects.filter(project => project.projectID === Number(projectID));
      if (filteredProject.length > 0)
      {
        const project = filteredProject[0]
        return project;
      }
    }
    const project = projects[0];

    return project;
  })


  useEffect(() =>
  {
    onInput('projectID', selectedOption.projectID)
  }, [onInput, selectedOption.projectID])



  const handleOptionClick = useCallback((e: React.MouseEvent, project: Project) =>
  {
    e.stopPropagation();
    setSelectedOption(project);
    onInput('projectID', project.projectID)
  }, [onInput])

  const targetID = 'project-dropdown';
  const anchorName = `--project-btn`;

  return (
    <div className="dropdown-options">
      <button className="dropdown-btn el-flx" type="button"
        aria-haspopup="listbox"
        popoverTarget={targetID}
        aria-expanded={isOpen}
        style={{ anchorName }}>
        <span>{selectedOption.projectName}</span>
        <IconWrapper name={isOpen ? 'FiChevronUp' : 'FiChevronDown'} />
      </button>

      <div
        id={targetID}
        ref={popoverRef}
        className="dropdown-options--li"
        popover='auto'
        onClick={(e) => { e.stopPropagation() }}
        style={{ ...popoverStyles, positionAnchor: anchorName }}
        role="listbox">
        {projects.map((project) => <div key={project.projectID}
          className={`dropdown-item ${selectedOption.projectID === project.projectID ? 'selected el-flx' : ''}`}
          role="option"
          aria-selected={selectedOption.projectID === project.projectID}
          onClick={(e) => { handleOptionClick(e, project) }}
        >
          {project.projectName}
        </div>)}
      </div>
    </div>

  )
})



const PriorityDropdown = memo(({ onInput }: { onInput: (key: string, value: string | number) => void }) =>
{
  const defaultPriority = PRIORITY_CONFIG.filter(config => config.value === 3);

  const [selectedOption, setSelectedOption] = useState(() => defaultPriority[0]);

  const [isOpen, setIsOpen] = useState(false);

  const onToggle = useCallback((isOpen: boolean) => { setIsOpen(isOpen) }, []);
  const popoverRef = usePopover(onToggle);

  useEffect(() =>
  {
    onInput('priorityID', String(selectedOption.value));
  }, [onInput, selectedOption.value]);

  const handleOptionClick = useCallback((e: React.MouseEvent, priority: {
    value: number;
    label: string;
    color: string;
  }) =>
  {
    e.stopPropagation();
    setSelectedOption(priority);

    onInput('priorityID', priority.value)
  }, [onInput])

  const targetID = 'priority-dropdown';
  const anchorName = `--priority-btn`;

  return (
    <div className="dropdown-options">

      <button
        type="button"
        className="dropdown-btn pill el-flx"
        aria-haspopup="listbox"
        popoverTarget={targetID}
        aria-expanded={isOpen}
        style={{ anchorName, justifyContent: 'space-between', minWidth: 65 }}>
        <div
          className="el-flx"
          style={{ color: selectedOption.color, alignItems: 'center', gap: '.5em' }}>
          <span className="badge-marker status-marker" style={{ backgroundColor: selectedOption.color }}></span>
          <span >{selectedOption.label}</span>
        </div>
        <IconWrapper name={isOpen ? 'FiChevronUp' : 'FiChevronDown'} />
      </button>


      <div
        id={targetID}
        ref={popoverRef}
        className="dropdown-options--li"
        popover='auto'
        onClick={(e) => { e.stopPropagation() }}
        style={{ ...popoverStyles, positionAnchor: anchorName }}
        role="listbox">

        {PRIORITY_CONFIG.map(priority => <div key={priority.value}
          className={`dropdown-item 
            ${selectedOption.value === priority.value ? 'selected el-flx' : ''}`}
          role="option"
          aria-selected={selectedOption.value === priority.value}
          style={{ color: priority.color }}
          onClick={(e) => { handleOptionClick(e, priority) }}
        >
          <span className="badge-marker status-marker" style={{ backgroundColor: priority.color, marginRight: '.5em' }}></span>
          <span>{priority.label}</span>
        </div>
        )}
      </div>
    </div>
  )
})


function TaskAddFormModal({ closeForm, defaultColumnID }: TaskAddFormParams)
{
  const fetcher = useFetcher();
  const data = useRouteLoaderData<typeof dashboardLoader>('project-root');
  const [searchParams] = useSearchParams();
  const datetimeRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const view = searchParams.get('view') ?? 'list';
  const search = searchParams.toString();

  const formVariants = {
    enter: () => ({ opacity: 0, scale: 0.9, y: 20 }),
    center: () => ({ opacity: 1, scale: 1, y: 0 }),
    exit: () => ({ opacity: 0, scale: 0.9, y: 20 })
  }



  const [displayDates, setDisplayDate] = useState<Record<string, string>>({ 'startDate': 'Start date', 'endDate': 'Due date' });

  const [tasksTags, setTasksTags] = useState<Tag[]>(() => []);
  const [subTasksForTask, setSubTasksForTask] = useState<CreateSubTask[]>(() => [])

  const projectPromise = data?.projectsPromise;
  const user = data?.user;

  const [formState, setFormState] = useState({
    projectID: 0, title: '', description: '', priorityID: 1, columnID: defaultColumnID, startDate: '', endDate: ''
  })


  const onDropdownInput = useCallback((key: string, value: string | number) =>
  {
    setFormState((prev) => ({ ...prev, [key]: value }));
  }, [])

  const onInput = useCallback((e: React.InputEvent<HTMLInputElement | HTMLTextAreaElement>) =>
  {
    const { name, value } = e.currentTarget;
    if (name === 'startDate' || name === 'endDate')
    {
      const dateObj = new Date(value);

      const formattedDate = dateObj.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: false
      });
      setDisplayDate(prev => ({ ...prev, [name]: formattedDate }));

    }
    setFormState((prev) => ({ ...prev, [name]: value }));
  }, [])

  const onBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
  {
    const { name, value } = e.currentTarget;
    setFormState((prev) => ({ ...prev, [name]: value.trimEnd() }));
  }, [])

  const togglePicker = (id: string) =>
  {
    const targetInput = datetimeRefs.current[id];
    if (targetInput)
    {
      try
      {
        targetInput.showPicker();
      } catch (error)
      {
        console.error('Failed to focus datetime', error)
        targetInput.focus();
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-deprecated
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) =>
  {
    e.preventDefault();

    const rawStartDate = formState.startDate;
    const rawEndDate = formState.endDate;

    const payload = {
      ...formState,
      description: formState.description || null,
      start_date: rawStartDate && rawStartDate !== "" ? rawStartDate : null,
      end_date: rawEndDate && rawEndDate !== "" ? rawEndDate : null,

      tags: JSON.stringify(tasksTags),
      subtasks: JSON.stringify(subTasksForTask
        .filter(st => st.title.trim() !== "")
        .map(st => ({ title: st.title.trim() })))

    }
    fetcher.submit(payload, {
      method: 'POST',
      action: `/projects/${user?.username ?? ''}/tasks?${search}`
    }).catch((e: unknown) => { console.log("Failed to submit task", e) })
  }


  if (!projectPromise || !user)
  {
    return (
      <Overlay isActive={true}>
        <RouterElSpinner />
      </Overlay>)
  }

  const projects = use(projectPromise);


  const isSubmitting = fetcher.state === 'submitting';


  return (
    <Overlay isActive={true} zIndex={400} closeOverlay={closeForm}>
      <motion.div
        className="form-container--tasks el-flx"
        variants={formVariants}
        initial='enter'
        animate='center'
        exit={'exit'}
        transition={{
          y: { type: "spring", stiffness: 350, damping: 30 },
          opacity: { duration: 0.2 },
          scale: { type: "spring", stiffness: 350, damping: 30, duration: 0.2 }
        }}
      >
        <fetcher.Form className="create-task--form el-flx"
          action={`/projects/${user.username}/tasks?view=${view}`}
          method="post"
          onSubmit={onSubmit}
        >


          <div className="form-header el-flx">
            <LogoImg />
            <Suspense fallback={<Skeleton type="box" width={100} height={20} />}>
              <ProjectsDropDown projects={projects} onInput={onDropdownInput} />
            </Suspense>
            <button className="close-btn" type="button" onClick={closeForm}><IconWrapper name='FaXmark' /></button>
          </div>


          <div className="form-body">
            <div className="input-wrapper">
              <label htmlFor="title" style={hiddenLabelStyles}>Title</label>
              <input type="text"
                name="title"
                id="title"
                onInput={onInput}
                onBlur={onBlur}
                value={formState.title}
                placeholder="Task title"
                minLength={4}
                maxLength={35} required />
            </div>

            <div className="input-wrapper">
              <label htmlFor="description" style={hiddenLabelStyles}>Description</label>
              <div className="description-wrapper el-grd">
                <TextareaAutosize
                  id="description"
                  name="description"
                  minRows={2}
                  onInput={onInput}
                  onBlur={onBlur}
                  placeholder="Add a description..."
                  value={formState.description}
                />
              </div>
            </div>
            <div className="input-container el-flx">
              <PriorityDropdown onInput={onDropdownInput} />

              {DATETIME_CONFIG.map((config, idx) =>
              {
                const now = getNowString();

                const startVal = formState.startDate ? formState.startDate : '';
                const dueDateMin = startVal || now;

                const isEndDate = config.name === 'endDate';
                const isStartDate = config.name === 'startDate';

                const inputMin = isEndDate ? dueDateMin : now;
                const inputValue = isStartDate ? formState.startDate : formState.endDate;
                const isDisabled = isEndDate ? !startVal : false;

                return (
                  <label
                    key={`${config.id}-${String(idx)}`}
                    className="datetime-label"
                    htmlFor={config.id}
                  >
                    <input
                      ref={(el) => { datetimeRefs.current[config.id] = el; }}
                      type="datetime-local"
                      name={config.name}
                      id={config.id}
                      min={inputMin}
                      value={inputValue}
                      disabled={isDisabled}
                      onInput={onInput}
                      className="sr-only"
                    />


                    <div
                      role="button"
                      tabIndex={isDisabled ? -1 : 0}
                      onClick={() =>
                      {
                        if (isDisabled) return;
                        togglePicker(config.id);
                      }}
                      className={`pill el-flx`} style={{ opacity: isDisabled ? .5 : 1, cursor: isDisabled ? 'not-allowed' : 'pointer' }}
                    >
                      <IconWrapper name="FiCalendar" />
                      <span>{displayDates[config.id] || config.label}</span>
                    </div>
                  </label>
                );
              })}
            </div>
            <TagsInput tags={tasksTags} setTags={setTasksTags} />
            <SubTasksInput setSubTasks={setSubTasksForTask} subtasks={subTasksForTask} />

          </div>
          <div className="form-footer el-flx" style={{ justifyContent: 'space-between' }}>
            <span className="el-flx"><kbd>↵</kbd> to add subtask</span>
            <div className="btn-wrapper el-flx">
              <button type="button" onClick={closeForm}>Cancel</button>
              <button type="submit" disabled={isSubmitting || formState.title === ""}>{isSubmitting ? 'Creating...' : 'Create task'}</button>
            </div>
          </div>
        </fetcher.Form>
      </motion.div >
    </Overlay >)
}

ProjectsDropDown.displayName = 'ProjectsDropDown';
PriorityDropdown.displayName = 'PriorityDropdown';
export default memo(TaskAddFormModal);
