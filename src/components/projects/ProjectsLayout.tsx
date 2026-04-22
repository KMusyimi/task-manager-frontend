import { memo, ReactNode, Suspense, useCallback, useMemo, useRef } from "react";
import { Link, Outlet, useLoaderData, useSearchParams } from "react-router-dom";
import SidebarProvider from "../providers/SidebarProvider";
import { useToastMessage } from "../../hooks/MessageHandlerHook";
import DeleteModalProvider from "../providers/DeleteModalProvider";
import LogoImg from "../general/LogoImg";
import { useMediaQuery } from "../../hooks/CustomHooks";
import { useSidebar } from "../../hooks/ProviderHooks";
import { userProfileLoader } from "../../utils/loaders";
import ProfileImg from "../general/ProfileImg";
import { ContextMenuProvider } from "../providers/ContextMenuProvider";
import Skeleton from "../skeleton/Skeleton";

import IconWrapper from "../general/IconWrapper";


const LoadProfile = () => import("../../Views/UsersView");

export interface ProjectContextType {
  username: string;
  isMobile: boolean;
}

type HeaderParams = Omit<ProjectContextType, 'username'> & {
  children: ReactNode;
}



const HeaderContents = memo(({ children, isMobile }: HeaderParams) => {
  const { openSidebar } = useSidebar();
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

  return (
    <div className="container">
      <SidebarProvider>
        <header className="main--header">
          <HeaderContents isMobile={isMobile}>
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
                context={{ username: user.username, isMobile } satisfies ProjectContextType} />
            </DeleteModalProvider>
          </ContextMenuProvider>
        </main>
      </SidebarProvider>

      {/* TODO: add a footer */}
    </div >)
}


HeaderContents.displayName = 'HeaderContents';

export default memo(ProjectLayout);