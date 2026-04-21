import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface MessageTypes {
  text: string
  type: 'success' | 'error' | 'warning' | 'info';
}
export interface ContextParams {
  showMessage: (message: MessageTypes) => void
}

// eslint-disable-next-line react-refresh/only-export-components
export const FlashMessageCxt = createContext<ContextParams>({
  showMessage: function (): void {
    throw new Error("Function not implemented.");
  }
})


function FlashMessageProvider({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState<MessageTypes>({ text: '', type: 'success' })
  const TimeoutIdRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (TimeoutIdRef.current) clearTimeout(TimeoutIdRef.current);
    };
  }, []);

  const showMessage = useCallback((message: MessageTypes) => {
    const flashTimeoutId = TimeoutIdRef.current;
    if (flashTimeoutId) {
      clearTimeout(flashTimeoutId);
    }
    const { text, type } = message;
    setMessage({ text, type });
    setIsVisible(true);

    const timeoutId = setTimeout(() => {
      setIsVisible(false);
      setMessage({ text: '', type: 'success' });
    }, 3000);

    TimeoutIdRef.current = timeoutId;
  }, []);


  const flashMessageEl = isVisible ? (
    <div className={`flash-message ${message.type} ${message.text !== '' ? 'active' : ''} `}>
      {message.text}
    </div>
  ) : null;

  const memorizedData = useMemo(() => ({ showMessage }), [showMessage])

  return (
    <FlashMessageCxt value={memorizedData}>
      {children}
      {/*Use createPortal to render the message outside the component tree */}
      {createPortal(flashMessageEl, document.body)}
    </FlashMessageCxt>)
}

export default FlashMessageProvider

