import { lazy, Suspense, useCallback, useState, type FormEvent } from "react";
import { useFetcher } from "react-router-dom";
import { useContextMenu } from "../../hooks/ProviderHooks";
import type { ProjectFormParams } from "../../models/entity";

import IconWrapper from "../general/IconWrapper";
import ProjectFormComponents from "../general/ProjectForm";


const LoadSpinner = () => import("../general/Spinner");
const Spinner = lazy(LoadSpinner);


interface EditFormParams {
  closeEditForm: () => void
}

export default function EditProjectForm({ closeEditForm }: EditFormParams) {
  const fetcher = useFetcher();
  const { formData } = useContextMenu();
  const [alertTxt, setAlertTxt] = useState<string | null>(null);

  const [formState, setFormState] = useState<ProjectFormParams>(() => ({ ...formData, intent: 'edit', 'inputName': 'projectID' }));


  const onInput = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormState(prev => ({ ...prev, [name]: value }));
  }, [])

  const onBlur = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormState(prev => ({ ...prev, [name]: value.trimEnd() }))
  }, []);


  const onSubmit = useCallback((e: FormEvent<HTMLFormElement>, formState: ProjectFormParams, formdata: typeof formData) => {
    e.preventDefault();

    const changes = Object.entries(formState)
      .filter(([key, value]) => key in formdata && value !== formdata[key as keyof typeof formdata] && !!value)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value as string }), {})

    if (Object.keys(changes).length > 0 && formState.payloadID) {
      // TODO: form reset
      fetcher
        .submit({
          ...changes, intent: formState.intent, projectID: formState.payloadID
        }, { method: 'PUT' })
        .catch((error: unknown) => { console.error('Error form failed to add project: ', error) });
    } else {
      setAlertTxt("No changes to submit.");
    }

  }, [fetcher]);

  const onMouseEnter = useCallback(() => {
    LoadSpinner()
      .catch((e: unknown) => { console.error("could not prefetch spinner ", e) })
  }, [])

  return (
    <>
      {/* TODO: Make skeleton */}

      <div
        className="edit-form-container" onClick={(e) => { e.stopPropagation() }} >

        <div className="header-wrapper">
          <h4>Edit project</h4>
          <button
            className="close-btn"
            type="button"
            onClick={closeEditForm}>
            <IconWrapper className="back-icon" name="FaRegCircleXmark" /></button>
        </div>

        {alertTxt && <p className="alert-text">{alertTxt}</p>}
        <fetcher.Form
          action="."
          className={"project-form"}
          method={'put'}
          onSubmit={(e) => { onSubmit(e, formState, formData) }}>
          <input id={'project-id'}
            name={'projectID'}
            type="hidden"
            defaultValue={formState.payloadID} />

          <ProjectFormComponents intent="edit" currentColor={formState.color} onInput={onInput}>
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
              {fetcher.state === 'idle' ? <IconWrapper name={'FaPenToSquare'} /> :
                <Suspense fallback={null}>
                  <Spinner />
                </Suspense>
              }

            </button>
          </ProjectFormComponents>
        </fetcher.Form>
      </div>
    </>
  )
}