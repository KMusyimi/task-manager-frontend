import type React from "react";

interface ModalProps {
  isOpen: boolean;
  children: React.ReactNode;
  handleOnClose: ()=> void
}

export default function Modal({ children, isOpen, handleOnClose, ...rest }: ModalProps) {
  return (
    <>
      {isOpen && <div className="modal-overlay" {...rest}>
        <div className="modal-content">
          <button className="modal-close-btn" type="button" onClick={handleOnClose}>
            &times;
          </button>
          {children}
        </div>
      </div>}
    </>
  )
}