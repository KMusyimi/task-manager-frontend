import { memo, ReactNode, useCallback, useMemo, useRef } from "react";
import { Link, Outlet, useLoaderData, useLocation, useSearchParams } from "react-router-dom";
import SidebarProvider from "../providers/SidebarProvider";
import { useToastMessage } from "../../hooks/MessageHandlerHook";
import DeleteModalProvider from "../providers/DeleteModalProvider";
import LogoImg from "../general/LogoImg";
import { useMediaQuery } from "../../hooks/CustomHooks";
import { useSidebar } from "../../hooks/ProviderHooks";
import IconWrapper from "../general/IconWrapper";
import { userProfileLoader } from "../../utils/loaders";
import ProfileImg from "../general/ProfileImg";
import { ContextMenuProvider } from "../providers/ContextMenuProvider";



const LoadProfile = () => import("../../Views/UsersView");

export interface ProjectContextType {
  username: string;
  isMobile: boolean;
}

interface HeaderParams extends ProjectContextType {
  children: ReactNode;
  profileImgUrl: string;
}



const H1LogoComponents = memo(() => {
  return (
    <>
      <h1 className="desktop-only">Your Tasks</h1>
      <LogoImg />
    </>)
})


const HeaderContents = memo(({ username, isMobile, profileImgUrl, children }: HeaderParams) => {
  const location = useLocation();
  const [searchParams,] = useSearchParams();
  const hasPrefetched = useRef(false);
  const { openSidebar } = useSidebar();

  const search = useMemo(() => searchParams.toString(), [searchParams]);

  const onMouseEnter = useCallback(() => {
    if (!hasPrefetched.current) {
      LoadProfile()
        .then(() => { hasPrefetched.current = true; })
        .catch((e: unknown) => { console.error('Failed to prefetch lazy component ', e) })
    }
  }, []);

  return (
    <>
      <Link to={{ pathname: `${username}/profile`, search: search ? `?${search}` : '' }}
        className="profile-link"
        state={{ from: location.pathname + location.search }}
        onMouseEnter={onMouseEnter} >
        <ProfileImg imgUrl={profileImgUrl} />
      </Link>
      {isMobile &&
        <button type="button"
          className="menu-btn mobile-only"
          onClick={openSidebar}>
          <IconWrapper name='FaBarsStaggered' className="menu-icon" />
        </button>}
      {children}
    </>
  )
})


function ProjectLayout() {
  useToastMessage();
  const { user } = useLoaderData<typeof userProfileLoader>();
  const isMobile = useMediaQuery();

  return (
    <div className="container">
      <SidebarProvider>
        <header className="main--header">
          <HeaderContents
            isMobile={isMobile}
            profileImgUrl={user.profileImgUrl}
            username={user.username}>
            <H1LogoComponents />
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
    </div>)
}

H1LogoComponents.displayName = 'H1LogoComponents';
HeaderContents.displayName = 'HeaderContents';

export default memo(ProjectLayout);