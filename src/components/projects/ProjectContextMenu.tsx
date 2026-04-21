import { memo, useCallback } from "react";
import useDeleteModal, { useContextMenu } from "../../hooks/ProviderHooks";
import DuplicateProjectForm from "./DuplicateProjectForm";


interface ProjectContextParams {
  openEditForm: () => void
}

const LoadEditForm = () => import("./EditProjectForm");
const LoadDeleteModal = () => import("../modals/DeleteModal");


function ProjectContextMenu({ openEditForm }: ProjectContextParams) {
  const { setDeletePayload, displayModal } = useDeleteModal();

  const { closeMenu, formData, position } = useContextMenu();
  const { top, left } = position;

  const displayEditForm = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    closeMenu();
    openEditForm();
  }, [closeMenu, openEditForm])

  const handleDeleteBtn = useCallback((e: React.MouseEvent<HTMLButtonElement>, formdata: typeof formData) => {
    e.stopPropagation();
    setDeletePayload(prev => ({
      ...prev,
      inputName: 'projectID',
      payloadID: formdata.payloadID,
      name: formdata.projectName
    }));
    closeMenu();
    displayModal();
  }, [closeMenu, displayModal, setDeletePayload]);

  const handleMouseEnterEdit = useCallback(() => {
    LoadEditForm().catch((e: unknown) => { console.error('Failed to prefetch lazy component ', e) })
  }, [])
  const handleMouseEnterDelete = useCallback(() => {
    LoadDeleteModal().catch((e: unknown) => { console.error('Failed to prefetch lazy component ', e) })
  }, [])

  return (
    <div className="context--menu"
      style={{ top, left }} >
      <div className="context-wrapper" onClick={(e) => { e.stopPropagation() }}>
        <DuplicateProjectForm
          closeContextMenu={closeMenu}
          payloadID={formData.payloadID} />
        <button
          type="button"
          className="edit-btn"
          onMouseEnter={handleMouseEnterEdit}
          onClick={displayEditForm}>
          Edit
        </button>

        <button type="button"
          className="delete-btn"
          onMouseEnter={handleMouseEnterDelete}
          onClick={(e) => { handleDeleteBtn(e, formData) }}>
          Delete
        </button>
      </div>
    </div>
  )
}


export default memo(ProjectContextMenu)