// src/Components/UI/Modal.tsx
import { X } from 'lucide-react';

const Modal = ({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  if (!open) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60'>
      <div className='w-full max-w-md rounded-2xl bg-slate-900 border border-white/10'>
        <div className='flex items-center justify-between p-4 border-b border-white/10'>
          <h3 className='font-semibold'>{title}</h3>
          <button onClick={onClose}>
            <X />
          </button>
        </div>
        <div className='p-4'>{children}</div>
      </div>
    </div>
  );
};
export { Modal };
