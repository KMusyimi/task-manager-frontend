import { useRouteError } from "react-router-dom";

interface RouteError {
  status?: number;
  statusText?: string;
  message?: string;
}

export default function Error() {
  const err = useRouteError() as RouteError;
  return (
    <div className="err-page">
      <h1>Oops!!!</h1>
      <p className='err-msg' aria-live='assertive'>{err.message}</p>
      {err.statusText && <pre>{err.status} - {err.statusText}</pre>}
    </div>)
}