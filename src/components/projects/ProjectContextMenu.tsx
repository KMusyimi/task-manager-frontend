import { memo, useCallback } from "react";
import useDeleteModal, { useContextMenu } from "../../hooks/ProviderHooks";
import DuplicateForm from "../general/DuplicateForm";


interface ProjectContextParams
{
  displayForm: (intent: 'add' | 'edit') => void;
}

const LoadEditForm = () => import("./ProjectsFormContainer");
const LoadDeleteModal = () => import("../modals/DeleteModal");


function ProjectContextMenu({ displayForm }: ProjectContextParams)
{
  const { setDeletePayload, displayModal } = useDeleteModal();

  const { closeMenu, formData, position } = useContextMenu();
  const { top, left } = position;

  const displayEditForm = useCallback((e: React.MouseEvent<HTMLButtonElement>) =>
  {
    e.preventDefault();
    closeMenu();
    displayForm('edit');
  }, [closeMenu, displayForm])

  const handleDeleteBtn = useCallback((e: React.MouseEvent<HTMLButtonElement>, formdata: typeof formData) =>
  {
    e.preventDefault();
    setDeletePayload(prev => ({
      ...prev,
      inputName: 'projectID',
      payloadID: formdata.payloadID,
      name: formdata.projectName
    }));
    closeMenu();
    displayModal();
  }, [closeMenu, displayModal, setDeletePayload]);

  const handleMouseEnterEdit = useCallback(() =>
  {
    LoadEditForm().catch((e: unknown) => { console.error('Failed to prefetch lazy component ', e) })
  }, [])
  const handleMouseEnterDelete = useCallback(() =>
  {
    LoadDeleteModal().catch((e: unknown) => { console.error('Failed to prefetch lazy component ', e) })
  }, []);



  return (
    < >
      <div className="context--menu" style={{ top, left }}  >
        <div className="context-wrapper" onClick={(e) => { e.stopPropagation() }}>

          <DuplicateForm
            closeMenu={closeMenu}
            inputName='projectID'
            inputValue={formData.payloadID}>
            <button className="submit-btn menu-btn" type='submit'>Duplicate</button>
          </DuplicateForm>
          <button
            type="button"
            className="menu-btn edit-btn"
            onMouseEnter={handleMouseEnterEdit}
            onClick={displayEditForm}>Edit</button>

          <button type="button"
            style={{ color: 'var(--primary-red)' }}
            className="menu-btn delete-btn"
            onMouseEnter={handleMouseEnterDelete}
            onClick={(e) => { handleDeleteBtn(e, formData) }}>Delete</button>
        </div>
      </div>
    </>
  )
}


export default memo(ProjectContextMenu)