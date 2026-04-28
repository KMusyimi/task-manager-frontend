import { useCallback } from "react";
import { useFetcher } from "react-router-dom";
import useDeleteModal from "../../hooks/ProviderHooks";
import type { ActionFuncError } from "../../models/entity";

import useActionError from "../../hooks/ActionErrorHook";
import IconWrapper from "../general/IconWrapper";
import Modal from "./Modal";



export default function DeleteModal() {
  const fetcher = useFetcher();
  const { closeModal, payload } = useDeleteModal();

  useActionError(fetcher.data as ActionFuncError);


  const handleSubmit = useCallback((e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    fetcher
      .submit(form)
      .then(() => { form.reset(); closeModal(); })
      .catch((error: unknown) => { console.error('Error form failed to submit: ', error) });
  }, [closeModal, fetcher]);


  return (
    <Modal
      isOpen={true}
      handleOnClose={closeModal}>
      <IconWrapper name="FaTriangleExclamation" style={{ color: '#EC3E37' }} />
      <h1>Are you sure?</h1>
      <p>
        Are you sure you want to delete <span className="text-bold">{payload.name}?</span> This action cannot be undone.
      </p>
      <fetcher.Form className="delete-project--form" method="post" onSubmit={handleSubmit}>

        <input type="hidden" name={payload.inputName} defaultValue={payload.payloadID} />
        <input type="hidden" name="intent" value={'delete'} />
        <div className="modal--grid">
          <button type="button" onClick={closeModal}>No, thanks</button>
          <button className="submit-btn" type="submit" disabled={fetcher.state !== 'idle'}><b>{fetcher.state === 'idle' ? 'Yes' : 'Deleting...'}</b></button>
        </div>
      </fetcher.Form>
    </Modal>
  )
}