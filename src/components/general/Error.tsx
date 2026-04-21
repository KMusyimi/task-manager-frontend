import { useRouteError } from "react-router-dom";

interface RouteError {
  status?: number;
  statusText?: string;
  message?: string;
  data?: string;
  error?: {Error: string}
}

export default function Error() {
  const err = useRouteError() as RouteError;
  console.error(err, 'error element');
  return (
    <div className="err-page">
      <h1>Oops!!!</h1>
      <p className='err-msg' aria-live='assertive'>{err.message}</p>
      {err.statusText && <pre>{err.status} - {err.statusText}</pre>}
      {err.data && <p>{err.data}</p>}
      {err.error && <p>{err.error.Error}</p>}
    </div>)
}