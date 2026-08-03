import '../components/tasks/module/tasks.css';

import { lazy, memo, Suspense, use, useCallback, useMemo, useRef, useState, useTransition } from "react";
import { Outlet, useLoaderData, useSearchParams } from "react-router-dom";
import LogoImg from "../components/general/LogoImg";
import SidebarWrapper from "../components/projects/ProjectsSideBar";
import { ContextMenuProvider } from "../components/providers/ContextMenuProvider";
import DeleteModalProvider from "../components/providers/DeleteModalProvider";
import { useToastMessage } from "../hooks/MessageHandlerHook";
import { useMediaQuery } from "../hooks/ViewPortHooks";
import { dashboardLoader } from "../utils/loaders";

import moment from "moment";
import Footer from "../components/general/Footer";
import IconWrapper, { iconKeyTypes, IconName } from "../components/general/IconWrapper";
import Skeleton from "../components/skeleton/Skeleton";
import Spinner from '../components/general/Spinner';
const LoadDropdownContent = () => import("../components/projects/NestedProjectsLi");
const DropdownContent = lazy(LoadDropdownContent);



const LoadProfile = () => import("../components/users/UsersProfile");
const LoadContextMenu = () => import("../components/projects/ProjectContextMenu");
const UserProfile = lazy(LoadProfile);

const skeletons = Array.from({ length: 3 });
const skeletonCards = Array.from({ length: 3 });


const now = moment();

const longFormat = now.format("DD MMMM YYYY");

export interface ProjectContextType
{
  isMobileSidebarOpen: boolean;
  isMobile: boolean;
  closeSidebar: () => void;
}

type FilterTypes = 'list' | 'board';

interface FilterContainerParams
{
  isPending: boolean;
  projectName: string;
  view: FilterTypes;
  onFilterChange: (filter: FilterTypes) => void
}

export interface DashboardCtxParams
{
  projectID: string | null;
  view: FilterTypes;
}

interface FilterParams
{
  id: number;
  iconName: iconKeyTypes;
  selected: boolean;
  filterType: FilterTypes;
  label: string;
}

const FILTER_CONFIG = [
  { id: 0, label: 'List', filter: 'list', iconName: 'VscListFilter' },
  { id: 1, label: 'Board', filter: 'board', iconName: 'TbLayoutDashboardFilled' }
]

const TaskContainerSkeleton = memo(() =>
{
  return (
    <div className="tasks-container">
      <div className="tasks-wrapper" style={{ height: 'fit-content' }}>
        {skeletonCards.map((_, i) => (
          <div key={`${i.toString()}-r`} className="task-card">
            <Skeleton type={"line"} width={'135px'} height={'20px'} />
            <Skeleton type={"line"} width={'100%'} height={'65px'} />
            <Skeleton type={"line"} width={'35%'} />
            <Skeleton type={"line"} width={'50%'} />
            <Skeleton type={"line"} width={'35%'} />
          </div>))}
      </div>
    </div>
  )
})


const DropdownSkeleton = memo(() =>
{
  return (
    <div className="dropdown-list">
      {skeletons.map((_, i) => (
        <Skeleton key={`p-i ${i.toString()}`} type={"box"} height={40} className="project-items" />
      ))}
    </div>)
})

