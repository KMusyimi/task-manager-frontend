import { CSSProperties, lazy, memo, ReactNode, Suspense, useCallback, useMemo, useRef, useState } from "react";
import { Link, Outlet, useLoaderData, useSearchParams } from "react-router-dom";
import LogoImg from "../components/general/LogoImg";
import ProfileImg from "../components/general/ProfileImg";
import { ContextMenuProvider } from "../components/providers/ContextMenuProvider";
import DeleteModalProvider from "../components/providers/DeleteModalProvider";
import { useToastMessage } from "../hooks/MessageHandlerHook";
import { useMediaQuery } from "../hooks/ViewPortHooks";
import { userProfileLoader } from "../utils/loaders";


import DashboardSkeleton from "../components/skeleton/DashboardSkeleton";
const IconWrapper = lazy(() => import("../components/general/IconWrapper"));


const LoadProfile = () => import("./UsersLayout");

const h1Styles: CSSProperties = { fontFamily: '"Inter", "Inter-Fallback"' }

export interface ProjectContextType {
  isMobileSidebarOpen: boolean;
  username: string;
  isMobile: boolean;
  closeSidebar: () => void;
}


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
  const isMobileSidebarOpen = isMobile && isSidebarOpen;

  const memorizedData = useMemo(() => ({
    isMobileSidebarOpen, isMobile, closeSidebar, username: user.username
  }), [closeSidebar, isMobile, isMobileSidebarOpen, user.username]);

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
            <Suspense fallback={<DashboardSkeleton />}>
              <Outlet
                context={memorizedData satisfies ProjectContextType} />
            </Suspense>
          </DeleteModalProvider>
        </ContextMenuProvider>
      </main>

      {/* TODO: add a footer */}
    </div >)
}


HeaderContents.displayName = 'HeaderContents';

export default memo(ProjectLayout);