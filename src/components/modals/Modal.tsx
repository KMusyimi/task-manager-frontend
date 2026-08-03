import './module/style.css';
import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  children: ReactNode;
}


export default function Modal({ children, isOpen, ...rest }: ModalProps) {
  if (!isOpen) return null;
  return (
    <div className="modal-content" {...rest} onClick={(e) => { e.stopPropagation() }}>
      {children}
    </div>
  )
}