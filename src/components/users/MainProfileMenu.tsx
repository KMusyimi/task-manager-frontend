import { memo, useCallback } from "react";
import { Link } from "react-router-dom";
import type { MenuTypes } from "../../Views/UsersView";

import IconWrapper, { type iconKeyTypes } from "../general/IconWrapper";

const LoadLogout = () => import('../../Views/Logout');


interface UserProfileTypes {
  isActive: boolean;
  moveOverlayForward: () => void
  navigateTo: (menuType: MenuTypes) => void
}

interface ProfileItemsProps {
  iconName: iconKeyTypes;
  menuName: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}


const ProfileButton = memo(({ onClick, iconName, menuName }: ProfileItemsProps) => {
  return (
    <button type="button" className='menu-btn' onClick={onClick} >
      <span className={'menu-text'}>
        <IconWrapper name={iconName} />
        <span className="item-name">{menuName}</span>
      </span>
      <IconWrapper name='FaAngleRight' className="right-icon" />
    </button>
  )
})

function MainProfileMenu({ isActive, moveOverlayForward, navigateTo }: UserProfileTypes) {
  const activeCls = isActive ? 'main-menu active' : 'main-menu';

  const onMouseEnter = useCallback(() => {
    LoadLogout().catch((e: unknown) => { console.error("could not prefetch nested list ", e) })
  }, [])

  return (
    <div className={activeCls}>
      <div className={`profile-container menu-item`} >
        
        <ProfileButton
          iconName={"FaUserPen"}
          menuName={"My Profile"}
          onClick={() => { navigateTo('myProfile') }} />

        <ProfileButton
          iconName={"FaGear"}
          menuName={"Settings"}
          onClick={() => { navigateTo('settings') }} />

        <ProfileButton
          iconName={"FaLock"}
          menuName={"Change Password"}
          onClick={() => { navigateTo('changePw') }} />
      </div>
      <Link to={'logout'} relative='path'
        onClick={moveOverlayForward}
        onMouseEnter={onMouseEnter}
        className={'logout--link menu-text'}>
        <IconWrapper name='FaArrowRightFromBracket' />
        <span>Logout</span>
      </Link>
    </div>
  )
}

export default memo(MainProfileMenu);