import { useCallback } from "react";
import { useFetcher, useParams } from "react-router-dom";
import useDeleteModal from "../../hooks/ProviderHooks";
import type { ActionFuncError } from "../../models/entity";

import useActionError from "../../hooks/ActionErrorHook";
import IconWrapper from "../general/IconWrapper";
import Modal from "./Modal";



export default function DeleteModal()
{
  const fetcher = useFetcher();
  const { username } = useParams<{ username: string }>();
  const { closeModal, payload } = useDeleteModal();

  useActionError(fetcher.data as ActionFuncError);


  const handleSubmit = useCallback((e: React.SubmitEvent<HTMLFormElement>) =>
  {
    e.preventDefault();
    const form = e.currentTarget;
    fetcher
      .submit(form)
      .then(() => { form.reset(); closeModal(); })
      .catch((error: unknown) => { console.error('Error form failed to submit: ', error) });
  }, [closeModal, fetcher]);

  const isSubmitting = fetcher.state !== 'idle';

  return (
    <Modal
      isOpen={true}>
      <header className="modal-header el-flx">
        <IconWrapper name="FaTriangleExclamation" style={{ color: 'var(--primary-red)' }} />
        <h1>Delete</h1>
        <button type="button" onClick={closeModal}>
          <IconWrapper className="back-icon" name="FaXmark" />
        </button>
      </header>
      <div className="form-wrapper">
        <p className="modal-text">
          Are you sure you want to delete <span className="text-bold">{payload.name}</span>? This action cannot be undone.
        </p>
        <fetcher.Form
          className="delete-project--form"
          action={`/projects/${username?? ''}`}
          method="post" onSubmit={handleSubmit}>

          <input type="hidden" name={payload.inputName} defaultValue={payload.payloadID} />
          <input type="hidden" name="intent" value={'delete'} />
          <div className="modal--grid">
            <button type="button" onClick={closeModal}>No, thanks</button>
            <button className="submit-btn delete-btn" type="submit" disabled={fetcher.state !== 'idle'}><b>{!isSubmitting ? 'Delete' : 'Deleting...'}</b></button>
          </div>
        </fetcher.Form>
      </div>
    </Modal>
  )
}