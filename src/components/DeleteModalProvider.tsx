import React, { createContext, memo, useCallback, useMemo, useState } from "react";

interface DeletePayload {
  id: string
  inputName: string
  name: string
  isOpen: boolean
}

interface DeleteContextTypes {
  payload: DeletePayload
  handleDltPayload: (payload: DeletePayload) => void
}

// eslint-disable-next-line react-refresh/only-export-components
export const DeleteContext = createContext<DeleteContextTypes>({
  payload: {
    id: "",
    inputName: "",
    name: "",
    isOpen: false
  },
  handleDltPayload: function (): void {
    throw new Error("Function not implemented.");
  }
});

function DeleteModalProvider({ children }: { children: React.ReactNode }) {
  const [payload, setPayload] = useState<DeletePayload>({
    id: '', inputName: '', name: "", isOpen: false
  });

  const handleDltPayload = useCallback((payload: DeletePayload) => {
    setPayload(payload);
  }, [])

  const memorizedData = useMemo(() => ({ payload, handleDltPayload }), [handleDltPayload, payload])

  return (
    <DeleteContext value={memorizedData}>
      {children}
    </DeleteContext>);
}

export default memo(DeleteModalProvider);