import { AnimatePresence, motion } from 'framer-motion';
import { lazy, memo, useCallback, useMemo, useState, useTransition } from "react";
import { Link, Outlet, useRouteLoaderData, useSearchParams } from "react-router-dom";

import ProfileImg, { ProfileImgView } from "../components/general/ProfileImg";
import PanelWrapper from "../components/users/MenuPanelWrapper";

import Overlay from "../components/general/Overlay";
import Spinner from '../components/general/Spinner';
import MainProfileMenu from "../components/users/MainProfileMenu";
import SubMenu from "../components/users/SubMenu";
import { userProfileLoader } from '../utils/loaders';
import { UserResponse } from '../models/UserModel';

export type MenuTypes = 'mainMenu' | 'settings' | 'myProfile' | 'changePw';

const IconWrapper = lazy(() => import("../components/general/IconWrapper"));


export interface IsMenuType {
  changePwOrProfile: boolean;
  isMain: boolean;
  mainOrProfile: boolean;
  editProfile: boolean;
  notMain: boolean;
  settings: boolean;
}


interface credsTypes {
  user: UserResponse;
  isMainMenu: boolean;
  search: string;
  displayImgView?: (e: React.MouseEvent) => void;
}


const ProfileContent = memo(({ isMainMenu, search, user }: credsTypes) => {
  const [isViewImg, setIsViewImg] = useState(false);

  const closeImgView = useCallback(() => {
    setIsViewImg(false);
  }, [])
  const displayImgView = useCallback(() => {
    setIsViewImg(true);
  }, [])

  const cls = !isMainMenu ? `img-wrapper edit` : `img-wrapper`;

  return (
    <>
      <div className={cls} onClick={isMainMenu ? displayImgView : undefined}>
        <ProfileImg imgUrl={user.profileImgUrl} />
        {!isMainMenu &&
          <div className="link-wrapper"
            onClick={(e) => { e.stopPropagation() }}>
            <Link className="edit-profile--link"
              to={{ pathname: 'upload', search: search ? `?${search}&z-i=500` : '' }}
            >
              <IconWrapper className="edit-icon" name='FaPenToSquare' />
            </Link>
          </div>}
      </div>
      <div className="details-wrapper">
        <p className="username">@{user.username}</p>
        <p className="user-email">{user.email || 'youexample.email.com'}</p>
      </div>

      {isViewImg && <ProfileImgView
        isViewImg={true}
        closeImgView={closeImgView}
        imgUrl={user.profileImgUrl} />}
    </>
  )
})

function UsersView() {
  const data = useRouteLoaderData<typeof userProfileLoader>('project-root');
  const user = data?.user;
  const [searchParams, setSearchParams] = useSearchParams();
  const [isPending, startTransition] = useTransition();
  // 1 for forward, -1 for back
  const [direction, setDirection] = useState(1);


  const { zIndex, activeMenu, search } = useMemo(() => (
    {
      zIndex: (searchParams.get('z-i') ?? 300) as number,
      activeMenu: (searchParams.get('u-m') ?? 'mainMenu') as MenuTypes,
      search: searchParams.toString()
    }), [searchParams]);

  const navigateTo = useCallback((menu: MenuTypes) => {
    // u-m stands for user menu
    setDirection(1);
    startTransition(() => {
      setSearchParams((prev) => {
        const nextParams = new URLSearchParams(prev);
        nextParams.set('u-m', menu);
        return nextParams;
      });
    })
  }, [setSearchParams])


  const goBack = useCallback(() => {
    setDirection(-1);
    startTransition(() => {
      setSearchParams((prev) => {
        const nextParams = new URLSearchParams(prev);
        nextParams.delete('u-m');
        return nextParams;
      });
    }
    )
  }, [setSearchParams]);

  const isMenu: IsMenuType = useMemo(() => {
    const isMain = activeMenu === 'mainMenu';
    const isProfile = activeMenu === 'myProfile';
    const isSettings = activeMenu === 'settings';
    const isChangePw = activeMenu === 'changePw';

    return {
      isMain,
      mainOrProfile: isMain || isProfile,
      editProfile: isProfile,
      notMain: !isMain,
      changePwOrProfile: isChangePw || isProfile,
      settings: isSettings
    };
  }, [activeMenu]);

  const expandCls = isMenu.changePwOrProfile ? 'expand' : '';

  if (!user) {
    return (
      <Overlay isActive={true} zIndex={300}>
        <Spinner />
      </Overlay>)
  }

  return (
    <>
      <div className={`user-profile--container ${expandCls}`}>
        <div className={'menu-panel'}>
          <div className="menu-panel--top">
            <PanelWrapper isMenu={isMenu} search={search} goBack={goBack}>
              <ProfileContent
                user={user}
                isMainMenu={isMenu.isMain}
                search={search} />
            </PanelWrapper>
          </div>

          <AnimatePresence mode='wait' custom={direction}>
            <motion.div
              key={activeMenu} // Key triggers the exit/entry
              custom={direction}
              initial={{ x: direction > 0 ? '100%' : '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction > 0 ? '-100%' : '100%', opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              layout // Smoothly handles height changes between menus
              style={{ filter: isPending ? 'blur(1px)' : 'none', opacity: isPending ? 0.8 : 1 }}
              className="menu-wrapper">
              {isMenu.isMain ?
                <MainProfileMenu
                  isActive={isMenu.isMain}
                  search={search}
                  navigateTo={navigateTo} />
                :
                <SubMenu activeMenu={activeMenu} user={user} />
              }
            </motion.div>
          </AnimatePresence>
        </div>
      </div >
      <Overlay isActive={true} zIndex={zIndex}><Outlet /> </Overlay>
    </>)

}


ProfileContent.displayName = 'ProfileContent';

export default memo(UsersView);