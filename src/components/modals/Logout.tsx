import React, { CSSProperties, lazy, useState } from "react";
import { Form, useFetcher } from "react-router-dom";
import useActionError from "../../hooks/ActionErrorHook";
import type { ActionFuncError } from "../../models/entity";

interface LogoutParams
{
  username: string;
  closeLogout: () => void;
}


const Modal = lazy(() => import("./Modal"));
const IconWrapper = lazy(() => import("../general/IconWrapper"));
const RED_ICON_STYLE: CSSProperties = { color: 'var(--primary-red)', flex: '0 0 auto' };

function Logout({ username, closeLogout }: LogoutParams)
{
  const fetcher = useFetcher();
  const [step, setStep] = useState(1);
  const [isValid, setIsValid] = useState(false);

  useActionError(fetcher.data as ActionFuncError);

  const onInput = (e: React.InputEvent<HTMLInputElement>) =>
  {
    const { value } = e.currentTarget;
    const escapedUsername = username.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const rgx = new RegExp(escapedUsername, 'g');
    setIsValid(rgx.test(value));
  }


  const isSubmitting = fetcher.state === 'submitting';

  return (
    <Modal isOpen={true}>
      <header className="modal-header el-flx">
        <IconWrapper name="FaArrowRightFromBracket" style={RED_ICON_STYLE} />
        <h1>Already leaving?</h1>
        <button type="button"
          onClick={closeLogout}
          className="back-btn">
          <IconWrapper className="back-icon" name="FaXmark" />
        </button>
      </header>
      <div className="form-wrapper">
        <Form replace={true} method="post" action={`/projects/${username}/profile/logout`}>
          {step === 1 &&
            <>
              <p className="modal-text">Ready to log out? We'll be here when you're ready to come back. <strong className="alert-text"
                role="button"
                aria-description="Click to logout all devices."
                style={{ cursor: 'pointer', fontWeight: '500' }}
                onClick={() => { setStep(2) }}>Click to logout all devices.</strong>
              </p>
              <div className="btn-wrapper el-flx">
                <button type="button" className="back-btn" onClick={closeLogout} disabled={isSubmitting}>No, thanks</button>
                <button type="submit" className="submit-btn logout"
                  onClick={() => { localStorage.removeItem('token') }}
                  disabled={isSubmitting}>{!isSubmitting ? 'Log out' : 'Logging out...'}</button>
              </div>
            </>
          }
          {step === 2 && <div>
            <p className="modal-text" style={{ marginBottom: '.75em', textAlign: 'left', fontWeight:"normal" }}>
              Must match <strong className="alert-text" style={{fontFamily:'var(--font-header)'}}>{username}</strong> to log out of all devices.
            </p>
            <input type="hidden" name="intent" value={'all'} />
            <label htmlFor="matchStr" className="sr-only">
              Username
            </label>
            <input type="text"
              className={`logout-input ${isValid ? 'is-valid' : 'is-invalid'}`}
              id="matchStr"
              name="matchStr"
              required
              onInput={onInput}
              style={{
                color: isValid ? 'var(--primary-green)' : 'var(--primary-red)'
              }}
              placeholder={`Type ${username} (case sensitive)..`}
            />
            <div className="btn-wrapper el-flx">
              <button type="button" onClick={() => { setStep(1) }}>Go, back</button>
              <button className="submit-btn logout" type="submit" disabled={isSubmitting || !isValid}>{!isSubmitting ? 'Log out all devices' : 'Logging out...'}</button>
            </div>
          </div>}
        </Form>
      </div>
    </Modal>
  )
}

export default Logout;