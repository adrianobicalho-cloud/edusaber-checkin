import { useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalPeople: number;
  name: string;
}

export default function SuccessModal({ isOpen, onClose, totalPeople, name }: SuccessModalProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="mx-4 w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-teal-100">
          <CheckCircle2 className="h-12 w-12 text-teal-500" strokeWidth={2.5} />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-gray-800">
          Presença Registrada!
        </h2>
        <p className="mb-1 text-lg text-gray-600">
          Bem-vindo(a), <span className="font-semibold text-teal-600">{name}</span>!
        </p>
        <p className="text-gray-500">
          {totalPeople === 1
            ? '1 pessoa registrada'
            : `${totalPeople} pessoas registradas`}
        </p>
        <div className="mt-6 h-1 overflow-hidden rounded-full bg-gray-200">
          <div className="h-full animate-[shrink_3s_linear_forwards] bg-teal-500 rounded-full" />
        </div>
        <style>{`
          @keyframes shrink {
            from { width: 100%; }
            to { width: 0%; }
          }
        `}</style>
      </div>
    </div>
  );
}
