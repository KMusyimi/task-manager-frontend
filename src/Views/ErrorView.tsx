import { CSSProperties, memo } from "react";
import { useRouteError } from "react-router-dom";

interface RouteError {
  status?: number;
  statusText?: string;
  data?: unknown;
  message?: string;
  error?: {
    message?: string;
    stack?: string;
  };
}

const gifStyles: CSSProperties = { width: '100%', maxWidth: '500px', borderRadius: '8px' }


function ErrorPage() {
  const error = useRouteError() as RouteError;
  console.error(error, 'error element');

  return (
    <div className="err-page container">

      <h1>Oops!!!</h1>
      {/*TODO: Div Style */}
      <></>
      <img
        src={`${import.meta.env.BASE_URL}images/user-error.gif`}
        alt="That was user error"
        style={gifStyles}
      />
      <p className="err-msg" aria-live="assertive">{error.message ?? "Unknown error occurred."}</p>
      {error.status && <pre>{error.status} {' - '} {error.statusText}</pre>}
      <button type="button" onClick={() => { window.history.back() }}>Go Back</button>
      <button type="button" onClick={() => { window.location.reload() }}>Try Again</button>
    </div>
  )
}

export default memo(ErrorPage);