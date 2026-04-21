import { lazy, memo, type CSSProperties, type ReactNode } from "react";
import { Link } from "react-router-dom";
import type { IsMenuType } from "../../Views/UsersView";


const styles: CSSProperties = { rotate: '180deg' };
const IconWrapper = lazy(() => import("../general/IconWrapper"));


interface MenuPanelTypes {
  isMenu: IsMenuType;
  goBack: () => void;
  search: string;
  children: ReactNode;
}


function PanelWrapper({ isMenu, search, goBack, children }: MenuPanelTypes) {

  return (
    <div className="panel-wrapper" onClick={(e) => { e.stopPropagation() }}>
      {isMenu.notMain &&
        <button type="button"
          className="back-btn"
          aria-label="back"
          onClick={goBack}>
          <IconWrapper name='FaAngleRight' style={styles} />
        </button>}

      {isMenu.mainOrProfile ?
        <div className={`profile-wrapper`}>{children}</div>
        : <h1 className="menu-title">{isMenu.settings ? "Settings" : "Change Password"}</h1>
      }
      {isMenu.isMain &&
        <Link
          className="back-link"
          to={{ pathname: '..', search: search ? `?${search}` : '' }}>
          <IconWrapper className="back-icon" name="FaRegCircleXmark" />
        </Link>}
    </div>
  )
}

export default memo(PanelWrapper);