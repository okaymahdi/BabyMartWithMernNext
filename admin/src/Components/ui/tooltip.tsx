// src/Components/ui/tooltip.tsx
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'motion/react';
import { useState, type ReactNode } from 'react';
// src/Components/ui/tooltip.tsx

interface TooltipProps {
  children: ReactNode;
  content: string;
  show?: boolean; // optional, only show tooltip if true
}

const Tooltip = ({ children, content, show = true }: TooltipProps) => {
  const [hovered, setHovered] = useState(false);

  if (!show) return <>{children}</>; // sidebar open -> no tooltip

  return (
    <div
      className='relative flex items-center'
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute left-full top-1/2 -translate-y-1/2 ml-2',
              'bg-black text-white text-xs px-2 py-1 rounded shadow-lg z-50 whitespace-nowrap',
            )}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { Tooltip };
