import React, { memo, useCallback, useRef, useState } from "react";
import { useFetcher } from "react-router-dom";
import type { ProjectFormParams } from "../../models/entity";
import ProjectFormComponents from "../general/ProjectForm";



function AddProjectForm() {
  const fetcher = useFetcher({ key: 'add-pjt-key'});
  const FormRef = useRef<HTMLFormElement>(null);

  const [formState, setFormState] = useState<ProjectFormParams>(() => ({
    intent: 'add',
    projectName: "",
    color: "",
    payloadID: "",
    inputName: 'projectID'
  }));


  const handleSubmit = useCallback((e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetcher
      .submit(e.currentTarget, { method: 'POST' })
      .then(() => {
        if (FormRef.current) {
          setFormState({
            intent: 'add', projectName: "", color: "", payloadID: "", inputName: 'projectID'
          });
          FormRef.current.reset();
        }
      })
      .catch((error: unknown) => { console.error('Error form failed to add project: ', error) });
  }, [fetcher]);


  const onInput = useCallback((e: React.InputEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setFormState(prev => ({ ...prev, [name]: value }));
  }, []);

  const onBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setFormState(prev => ({ ...prev, [name]: value.trimEnd() }))
  }, []);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setFormState(prev => ({ ...prev, [name]: value }));
  }, []);

  return (
    <fetcher.Form
      ref={FormRef}
      action="."
      className={"project-form"}
      method={'post'}
      onSubmit={handleSubmit}>

      <ProjectFormComponents
        intent="add"
        currentColor={formState.color}
        onChange={onChange} >
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
      </ProjectFormComponents>
    </fetcher.Form>
  )
}

export default memo(AddProjectForm);