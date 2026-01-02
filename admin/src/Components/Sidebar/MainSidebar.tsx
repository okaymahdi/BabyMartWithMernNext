import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { SidebarFooter } from './SidebarFooter';
import { SidebarItems } from './SidebarItems';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const MainSidebar = ({ open, setOpen }: Props) => {
  return (
    <motion.aside
      initial={{ width: open ? 256 : 80 }}
      animate={{ width: open ? 256 : 80 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className={cn(
        'fixed inset-y-0 left-0 z-20 flex flex-col h-full overflow-hidden',
        'border-r border-white/10',
        'bg-linear-to-b from-[#0f172a] via-[#111827] to-[#020617]',
        'text-slate-200 shadow-2xl',
      )}
    >
      {/* Header */}
      <div className='flex items-center justify-between p-4 h-16 bg-linear-to-r from-sky-400/30 via-indigo-400/25 to-violet-400/30 border-b border-white/10 backdrop-blur-md'>
        <motion.div
          initial={{ opacity: open ? 1 : 0, width: open ? 'auto' : 0 }}
          animate={{ opacity: open ? 1 : 0, width: open ? 'auto' : 0 }}
          transition={{ duration: 0.2 }}
          className='overflow-hidden'
        >
          <h2 className='text-lg font-semibold tracking-wide text-white/90'>
            🍼 BabyShop Admin
          </h2>
        </motion.div>

        <Button
          onClick={() => setOpen(!open)}
          variant='ghost'
          size='icon'
          className='rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 backdrop-blur-md transition-all'
        >
          <motion.div
            animate={{ rotate: open ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronLeft />
          </motion.div>
        </Button>
      </div>

      {/* Sidebar Items */}
      <div className='flex-1 overflow-y-auto w-full pr-2'>
        <SidebarItems open={open} />
      </div>

      {/* Footer */}
      <div className='flex-none w-full mt-auto'>
        <SidebarFooter open={open} />
      </div>
    </motion.aside>
  );
};

export default MainSidebar;
