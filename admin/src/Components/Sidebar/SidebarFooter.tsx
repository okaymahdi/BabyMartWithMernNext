// src/Components/Sidebar/SidebarFooter.tsx
import { Button } from '@/Components/ui/button';
import { cn } from '@/lib/utils';
import useAuthStore from '@/Store/UseAuthStore';
import { LogOut } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

interface Props {
  open: boolean;
}

const SidebarFooter = ({ open }: Props) => {
  const { user, logout } = useAuthStore();

  return (
    <div className='p-4 border-t border-slate-600/50 bg-linear-to-r from-[#0b0c17] via-[#11121f]/80 to-[#0b0c17]'>
      <motion.div
        className={cn(
          'flex items-center gap-1 mb-2',
          open ? 'justify-start' : 'justify-center',
        )}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {/* Avatar */}
        <div className='w-10 h-10 rounded-full overflow-hidden bg-linear-to-br from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center text-white font-semibold border-2 border-border ring-2 ring-ring transition-all duration-300 hover:ring-pink-400/50 hover:scale-105 shadow-lg'>
          {user?.avatar ? (
            <img
              src={user?.avatar}
              alt={user?.name}
              className='w-full h-full object-cover rounded-full'
            />
          ) : (
            user?.name?.charAt(0).toUpperCase()
          )}
        </div>

        {/* Name + Role */}
        <AnimatePresence>
          {open && (
            <motion.div
              className='flex flex-col px-2 py-1'
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <span className='text-sm font-medium truncate max-w-33.5'>
                {user?.name}
              </span>
              <span className='text-xs text-[#29beb3] capitalize font-medium bg-[#0b0c17] rounded-full backdrop-blur-sm'>
                {user?.role}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Sign Out */}
      <motion.div
        className={cn('mt-2', open ? 'justify-start' : 'justify-center flex')}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.25 }}
      >
        <Button
          onClick={logout}
          size={open ? 'default' : 'icon'}
          className={cn(
            'w-full relative overflow-hidden',
            'border border-pink-400/30',
            'bg-linear-to-r from-pink-500/20 via-purple-500/20 to-indigo-500/20',
            'text-pink-100 font-semibold',
            'hover:text-white',
            'hover:border-pink-400/60',
            'hover:bg-linear-to-r hover:from-pink-500/40 hover:via-purple-500/40 hover:to-indigo-500/40',
            'shadow-md hover:shadow-pink-500/40',
            'transition-all duration-300 backdrop-blur-md rounded-md',
          )}
        >
          <motion.span
            whileHover={{ rotate: -4, scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 220 }}
            className='flex items-center justify-center'
          >
            <LogOut
              size={16}
              className='mr-2'
            />
            {open && '🚪 Sign Out'}
          </motion.span>
        </Button>
      </motion.div>
    </div>
  );
};

export { SidebarFooter };
