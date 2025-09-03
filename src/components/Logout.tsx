import { useCallback, useState, type FormEvent } from "react";
import {  useFetcher } from "react-router-dom";

interface ModalProps {
  toggleForm: () => void
}

function ConfirmLogoutModal({ toggleForm }: ModalProps) {
  const fetcher = useFetcher();
  const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    fetcher.submit(e.currentTarget).then(toggleForm);
  }, [])
  return (
    <section>
      <h1>Are you sure you want to log out?</h1>
      <fetcher.Form method="post" action="/logout" onSubmit={handleSubmit}>
        <button type="button" onClick={toggleForm}>No</button>
        <button type="submit" disabled={fetcher.state !== 'idle'}>{fetcher.state === 'idle' ? 'Yes' : 'Logging out...'}</button>
      </fetcher.Form>
    </section>)
}

export default function Logout() {
  const [toggle, setToggle] = useState(false);

  const toggleForm = useCallback(() => {
    setToggle(prev => !prev);
  }, []);

  return (
    <>
      <button type="button"
        onClick={toggleForm} disabled={toggle}>logout</button>
      {toggle && <ConfirmLogoutModal toggleForm={toggleForm} />}
    </>
  )
}