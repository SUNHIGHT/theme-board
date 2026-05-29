import type { ReactNode } from "react";
import "./Modal.css";

type ModalProps = {
  title?: string;
  children: ReactNode;
  onClose: () => void;
};

export function Modal({ title, children, onClose }: ModalProps) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          {title && <h2>{title}</h2>}
          <button className="modal-close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}