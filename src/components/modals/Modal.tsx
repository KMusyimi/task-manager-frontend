import './styles/modal.css';
import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  children: ReactNode;
  handleOnClose?: () => void
}


export default function Modal({ children, isOpen, ...rest }: ModalProps) {
  if (!isOpen) return null;
  return (
    <div className="modal-content" {...rest} onClick={(e) => { e.stopPropagation() }}>
      {children}
    </div>
  )
}