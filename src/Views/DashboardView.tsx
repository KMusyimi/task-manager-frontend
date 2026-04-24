import { lazy, memo, Suspense, useCallback, useState } from "react";
import { Outlet, useLoaderData, useOutletContext } from "react-router-dom";

import type { projectsLoader } from "../utils/loaders";

import { ProjectContextType } from "../components/projects/ProjectsLayout";
import DashboardSkeleton from "../components/skeleton/DashboardSkeleton";
import useDeleteModal, { useContextMenu } from "../hooks/ProviderHooks";


import Overlay from "../components/general/Overlay";
import Spinner from "../components/general/Spinner";

const Dashboard = lazy(() => import("../components/projects/Dashboard"));

const EditProjectForm = lazy(() => import("../components/projects/EditProjectForm"));
const ProjectContextMenu = lazy(() => import("../components/projects/ProjectContextMenu"));
const DeleteModal = lazy(() => import("../components/modals/DeleteModal"));


function DashboardView() {
  const { projectsResp } = useLoaderData<typeof projectsLoader>();
  const { isMobile, closeSidebar, isSidebarOpen } = useOutletContext<ProjectContextType>();

  const { openModal } = useDeleteModal();

  const { isMenuOpen, closeMenu } = useContextMenu();

  const [openForm, setOpenForm] = useState(false);


  const openEditForm = useCallback(() => { setOpenForm(true) }, []);
  const closeEditForm = useCallback(() => { setOpenForm(false) }, []);

  const isMenuOrFormOrModalOpen = isMenuOpen || openForm || openModal;
  const isMobileSidebarOpen = isMobile && isSidebarOpen;

  return (
    <>
      <Suspense fallback={<DashboardSkeleton />}>
        <Dashboard dataPromise={projectsResp} />
      </Suspense>

      <Outlet />

      {isMenuOrFormOrModalOpen ? (
        <Overlay
          isActive={true}
          zIndex={201}
          closeOverlay={openForm ? closeEditForm : closeMenu}>
          <Suspense fallback={<Spinner />}>
            {openModal && <DeleteModal />}
            {isMenuOpen && <ProjectContextMenu
              openEditForm={openEditForm} />}
            {openForm && <EditProjectForm
              closeEditForm={closeEditForm} />}
          </Suspense>
        </Overlay>
      ) : (
        (isMobileSidebarOpen) && (
          <Overlay
            isActive={true}
            closeOverlay={closeSidebar} />)
      )}
    </>
  )
}

export default memo(DashboardView);