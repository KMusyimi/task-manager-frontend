import { CSSProperties, memo, ReactNode, useCallback, useMemo, useRef, useState } from "react";
import { Link, Outlet, useLoaderData, useSearchParams } from "react-router-dom";
import { useToastMessage } from "../../hooks/MessageHandlerHook";
import { useMediaQuery } from "../../hooks/ViewPortHooks";
import { userProfileLoader } from "../../utils/loaders";
import LogoImg from "../general/LogoImg";
import ProfileImg from "../general/ProfileImg";
import { ContextMenuProvider } from "../providers/ContextMenuProvider";
import DeleteModalProvider from "../providers/DeleteModalProvider";


import IconWrapper from "../general/IconWrapper";


const LoadProfile = () => import("../../Views/UsersView");

export interface ProjectContextType {
  username: string;
  isSidebarOpen: boolean;
  isMobile: boolean;
  closeSidebar: () => void;
}

const h1Styles: CSSProperties = { fontFamily: '"Inter", "Inter-Fallback", system-ui, Avenir, Helvetica, sans-serif' }

const HeaderContents = memo(({ children }: { children: ReactNode }) => {
  return (
    <>
      {children}
      <h1 className="desktop-only" style={h1Styles}>Your Tasks</h1>
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
        <HeaderContents>
          <Link className="profile-link"
            to={{ pathname: `${user.username}/profile`, search: search ? `?${search}` : '' }}
            onMouseEnter={onMouseEnter} >
            <ProfileImg imgUrl={user.profileImgUrl} />
          </Link>
          {isMobile &&
            <button type="button"
              className="menu-btn mobile-only"
              onClick={openSidebar}>
              <IconWrapper name='FaBarsStaggered' className="menu-icon" />
            </button>}
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