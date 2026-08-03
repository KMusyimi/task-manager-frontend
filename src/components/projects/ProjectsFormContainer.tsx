import React, { useCallback, useState } from "react";
import { useFetcher, useSearchParams } from "react-router-dom";
import { useContextMenu } from "../../hooks/ProviderHooks";
import type { ProjectFormParams } from "../../models/entity";

import IconWrapper from "../general/IconWrapper";
import ProjectFormComponents from "./ProjectForm";
import { capitalize } from "../../utils/utils";
import Spinner from "../general/Spinner";


interface FormParams
{
  intent: 'add' | 'edit';
  username: string;
  closeEditForm: () => void
}


export default function ProjectFormContainer({ intent, username, closeEditForm }: FormParams)
{
  const fetcher = useFetcher({ key: 'pjt-key' });
  const [searchParams] = useSearchParams();
  const search = searchParams.toString();

  const { formData } = useContextMenu();
  const [alertTxt, setAlertTxt] = useState<string | null>(null);

  const isAddProject = intent === 'add';


  const formParams: ProjectFormParams = {
    intent: 'add',
    projectName: "",
    color: "",
    payloadID: "",
    inputName: 'projectID'
  }

  const [formState, setFormState] = useState<ProjectFormParams>(() => (!isAddProject ? { ...formData, intent, inputName: 'projectID' } : formParams));


  const onInput = useCallback((e: React.InputEvent<HTMLInputElement>) =>
  {
    const { name, value } = e.currentTarget;
    setFormState(prev => ({ ...prev, [name]: value }));
  }, [])

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) =>
  {
    const { name, value } = e.currentTarget;
    setFormState(prev => ({ ...prev, [name]: value }));
  }, [])

  const onBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) =>
  {
    const { name, value } = e.currentTarget;
    setFormState(prev => ({ ...prev, [name]: value.trimEnd() }))
  }, []);


  // eslint-disable-next-line @typescript-eslint/no-deprecated
  const onSubmit = (e: React.FormEvent<HTMLFormElement>, username: string) =>
  {
    e.preventDefault();
    const action = `/projects/${username}`;

    if (formState.intent === 'add')
    {
      e.preventDefault();
      fetcher
        .submit(e.currentTarget, { method: 'POST', action })
        .catch((error: unknown) => { console.error('Error form failed to add project: ', error) });

      setFormState({ intent: 'add', projectName: "", color: "", payloadID: "", inputName: 'projectID' });

    } else
    {
      const changes = Object.entries(formState)
        .filter(([key, value]) => key in formData && value !== formData[key as keyof typeof formData] && !!value)
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value as string }), {})

      if (Object.keys(changes).length > 0 && formState.payloadID)
      {
        fetcher
          .submit({
            ...changes, intent: formState.intent, projectID: formState.payloadID
          }, { method: 'PUT', action })
          .then(() => { e.currentTarget.reset() })
          .catch((error: unknown) => { console.error('Error form failed to add project: ', error) });
      } else
      {
        setAlertTxt("No changes to submit.");
      }
    }

  };
  const isSubmitting = fetcher.state === 'submitting';
  const isDisabled = formState.color === '' || formState.projectName === '';


  return (
    <div className="project-form-container"
      onClick={(e) => { e.stopPropagation() }} >

      <div className="form-header--wrapper">
        <div className="el-flx">
          <IconWrapper name={intent === 'add' ? 'FaPlus' : 'FaPenToSquare'} />
          <h4>{capitalize(intent)} project</h4>
        </div>
        <button
          className="close-btn"
          type="button"
          onClick={closeEditForm}>
          <IconWrapper className="back-icon" name="FaXmark" /></button>
      </div>
      <fetcher.Form
        action={`/projects/${username}?${search}`}
        className={"project-form"}
        method={isAddProject ? 'post' : 'put'}
        onSubmit={(e) => { onSubmit(e, username) }}>
        <div className="form-container">

          {alertTxt && <p className="alert-text">{alertTxt}</p>}

          <label htmlFor="project-name" className="project-name--label">Project Name</label>
          <input type="hidden" name="intent" defaultValue={intent} />

          {!isAddProject && <input id={'project-id'}
            name={'projectID'}
            type="hidden"
            defaultValue={formState.payloadID} />}

          <ProjectFormComponents
            currentColor={formState.color}
            onChange={onChange}>
            <input
              id="project-name"
              className="project-input"
              name="projectName"
              type="text"
              minLength={2}
              maxLength={20}
              placeholder="Eg. Web Design..."
              onInput={onInput}
              onBlur={onBlur}
              defaultValue={formState.projectName}
              required />
            {isSubmitting && <Spinner style={{ marginBottom: 0, width: "1rem", height: '1rem' }} />}
          </ProjectFormComponents>
        </div>
        <div className="btn-wrapper el-flx">
          <button type="button" onClick={closeEditForm}>Cancel</button>
          <button
            className={`submit-btn el-flx ${isSubmitting ? 'submitting' : ''}`}
            type="submit"
            disabled={isSubmitting || isDisabled}>
            {intent === 'add' ? 'Create ' : 'Edit '}Project
          </button>
        </div>
      </fetcher.Form>
    </div>
  )
}