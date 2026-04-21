import { CSSProperties, lazy, Suspense } from "react";
import { Form, Link, useFetcher, useOutletContext } from "react-router-dom";
import IconWrapper from "../components/general/IconWrapper";
import useActionError from "../hooks/ActionErrorHook";
import type { ActionFuncError } from "../models/entity";
import { ProfileCtxTypes } from "./UsersView";


const Modal = lazy(() => import("../components/modals/Modal"));
const RED_ICON_STYLE: CSSProperties = { color: 'var(--primary-red)' };

function Logout() {
  const { moveOverlayBack } = useOutletContext<ProfileCtxTypes>();
  const fetcher = useFetcher();
  useActionError(fetcher.data as ActionFuncError);

  return (
    <>
      <Suspense fallback={null}>
        <Modal isOpen={true}>
          <IconWrapper name="FaArrowRightFromBracket" style={RED_ICON_STYLE} />
          <h1>Already leaving?</h1>
          <p>Ready to log out? We'll be here when you're ready to come back.</p>
          <div className={'modal--grid logout-wrapper'}>
            <Link to={fetcher.state === 'idle' ? '..' : 'javascript:void(0)'} relative="path" onClick={moveOverlayBack}>No, thanks</Link>
            <Form replace={true} method="post" action=".">
              <button className="submit-btn" type="submit" disabled={fetcher.state !== 'idle'}>{fetcher.state === 'idle' ? 'Yes' : 'Logging out...'}</button>
            </Form>
          </div>
        </Modal>
      </Suspense>
    </>
  )
}

export default Logout;