import React, {
  CSSProperties,
  memo,
  useCallback, useEffect,
} from "react";
import { createPortal } from "react-dom";


interface OverlayParams {
  className?: string;
  isActive: boolean;
  zIndex?: number;
  children?: React.ReactNode;
  closeOverlay?: () => void;
}

const overlayStyles: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}

function Overlay({ isActive, zIndex, closeOverlay, children }: OverlayParams) {

  const handleOnKeyUp = useCallback((e: KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === 'Escape') {
      closeOverlay?.();
    }
  }, [closeOverlay]);

  useEffect(() => {
    if (!isActive) return
    document.body.classList.add('no-scroll');
    document.addEventListener('keydown', handleOnKeyUp);
    return () => {
      const hasActiveOverlay = document.body.querySelector('.overlay') !== null;

      if (!hasActiveOverlay) {
        document.body.classList.remove('no-scroll');
        document.removeEventListener('keydown', handleOnKeyUp);
      }
    };
  }, [handleOnKeyUp, isActive]);

  if (!isActive) return null;

  return createPortal(
    <div
      className={"overlay"}
      style={{ ...overlayStyles, zIndex }}
      onClick={closeOverlay}
    >
      <div className="default-content"
        onClick={(e) => { e.stopPropagation() }} style={{ display: 'contents' }}>
        {children}
      </div>
    </div>,
    document.body
  );
}

export default memo(Overlay);
