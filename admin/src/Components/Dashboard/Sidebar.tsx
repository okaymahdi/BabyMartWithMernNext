import { cn } from '@/lib/utils';
import useAuthStore from '@/Store/UseAuthStore';
import { ChevronLeft, LogOut } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Button } from '../ui/button';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar = ({ open, setOpen }: Props) => {
  const { user, logout } = useAuthStore();

  return (
    <motion.aside
      initial={{ width: open ? 256 : 80 }}
      animate={{ width: open ? 256 : 80 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className={cn(
        'fixed inset-y-0 left-0 z-20 flex flex-col overflow-hidden',
        'border-r border-white/10',
        'bg-linear-to-b from-[#0f172a] via-[#111827] to-[#020617]',
        'text-slate-200 shadow-2xl',
        open ? 'w-64' : 'w-20',
      )}
    >
      {/* Header */}
      <div
        className='
        flex items-center justify-between p-4 h-1/6
        bg-linear-to-r from-sky-400/30 via-indigo-400/25 to-violet-400/30
        border-b border-white/10 backdrop-blur-md
      '
      >
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
          className='
            rounded-full bg-white/5 hover:bg-white/10
            border border-white/10 hover:border-white/20
            backdrop-blur-md transition-all
          '
        >
          <motion.div
            animate={{ rotate: open ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronLeft />
          </motion.div>
        </Button>
      </div>

      {/* Middle Sidebar Menu */}
      <div
        className='
        flex flex-col flex-1 gap-1 p-3 space-y-2
        bg-linear-to-b from-[#020617] to-[#020617]/70
      '
      >
        <div
          className='
          rounded-xl p-3 text-sm text-slate-300
          bg-white/4 hover:bg-white/8
          transition
        '
        >
          Middle setup
        </div>
      </div>

      {/* Sidebar Footer / Sign Out */}

      <div
        className='
          p-4 border-t border-slate-600/50
          bg-linear-to-r from-[#0b0c17] via-[#11121f]/80 to-[#0b0c17] '
      >
        {/* User Avatar */}
        <motion.div
          className={cn(
            'flex items-center gap-1 mb-4 ',
            open ? 'justify-start' : 'justify-center',
          )}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div
            className='
            w-10 h-10 rounded-full overflow-hidden 
            bg-linear-to-br from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center text-white font-semibold border-2 border-border ring-2 ring-ring transition-all duration-300 hover:ring-pink-400/50 hover:scale-105 shadow-lg'
          >
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
                <span className='text-xs text-[#29beb3] capitalize font-medium bg-[#0b0c17]  rounded-full backdrop-blur-sm'>
                  {user?.role}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        <motion.div
          className={cn(
            'flex items-center gap-3 mb-4 ',
            open ? 'justify-start' : 'justify-center',
          )}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
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
    </motion.aside>
  );
};

export default Sidebar;
