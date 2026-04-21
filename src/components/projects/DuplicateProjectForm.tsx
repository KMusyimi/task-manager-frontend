import { lazy, useCallback, type FormEvent } from "react";
import { useFetcher } from "react-router-dom";


const DuplicateForm = lazy(() => import("../general/DuplicateForm"));

interface DuplicateFormParams {
  payloadID: string;
  closeContextMenu: () => void;
}

export default function DuplicateProjectForm({ closeContextMenu, payloadID}: DuplicateFormParams) {
  const fetcher = useFetcher();

  // TODO: handle fetcher errors

  const handleOnSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetcher
      .submit(e.currentTarget)
      .then(closeContextMenu)
      .catch((error: unknown) => { console.error('Error form failed to submit: ', error) });
  }, [closeContextMenu, fetcher]);

  return (
    <DuplicateForm
      formPayloadID={payloadID}
      inputName={'projectID'}
      handleOnSubmit={handleOnSubmit} />
  )
}