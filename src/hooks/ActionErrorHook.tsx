import { useEffect } from "react";
import type { ActionFuncError } from "../models/entity";
import { useFlashMessage } from "./ProviderHooks";



export default function useActionError(errData?: ActionFuncError | null) {
  const { showMessage } = useFlashMessage();

  useEffect(() => {
    if (!errData?.error) return;
    showMessage({ text: errData.error, type: 'error' });

  }, [errData, showMessage]);
}