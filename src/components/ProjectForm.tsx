import React, { useCallback, useRef, useState, type FormEvent } from "react";
import { useFetcher } from "react-router-dom";
import type { ProjectFormParams } from "../entities/entity";
import { capitalize } from "../utils/utils";
import ColorPicker from "./ColorPicker";


interface FormProps {
  projectData: ProjectFormParams
}

export default function ProjectForm({ projectData }: FormProps) {
  const visuallyHiddenStyles: React.CSSProperties = { visibility: "hidden", display: "block", width: 0, height: 0 }

  const [formData, setFormData] = useState<ProjectFormParams>(() => ({ ...projectData }));

  const fetcher = useFetcher();

  const FormRef = useRef<HTMLFormElement | null>(null);

  const handleFormReset = useCallback(() => {
    if (FormRef.current) {
      FormRef.current.reset();
      setFormData({ ...projectData });
    }
  }, [projectData]);


  const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    switch (formData.intent) {
      case "add":
        handleCreateProject(e);
        break
      case "edit":
        handleEditProject();
        break;
    }

    function handleCreateProject(e: FormEvent<HTMLFormElement>) {
      fetcher
        .submit(e.currentTarget)
        .then(handleFormReset)
        .catch((error: unknown) => { console.error('Error form failed to submit: ', error) });
    }

    function handleEditProject() {
      const changeData: Record<string, string> = {}

      Object.keys(formData).forEach(item => {
        const key = item as keyof typeof formData;
        if (formData[key] !== projectData[key]) {
          changeData.intent = formData.intent;
          changeData.projectID = formData.projectID as string;
          changeData[key] = formData[key] as string;
        }
      })

      if (Object.keys(changeData).length > 0) {
        const submit_method = formData.intent === 'add' ? 'POST' : 'PUT'
        fetcher
          .submit(changeData, { method: submit_method })
          .then(handleFormReset)
          .catch((error: unknown) => { console.error('Error form failed to submit: ', error) });
      } else {
        console.log('No changes to submit.');
      }
    }

  }, [fetcher, formData, handleFormReset, projectData]);



  const handleOnInput = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, [])

  return (
    <>
      {/* TODO: use grid layout */}
      <fetcher.Form ref={FormRef} method={formData.intent === 'add' ? 'post' : 'put'} onSubmit={handleSubmit}>
        <label htmlFor="project-name" style={visuallyHiddenStyles}>Project Name</label>
        {projectData.intent === "edit" && <input type="hidden" name="projectID" value={formData.projectID} onInput={handleOnInput} />}

        <input type="hidden" name="intent" value={projectData.intent} />
        <input
          id="project-name"
          className="project-input"
          name="project_name"
          type="text"
          minLength={2}
          maxLength={20}
          placeholder="Project name..."
          onInput={handleOnInput}
          value={formData.project_name}
          required />
        <button
          type="submit"
          disabled={fetcher.state !== 'idle'}>
          {fetcher.state === 'idle' ? capitalize(projectData.intent) : 'submitting..'}
        </button>
        <ColorPicker formState={formData} handleOnInput={handleOnInput} />
      </fetcher.Form>
    </>
  )
}