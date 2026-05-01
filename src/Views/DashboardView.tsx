import { lazy, memo, Suspense, useCallback, useState } from "react";
import { Outlet, useLoaderData, useOutletContext } from "react-router-dom";

import type { projectsLoader } from "../utils/loaders";

import useDeleteModal, { useContextMenu } from "../hooks/ProviderHooks";

import Dashboard from "../components/projects/Dashboard";

import Overlay from "../components/general/Overlay";
import Spinner from "../components/general/Spinner";
import { ProjectContextType } from "./ProjectsLayout";


const EditProjectForm = lazy(() => import("../components/projects/EditProjectForm"));
const ProjectContextMenu = lazy(() => import("../components/projects/ProjectContextMenu"));
const DeleteModal = lazy(() => import("../components/modals/DeleteModal"));


function DashboardView() {
  const { projectsResp } = useLoaderData<typeof projectsLoader>();
  const { isMobileSidebarOpen, closeSidebar } = useOutletContext<ProjectContextType>();
  const { openModal } = useDeleteModal();

  const { isMenuOpen, closeMenu } = useContextMenu();

  const [openForm, setOpenForm] = useState(false);


  const openEditForm = useCallback(() => { setOpenForm(true) }, []);
  const closeEditForm = useCallback(() => { setOpenForm(false) }, []);

  const isMenuOrFormOrModalOpen = isMenuOpen || openForm || openModal;


  return (
    <>
      <Dashboard dataPromise={projectsResp} />
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
        </Overlay>)
        : (isMobileSidebarOpen && (<Overlay isActive={true} closeOverlay={closeSidebar} />)
        )}
    </>
  )
}

export default memo(DashboardView);