import { CSSProperties, useCallback } from "react";
import { Link } from "react-router-dom";

const gifStyles: CSSProperties = { width: '100%', maxWidth: '500px', borderRadius: '8px' }

export default function NotFound() {
  const handleBack = useCallback(() => {
    // If there's history, go back; otherwise, send them home
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  }, []);

  return (
    <div className='container not-found-container'>
      <section className='sect-width not-found' aria-labelledby="error-title">
        <div>
          <img
            src={`${import.meta.env.BASE_URL}images/404-not-found.gif`}
            alt="That was user error"
            style={gifStyles}
          />
        </div>
        <h1 className='fw-700'>Sorry, the page you were looking for was not found.</h1>
        <div className="actions">
          <button
            type="button"
            className="btn-primary"
            onClick={handleBack}
          >
            Go Back
          </button>

          {/* Adding a Home link is a standard "Safety Net" for 404s */}
          <Link className='fw-700' to={'/'}>Return home</Link>
        </div>
      </section>
    </div>
  );
}