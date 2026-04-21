import React, { createContext, useCallback, useMemo, useState } from "react";

interface DeletePayload {
  payloadID: string
  inputName: string
  name: string
  intent: 'delete',
}

export interface DeleteContextTypes {
  payload: DeletePayload;
  setDeletePayload: React.Dispatch<React.SetStateAction<DeletePayload>>;
  openModal: boolean;
  displayModal: () => void;
  closeModal: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const DeleteContext = createContext<DeleteContextTypes>({
  payload: {
    payloadID: "",
    inputName: "",
    name: "",
    intent: "delete"
  },
  setDeletePayload: function (): void {
    throw new Error("Function not implemented.");
  },
  openModal: false,
  displayModal: function (): void {
    throw new Error("Function not implemented.");
  },
  closeModal: function (): void {
    throw new Error("Function not implemented.");
  }
});

function DeleteModalProvider({ children }: { children: React.ReactNode }) {
  const [openModal, setOpenModal] = useState(false);
  const [payload, setDeletePayload] = useState<DeletePayload>({
    payloadID: '', inputName: '', name: "", intent: 'delete'
  });

  const displayModal = useCallback(() => { setOpenModal(true) }, []);

  const closeModal = useCallback(() => {
    setDeletePayload({
      payloadID: '', inputName: '', name: "", intent: 'delete'
    })
    setOpenModal(false);
  }, [])

  const memorizedData = useMemo(() => ({ payload, setDeletePayload, openModal, displayModal, closeModal }), [closeModal, displayModal, openModal, payload]);

  return (
    <DeleteContext value={memorizedData}>
      {children}
    </DeleteContext>);
}

export default DeleteModalProvider;