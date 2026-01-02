// src/Components/Sidebar/SidebarItem.tsx
import { cn } from '@/lib/utils';
import { SidebarNavigators } from '@/Routes/SidebarNavigators';
import { NavLink } from 'react-router';

interface Props {
  open: boolean;
}

const SidebarItems = ({ open }: Props) => {
  return (
    <div className='flex flex-col flex-1 gap-1 p-3 bg-linear-to-b from-[#020617] to-[#020617]/70'>
      {SidebarNavigators.map((nav) => (
        <NavLink
          key={nav.to}
          to={nav.to}
          end={nav.end}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200 hover:text-white hover:bg-linear-to-r hover:from-indigo-700/30 hover:via-purple-500/10 hover:to-indigo-600/40 p-3 text-sm font-medium hoverEffect overflow-hidden text-white/80 hover:shadow-lg hover:backdrop-blur-sm',
              isActive
                ? 'bg-linear-to-r from-[#29beb3]/20 to-[#a96bde]/20 text-white shadow-lg shadow-[#29beb3]/20 scale-105 ring-1 ring-[#29bdb3] border border-white/10 backdrop-blur-sm'
                : '',
              !open && 'justify-center px-0',
            )
          }
        >
          {nav.icon}
          {open && <span className='text-sm font-medium'>{nav.label}</span>}
        </NavLink>
      ))}
    </div>
  );
};

export { SidebarItems };
