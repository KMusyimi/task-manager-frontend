import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useFlashMessage } from "./ProviderHooks";

export function useToastMessage() {
  const { showMessage } = useFlashMessage();

  const [searchParams, setSearchParams] = useSearchParams();
  const message = searchParams.get('message');

  useEffect(() => {
    if (!message) return;

    showMessage({ text: message, type: 'success' });
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('message');
    setSearchParams(newParams, { replace: true });

  }, [message, searchParams, setSearchParams, showMessage]);

}

