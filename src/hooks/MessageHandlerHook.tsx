import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useFlashMessage } from "./ProviderHooks";

type msgTypes = 'success' | 'error' | 'warning' | 'info';

export function useToastMessage(type: msgTypes = 'success')
{
  const { showMessage } = useFlashMessage();

  const [searchParams, setSearchParams] = useSearchParams();
  const messageParam = searchParams.get('message');

  useEffect(() =>
  {
    if (!messageParam) return;
    showMessage({
      text: decodeURIComponent(messageParam), type
    });
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('message');
    setSearchParams(newParams, { replace: true });

  }, [messageParam, searchParams, setSearchParams, showMessage, type]);

}

