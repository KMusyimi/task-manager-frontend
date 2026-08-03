import { lazy, memo, Suspense, useCallback, useState, type ReactNode } from "react";
import { FaRegCircleCheck } from 'react-icons/fa6';
import { NavLink, useRouteLoaderData, useSearchParams } from "react-router-dom";

import IconWrapper from "../general/IconWrapper";

import LogoImg from "../general/LogoImg";


import useDeleteModal, { useContextMenu } from "../../hooks/ProviderHooks";
import { useMediaQuery } from "../../hooks/ViewPortHooks";
import { dashboardLoader } from "../../utils/loaders";
import Overlay from "../general/Overlay";
import AvatarWrapper from "../general/ProfileImg";
import Spinner from "../general/Spinner";
const Logout = lazy(() => import("../modals/Logout"));


const ProjectFormContainer = lazy(() => import("./ProjectsFormContainer"));
const LoadContextMenu = () => import("../projects/ProjectContextMenu");
const DeleteModal = lazy(() => import("../modals/DeleteModal"));
const ProjectContextMenu = lazy(LoadContextMenu);


const activeCls = ({ isActive }: { isActive: boolean }) => (isActive ? 'link-name active' : 'link-name');

interface SideBarParamsType
{
  pCount: number;
  closeSidebar: () => void;
  displayProfile: ()=> void;
  isMobileSidebarOpen: boolean;
  children: ReactNode;
}



const ProjectNav = memo(({ count, }: { count: number }) =>
{
  const [searchParams] = useSearchParams();

  const viewFilter = searchParams.get('view') ?? 'list';


  return (
    <nav className={'projects-nav'} aria-label="Main Navigation">
      <ul className="nav-list">
        <li className={'nav-list-items'}>
          <div className='items-container list-items--grid'>
            <span className="color-placeholder"></span>
            <NavLink
              className={activeCls}
              to={`?view=${viewFilter}`}
              relative="path"
              end>
              <span className="project-name">Dashboard</span>
              <span > &#40;{count}&#41; </span>
            </NavLink>
          </div>
        </li>

        <li className="nav-list-items">
          <div className='items-container list-items--grid'>
            <i className="icon"><FaRegCircleCheck /></i>
            <NavLink
              to={'completed'}
              className={activeCls}>Completed</NavLink>
          </div>
        </li>
      </ul>
    </nav>)
})


// TODO: change layout and add custom hooks
function SidebarWrapper({ pCount, isMobileSidebarOpen,displayProfile, closeSidebar, children }: SideBarParamsType)
{
  const data = useRouteLoaderData<typeof dashboardLoader>('project-root');
  const isMobile = useMediaQuery('(max-width: 1023px)');
  const [formIntent, setFormIntent] = useState<'add' | 'edit'>('add');
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const user = data?.user;
  const { isMenuOpen, closeMenu } = useContextMenu();
  const { openModal } = useDeleteModal();

  const [openForm, setOpenForm] = useState(false);

  const isMenuOrFormOrModalOpen = isMenuOpen || openForm || openModal || isLogoutOpen;

  const displayForm = useCallback((intent: 'add' | 'edit') =>
  {
    setFormIntent(intent);
    setOpenForm(true)
  }, []);

  const closeLogout = useCallback(() =>
  {
    setIsLogoutOpen(false);
  }, [])

  const closeForm = useCallback(() => { setOpenForm(false) }, []);
  if (!user)
  {
    return null;
  }

  return (
    <>
      <header className="sidebar-header">
        <div className="logo-wrapper">
          <LogoImg />
          <h1>Tasker</h1>
        </div>
        {isMobile && <button
          type="button"
          className="close-menu-btn"
          onClick={closeSidebar}>
          <IconWrapper name='FaXmark' className="close-icon" />
        </button>}
      </header>

      <div className="sidebar-main">
        <ProjectNav count={pCount} />
        <div className="projects-container">
          <button
            className="add-project--btn el-flx"
            onClick={() => { displayForm('add') }}
            type="button">Project
            <IconWrapper name="FaPlus" />
          </button>

          <div className={'dropdown-panel'}>
            {children}
          </div>
        </div>
      </div>

      <div className="sidebar-footer" style={{ justifySelf: "end" }}>
        <div className="profile-details--wrapper el-flx"
          aria-label="button"
          aria-description="User profile button"
          onClick={displayProfile}
          role={'button'}>
          <AvatarWrapper imgUrl={user.profileImgUrl} version={user.avatarVersion} style={{ width: '50px', height: '50px' }} />
          <div className="profile-details el-flx">
            <span className="username">{user.username}</span>
            <span className="email">{user.email}</span>
          </div>
        </div>
        <button
          className="logout-btn el-flx"
          onClick={() => { setIsLogoutOpen(true) }}
          type="button">
          <IconWrapper name="FaArrowRightFromBracket" />
          Log out</button>
      </div>

      {isMenuOrFormOrModalOpen ? (
        <Overlay
          isActive={true}
          zIndex={201}
          closeOverlay={openForm ? closeForm : closeMenu}>
          <Suspense fallback={<Spinner />}>
            {openModal && <DeleteModal />}
            {isMenuOpen && <ProjectContextMenu
              displayForm={displayForm} />}
            {isLogoutOpen && <Logout closeLogout={closeLogout} username={user.username} />}
            {openForm &&
              <ProjectFormContainer
                username={user.username}
                intent={formIntent}
                closeEditForm={closeForm} />}
          </Suspense>
        </Overlay>)
        : (isMobileSidebarOpen && (<Overlay isActive={true} closeOverlay={closeSidebar} />)
        )}
    </>
  )
}

ProjectNav.displayName = 'ProjectNav';

export default memo(SidebarWrapper)