const FilterContainer = memo(({ isPending, projectName, view, onFilterChange }: FilterContainerParams) =>
{
  const filterComponents: FilterParams[] = useMemo(() =>
  {
    return FILTER_CONFIG.map((filter) => ({
      id: filter.id,
      iconName: filter.iconName as IconName,
      selected: filter.filter === view,
      filterType: filter.filter as FilterTypes,
      label: filter.label,
    }))
  }, [view])


  return (
    <div className="filter-container el-flx">
      <div className={'el-flx'}>
        <span>project / {decodeURI(projectName)}</span>
        <span>{view} view</span>
      </div>
      <div className="filter-wrapper el-flx">
        {filterComponents.map((filter) => (
          <button key={filter.id} type="button"
            className={`filter-btn el-flx  ${filter.selected ? 'selected' : ''}`}
            onClick={() => { onFilterChange(filter.filterType) }}>
            {(isPending && filter.filterType !== view) ?
              <Spinner style={{ height: '.85rem', width: '.85rem', marginBottom: 0 }} /> :
              <IconWrapper name={filter.iconName} />}
            <span>{filter.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
})


function DashboardLayout()
{
  useToastMessage('success');
  const isMobile = useMediaQuery();

  const [isOpenProfile, setIsOpenProfile] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [searchParams, setSearchParams] = useSearchParams();

  const projectName = searchParams.get('p_name') ?? 'all ';
  const view = (searchParams.get("view") ?? "list") as FilterTypes;
  const projectID = searchParams.get("project_id");

  const { user, projectsPromise } = useLoaderData<typeof dashboardLoader>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const projects = use(projectsPromise);
  const hasPrefetched = useRef(false);

  const openSidebar = useCallback(() => { setIsSidebarOpen(true) }, []);
  const closeSidebar = useCallback(() => { setIsSidebarOpen(false) }, []);

  const displayProfile = useCallback(() => { setIsOpenProfile(true) }, []);


  const onFilterChange = useCallback((filter: FilterTypes) =>
  {
    if (filter === view) return;
    startTransition(() =>
    {
      setSearchParams((prev) =>
      {
        prev.set("view", filter);
        return prev;
      });
    })
  }, [setSearchParams, view]);

  const onMouseEnter = useCallback(() =>
  {
    if (!hasPrefetched.current)
    {
      LoadProfile()
        .then(() => { hasPrefetched.current = true })
        .catch((e: unknown) => { console.error('Failed to prefetch lazy component ', e) })
    }
  }, []);

  const onMouseEnterUl = useCallback(() =>
  {
    LoadContextMenu()
      .catch((e: unknown) => { console.error('Failed to prefetch lazy component ', e) })
  }, [])

  const closeProfileModal = useCallback(() =>
  {
    setIsOpenProfile(false);
  }, [])


  const isMobileSidebarOpen = isMobile && isSidebarOpen;
  const sidebarCls = isMobileSidebarOpen ? 'project-sidebar open' : 'project-sidebar';
  const hasProjects = projects.length > 0;
  const projectsCount = projects.length;

  return (
    <div className="container dashboard">
      <div className={'header-container el-grd'}>
        <div className={'header-wrapper header-wrapper--right el-flx'}>
          <header className="main--header">
            <h1 className="main-heading desktop-only">
              Welcome back, {user.username}
            </h1>
          </header>
          {isMobile &&
            <button type="button" className="menu-btn mobile-only" onClick={openSidebar}>
              <IconWrapper name='FaBarsStaggered' className="menu-icon" />
            </button>
          }
          <LogoImg />
        </div>

        <div className="header-wrapper header-wrapper--left el-flx">
          <button type="button">
            <IconWrapper name="RiSearch2Line" className="search-icon" />
          </button>
          {!isMobile &&
            <span className="calendar el-flx" style={{ alignItems: 'center', gap: "0.5em", color: "var(--text-muted)" }}>
              <IconWrapper name={'FiCalendar'} style={{ fontSize: "1.35rem" }} />
              <span className="date" style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', color: "var(--text-muted)", fontWeight: 'bold' }}>{longFormat}</span>
            </span>
          }

          <div
            className="avatar-wrapper"
            aria-label='button'
            role='button'
            onClick={() => { setIsOpenProfile(true) }}
            onMouseEnter={onMouseEnter}>
            <img
              className="profile-img"
              alt="user profile image"
              fetchPriority={'high'}
              loading="eager"
              src={`${user.profileImgUrl}?v=${String(user.avatarVersion)}`} />
          </div>
        </div>

      </div>

      <main className="main">
        <FilterContainer
          isPending={isPending}
          projectName={projectName}
          view={view}
          onFilterChange={onFilterChange} />

        <ContextMenuProvider>
          <DeleteModalProvider>
            <aside className={`${sidebarCls} el-flx`}>
              <SidebarWrapper
                pCount={projectsCount}
                displayProfile={displayProfile}
                isMobileSidebarOpen={isMobileSidebarOpen}
                closeSidebar={closeSidebar} >
                {hasProjects ? (
                  <ul className="dropdown-list" onMouseEnter={onMouseEnterUl}>
                    <Suspense fallback={<DropdownSkeleton />}>
                      <DropdownContent projects={projects} />
                    </Suspense>
                  </ul>
                ) : <p className="empty-state">No projects found</p>}
              </SidebarWrapper>
            </aside>

            <Suspense fallback={<TaskContainerSkeleton />}>
              <Outlet context={{ view, projectID } satisfies DashboardCtxParams} />
            </Suspense>
          </DeleteModalProvider>
        </ContextMenuProvider>
      </main>
      <Footer />
      {isOpenProfile && <UserProfile
        closeProfileModal={closeProfileModal} />}
    </div >)
}


FilterContainer.displayName = 'FilterContainer';

export default memo(DashboardLayout);