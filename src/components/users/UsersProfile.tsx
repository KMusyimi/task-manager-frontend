import { motion } from "framer-motion";
import './module/style.css';

import { lazy, memo, Suspense, useCallback, useMemo, useState } from "react";
import { useRouteLoaderData } from "react-router-dom";
import { useMediaQuery } from "../../hooks/ViewPortHooks";
import { UserResponse } from "../../models/UserModel";
import { dashboardLoader } from "../../utils/loaders";
import IconWrapper, { iconKeyTypes } from "../general/IconWrapper";
import Overlay from "../general/Overlay";
import AvatarWrapper from "../general/ProfileImg";
import Spinner, { RouterElSpinner } from "../general/Spinner";
import TabContent from "./Tab";
import UsersProfileTabs from "./UsersProfileTabs";
import { useTabNavigation } from "./hooks/tabNavigation";

export type MenuTabs = 'profile' | 'edit' | 'settings' | 'security';


export interface TabsConfigParams
{
  id: MenuTabs;
  iconName: iconKeyTypes;
  label: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const profileVariants = {
  enter: () => ({ opacity: 0, scale: 0.9, y: 20 }),
  center: () => ({ opacity: 1, scale: 1, y: 0 }),
  exit: () => ({ opacity: 0, scale: 0.9, y: 20 })
}


const TABS_CONFIG = [
  { id: 'profile', label: 'Profile', icon: 'LuUser' },
  { id: 'edit', label: 'Edit', icon: 'LuUserPen' },
  { id: 'settings', label: 'Settings', icon: 'PiGearSix' },
  { id: 'security', label: 'Security', icon: 'LuLock' }];



const ProfileUpload = lazy(() => import('./ProfileUpload'));


export interface UserOutletCtx
{
  user: UserResponse;
  isMainMenu: boolean;
  navigateTo: (menu: MenuTabs) => void;
}


interface UserProfileParams
{
  closeProfileModal: () => void;
}



function UsersProfile({ closeProfileModal }: UserProfileParams)
{
  const data = useRouteLoaderData<typeof dashboardLoader>('project-root');
  const isMobile = useMediaQuery('(max-width: 600px)');
  const user = data?.user;

  const { activeIdx, direction, navigateTo } = useTabNavigation();

  const [isViewImg, setIsViewImg] = useState(false);
  const [isModalUploadOpen, setIsModalUploadOpen] = useState(false);


  const closeImgView = useCallback(() =>
  {
    setIsViewImg(false);
  }, []);
  const closeUploadModal = useCallback(() =>
  {
    closeProfileModal();
    setIsModalUploadOpen(false);
  }, [closeProfileModal]);


  const onProfileClick = (idx: number) =>
  {
    const tab = TABS_CONFIG[idx];
    if (tab.id === 'edit')
    {
      setIsModalUploadOpen(true);
    } else
    {
      setIsViewImg(true);
    }
  }


  const metadata: TabsConfigParams[] = useMemo(() =>
    TABS_CONFIG.map((item, index) => ({
      id: item.id as MenuTabs,
      iconName: item.icon as iconKeyTypes,
      label: item.label,
      onClick: () => { navigateTo(index) }
    }))
    , [navigateTo]);

  if (!user)
  {
    return (
      <Overlay isActive={true}>
        <RouterElSpinner />
      </Overlay>)
  }

  const isModalOrViewImgOpen = isModalUploadOpen || isViewImg;
  const isTabEdit = TABS_CONFIG[activeIdx].id === 'edit';
  return (
    <>
      <Overlay
        isActive={isModalOrViewImgOpen ? false : true}
        zIndex={301}
        styles={{ alignItems: isMobile ? 'end' : 'center' }}
      >
        {
          <motion.div className="profile-menus el-flx"
            variants={profileVariants}
            initial='enter'
            animate='center'
            exit='exit'
            transition={{
              y: { type: "spring", stiffness: 350, damping: 30 },
              opacity: { duration: 0.2 },
              scale: { type: "spring", stiffness: 350, damping: 30, duration: 0.2 }
            }}
          >

            <div className="header-wrapper">
              <div className="header--top el-flx" onClick={(e) => { e.stopPropagation() }}>

                <div className="el-flx" style={{ alignItems: 'end', gap: '.75em' }}>

                  <div className="el-flx"
                    style={{ position: 'relative', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', minHeight: 70 }}
                    aria-label="button"
                    onClick={() => { onProfileClick(activeIdx) }}
                    role="button">

                    <AvatarWrapper
                      imgUrl={user.profileImgUrl}
                      version={user.avatarVersion}
                      style={{ width: '70px', height: '70px' }} />
                    {isTabEdit && <div className="edit-icon--wrapper el-flx">
                      <IconWrapper name="LuCamera" />
                    </div>}
                  </div>


                  <div className="el-flx" style={{ flexDirection: 'column', marginBottom: '.5em' }}>
                    <h4 style={{ letterSpacing: '-0.025em', fontWeight: 'bold', fontSize: '1.15rem' }}>{user.username}</h4>
                    <span style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>{user.role ?? 'Role'} {user.department ? `• ${user.department}` : '• department'}</span>
                  </div>
                </div>

                <button className="close-btn" type="button" onClick={closeProfileModal}>
                  <IconWrapper name="FaXmark" />
                </button>
              </div>


              <div className="tab-btn--wrapper el-flx">
                {metadata.map((config, idx) =>
                {
                  const isActive = idx === activeIdx;
                  return (
                    <motion.button
                      className={isActive ? 'active' : ''}
                      type="button"
                      key={config.id}
                      layout='position'
                      onClick={config.onClick}
                      style={{
                        color: isActive ? 'var(--text-color)' : '',
                        backgroundColor: isActive ? 'var(--bg-card)' : ''
                      }}>
                      <span className="el-flx" style={{ position: "relative", zIndex: 10, fontSize: '.8rem', gap: '.55em', justifyContent: 'center', alignItems: 'center' }}>
                        <IconWrapper name={config.iconName} />
                        {isActive && config.label}
                      </span>
                      {isActive && (
                        <motion.div
                          layoutId="activeTabUnderline"
                          style={{ position: 'absolute', background: 'var(--primary-blue)', height: '2px', bottom: 0, left: 0, width: '100%' }}
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <motion.div className="tab-container relative h-48 overflow-hidden mt-4 bg-zinc-900 rounded-xl p-4"
              variants={profileVariants}
              initial='enter'
              animate='center'
              exit='exit'
              transition={{
                opacity: { duration: 0.2 },
              }}
              style={{ overflow: "hidden", overflowY: 'auto', minHeight: '45svh' }}>
              <UsersProfileTabs
                activeIdx={activeIdx}
                direction={direction}>
                <TabContent activeTab={metadata[activeIdx].id} user={user} navigateTo={navigateTo} />
              </UsersProfileTabs>
            </motion.div>
          </motion.div>
        }
      </Overlay>

      {isModalOrViewImgOpen &&
        <Overlay isActive={true}
          closeOverlay={isViewImg ? closeImgView : undefined}
          zIndex={500}>
          <Suspense fallback={<Spinner />}>
            {isViewImg && <AvatarWrapper
              imgUrl={user.profileImgUrl}
              version={user.avatarVersion}
              style={{
                width: 'min(70vmin, 250px)',
                borderRadius: '50%',
                border: '5px solid var(--bg-card)'
              }} />}

            {isModalUploadOpen && <ProfileUpload user={user} closeModal={closeUploadModal} />
            }
          </Suspense>
        </Overlay>
      }
    </>
  )
}

export default memo(UsersProfile);