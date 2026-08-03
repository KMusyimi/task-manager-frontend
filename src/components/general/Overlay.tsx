import { AnimatePresence, motion } from "framer-motion";
import React, {
  CSSProperties,
  memo,
  useEffect,
} from "react";
import { createPortal } from "react-dom";


interface OverlayParams {
  className?: string;
  isActive: boolean;
  zIndex?: number;
  styles?: CSSProperties;
  children?: React.ReactNode;
  closeOverlay?: () => void;
}

const overlayStyles: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}

function Overlay({ isActive, zIndex,styles,closeOverlay, children }: OverlayParams) {

  
  useEffect(() => {
    if (!isActive) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      e.stopPropagation();
      if (e.key === 'Escape') {
        closeOverlay?.();
      }
    };

    document.body.classList.add('no-scroll');
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      const remainingOverlays = document.querySelectorAll('.overlay');

      if (remainingOverlays.length <= 1) {
        document.body.classList.remove('no-scroll');
      }
    };
  }, [closeOverlay, isActive]);

  if (!isActive) return null;

  return createPortal(
    <AnimatePresence mode="wait">
      <motion.div
        key="overlay"
        className={"overlay"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ ...overlayStyles, zIndex, ...styles }}
        onClick={closeOverlay}
      >
        <motion.div className="default-content"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onClick={(e) => { e.stopPropagation() }} style={{ display: 'contents' }}>
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

export default memo(Overlay);
