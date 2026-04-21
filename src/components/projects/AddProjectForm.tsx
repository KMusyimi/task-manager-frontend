import React, { lazy, memo, Suspense, useCallback, useRef, useState, type FormEvent } from "react";
import ProjectFormComponents from "../general/ProjectForm";
import { useFetcher } from "react-router-dom";
import type { ProjectFormParams } from "../../models/entity";

import IconWrapper from "../general/IconWrapper";

const LoadSpinner = () => import("../general/Spinner");
const Spinner = lazy(LoadSpinner);


function AddProjectForm() {
  const fetcher = useFetcher();

  const [formState, setFormState] = useState<ProjectFormParams>(() => ({
    intent: 'add',
    projectName: "",
    color: "",
    payloadID: "",
    inputName: 'projectID'
  }));

  const FormRef = useRef<HTMLFormElement>(null);

  const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>, fetch: typeof fetcher) => {
    e.preventDefault();
    fetch
      .submit(e.currentTarget, { method: 'POST' })
      .then(() => {
        if (FormRef.current) {
          setFormState({
            intent: 'add',
            projectName: "",
            color: "",
            payloadID: "",
            inputName: 'projectID'
          })
          FormRef.current.reset();
        }
      })
      .catch((error: unknown) => { console.error('Error form failed to add project: ', error) });
  }, []);


  const onInput = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormState(prev => ({ ...prev, [name]: value }));
  }, [])

  const onBlur = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormState(prev => ({ ...prev, [name]: value.trimEnd() }))
  }, []);

  const onMouseEnter = useCallback(() => {
    LoadSpinner()
      .catch((e: unknown) => { console.error("could not prefetch spinner ", e) })
  }, [])

  return (
    <fetcher.Form
      ref={FormRef}
      action="."
      className={"project-form"}
      method={'post'}
      onSubmit={(e) => { handleSubmit(e, fetcher) }}>

      <ProjectFormComponents
        intent="add"
        currentColor={formState.color}
        onInput={onInput} >
        <input
          id="project-name"
          className="project-input"
          name="projectName"
          type="text"
          minLength={2}
          maxLength={20}
          placeholder="Project name..."
          onInput={onInput}
          onBlur={onBlur}
          defaultValue={formState.projectName}
          required />

        <button
          className={`submit-btn ${fetcher.state === 'submitting' ? 'submitting' : ''}`}
          onMouseEnter={onMouseEnter}
          type="submit"
          disabled={fetcher.state === 'submitting'}>
          {fetcher.state === 'idle' ?
            <IconWrapper name={'FaPlus'} /> :
            <Suspense fallback={null}>
              <Spinner />
            </Suspense>
          }
        </button>
      </ProjectFormComponents>
    </fetcher.Form>
  )
}

export default memo(AddProjectForm);