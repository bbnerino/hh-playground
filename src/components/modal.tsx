import React from "react";
import Button from "./Button";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  children?: React.ReactNode;
}

const Modal = ({ open, onClose, onConfirm, children }: ModalProps) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/50" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-lg w-[500px] h-[300px] flex flex-col p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-1 overflow-auto">{children}</div>
        <div className="absolute bottom-4 right-6 flex gap-2">
          <Button onClick={onClose}>취소</Button>
          <Button variant="secondary" onClick={onConfirm}>
            확인
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
