import { memo, ReactNode, Suspense, useCallback, useMemo, useRef, useState } from "react";
import { Link, Outlet, useLoaderData, useSearchParams } from "react-router-dom";
import { useToastMessage } from "../../hooks/MessageHandlerHook";
import DeleteModalProvider from "../providers/DeleteModalProvider";
import LogoImg from "../general/LogoImg";
import { useMediaQuery } from "../../hooks/CustomHooks";
import { userProfileLoader } from "../../utils/loaders";
import ProfileImg from "../general/ProfileImg";
import { ContextMenuProvider } from "../providers/ContextMenuProvider";
import Skeleton from "../skeleton/Skeleton";

import IconWrapper from "../general/IconWrapper";


const LoadProfile = () => import("../../Views/UsersView");

export interface ProjectContextType {
  username: string;
  isSidebarOpen: boolean;
  isMobile: boolean;
  closeSidebar: () => void;
}

type HeaderParams = Omit<ProjectContextType, 'username' | 'isSidebarOpen' | 'closeSidebar'> & {
  children: ReactNode;
  openSidebar: () => void;
}



const HeaderContents = memo(({ children, openSidebar, isMobile }: HeaderParams) => {
  return (
    <>
      {children}
      {isMobile &&
        <button type="button"
          className="menu-btn mobile-only"
          onClick={openSidebar}>
          <IconWrapper name='FaBarsStaggered' className="menu-icon" />
        </button>}
      <h1 className="desktop-only">Your Tasks</h1>
      <LogoImg />
    </>
  )
})


function ProjectLayout() {
  useToastMessage();
  const [searchParams,] = useSearchParams();
  const search = useMemo(() => searchParams.toString(), [searchParams]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openSidebar = useCallback(() => { setIsSidebarOpen(true) }, []);
  const closeSidebar = useCallback(() => { setIsSidebarOpen(false) }, []);

  const { user } = useLoaderData<typeof userProfileLoader>();
  const isMobile = useMediaQuery();

  const hasPrefetched = useRef(false);

  const onMouseEnter = useCallback(() => {
    if (!hasPrefetched.current) {
      LoadProfile()
        .then(() => { hasPrefetched.current = true; })
        .catch((e: unknown) => { console.error('Failed to prefetch lazy component ', e) })
    }
  }, []);

  const memorizedData = useMemo(() => ({
    isSidebarOpen, isMobile, closeSidebar, username: user.username
  }), [closeSidebar, isMobile, isSidebarOpen, user.username]);

  return (
    <div className="container">
      <header className="main--header">
        <HeaderContents
          isMobile={isMobile}
          openSidebar={openSidebar}>
          <Suspense fallback={<Skeleton type="box" width={50} height={50} />}>
            <Link className="profile-link"
              to={{ pathname: `${user.username}/profile`, search: search ? `?${search}` : '' }}
              onMouseEnter={onMouseEnter} >
              <ProfileImg imgUrl={user.profileImgUrl} />
            </Link>
          </Suspense>
        </HeaderContents>
      </header>

      <main className="main">
        <ContextMenuProvider>
          <DeleteModalProvider>
            <Outlet
              context={memorizedData satisfies ProjectContextType} />
          </DeleteModalProvider>
        </ContextMenuProvider>
      </main>

      {/* TODO: add a footer */}
    </div >)
}


HeaderContents.displayName = 'HeaderContents';

export default memo(ProjectLayout);