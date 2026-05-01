import { memo, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import type { MenuTypes } from "../../Views/UsersLayout";

import IconWrapper, { type iconKeyTypes } from "../general/IconWrapper";

const LoadLogout = () => import('../../Views/Logout');


interface UserProfileTypes {
  isActive: boolean;
  search: string;
  navigateTo: (menuType: MenuTypes) => void
}

interface MenuConfigTypes {
  id: MenuTypes;
  iconName: iconKeyTypes;
  menuName: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

type ProfileItemsProps = Omit<MenuConfigTypes, 'id'>;

const MENU_CONFIG = [
  { id: 'myProfile', label: 'My Profile', icon: 'FaUserPen' },
  { id: 'settings', label: 'Settings', icon: 'FaGear' },
  { id: 'changePw', label: 'Change Password', icon: 'FaLock' }
];

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

function MainProfileMenu({ isActive, search, navigateTo }: UserProfileTypes) {
  const activeCls = isActive ? 'main-menu active' : 'main-menu';

  const metadata: MenuConfigTypes[] = useMemo(() =>
    MENU_CONFIG.map(item => ({
      id: item.id as MenuTypes,
      iconName: item.icon as iconKeyTypes,
      menuName: item.label,
      onClick: () => { navigateTo(item.id as MenuTypes) }
    }))
    , [navigateTo]);

  const onMouseEnter = useCallback(() => {
    LoadLogout().catch((e: unknown) => { console.error("could not prefetch nested list ", e) })
  }, [])

  return (
    <div className={activeCls}>
      <div className={`profile-container menu-item`} >
        {metadata.map(data =>
          <ProfileButton
            key={data.id}
            iconName={data.iconName}
            menuName={data.menuName}
            onClick={data.onClick} />)}
      </div>
      <Link to={{ pathname: 'logout', search: search ? `?${search}&z-i=500` : '?z-i=500' }}
        relative='path'
        onMouseEnter={onMouseEnter}
        className={'logout--link menu-text'}>
        <IconWrapper name='FaArrowRightFromBracket' />
        <span>Logout</span>
      </Link>
    </div>
  )
}

ProfileButton.displayName = 'ProfileButton';

export default memo(MainProfileMenu);