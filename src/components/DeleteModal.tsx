import { lazy, Suspense, use, useCallback, type FormEvent } from "react";
import { useFetcher } from "react-router-dom";
import { DeleteContext } from "./DeleteModalProvider";

const Modal = lazy(() => import("./Modal"));

export default function DeleteModal() {
  const fetcher = useFetcher();
  const { payload, handleDltPayload } = use(DeleteContext);


  const handleOnClose = useCallback(() => {
    handle();
    function handle() {
      handleDltPayload({
        id: "",
        inputName: "",
        name: "",
        isOpen: false
      })
    }
  }, [handleDltPayload]);

  const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetcher
      .submit(e.currentTarget)
      .then(handleOnClose)
      .catch((error: unknown) => { console.error('Error form failed to submit: ', error) });
  }, [fetcher, handleOnClose]);


  return (
    <Suspense fallback={<div>Loading delete modal...</div>}>
      <Modal isOpen={payload.isOpen} handleOnClose={handleOnClose}>
        <h1>Confirm deletion</h1>
        <p>
          Are you sure you want to delete {payload.name}? This action cannot be undone.
        </p>
        <fetcher.Form method="post" onSubmit={handleSubmit}>
          <input type="hidden" name={payload.inputName} defaultValue={payload.id} />
          <input type="hidden" name="intent" value={'delete'} />
          <button type="submit">Confirm</button>
        </fetcher.Form>
      </Modal>
    </Suspense>
  )
}