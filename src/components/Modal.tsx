import { ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  show: boolean;
  onClose: () => void;
  children: ReactNode;
  title: string;
}

export function Modal({ show, onClose, children, title }: ModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-950 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-md border border-gray-700 relative">
        <h3 className="text-2xl font-bold text-sky-300 mb-4 text-center">
          {title}
        </h3>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition duration-200"
        >
          <X size={24} />
        </button>
        {children}
      </div>
    </div>
  );
}
