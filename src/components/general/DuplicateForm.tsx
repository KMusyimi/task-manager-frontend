import { memo, type FormEvent } from "react";
import { useFetcher } from "react-router-dom";
import useActionError from "../../hooks/ActionErrorHook";
import type { ActionFuncError } from "../../models/entity";


interface DuplicateFormTypes {
  inputName: 'projectID' | 'taskID' | 'subTaskID';
  formPayloadID: string
  handleOnSubmit: (e: FormEvent<HTMLFormElement>) => void
}

function DuplicateForm({ inputName, formPayloadID, handleOnSubmit }: DuplicateFormTypes) {
  const fetcher = useFetcher();
   useActionError(fetcher.data as ActionFuncError);
 
  return (
    <fetcher.Form method="post" action="." onSubmit={handleOnSubmit}>
      <input type="hidden" name={inputName} value={formPayloadID} />
      <input type="hidden" name="intent" value={'duplicate'} />
      <button className="submit-btn" type='submit'>Duplicate</button>
    </fetcher.Form>)
}

export default memo(DuplicateForm);