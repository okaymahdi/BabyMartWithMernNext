import { cn } from '@/lib/utils';
import { SidebarNavigators } from '@/Routes/SidebarNavigators';
import { NavLink, useLocation } from 'react-router';

type SidebarItemProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
  open?: boolean;
  end?: boolean;
  pathname: string;
};

const NavItems = () => {
  const { pathname } = useLocation();
  return (
    <div>
      <div className='flex flex-col flex-1 gap-1 p-3 bg-linear-to-b from-slate-900/50 to-slate-800/50'>
        {SidebarNavigators?.map((nav) => (
          <Sidebar
            key={nav?.to}
            to={nav?.to}
            icon={nav?.icon}
            label={nav?.label}
            end={nav?.end}
            pathname={pathname}
          />
        ))}
      </div>
    </div>
  );
};

const Sidebar = ({
  to,
  icon,
  label,
  open = true,
  end,
  pathname,
}: SidebarItemProps) => {
  return (
    <NavLink
      to={to}
      end={end}
      className={cn(
        'flex items-center p-3 rounded-xl text-sm font-medium hoverEffect gap-3 overflow-hidden text-white/80 hover:bg-linear-to-r hover:from-slate-700/50 hover:to-slate-600/50 hover:text-white hover:shadow-lg hover:backdrop-blur-sm',
        pathname === to
          ? 'bg-linear-to-r from-[#29beb3]/20 to-[#a96bde]/20 text-white shadow-lg shadow-[#29beb3]/20 scale-105 ring-1 ring-[#29bdb3] border border-white/10 backdrop-blur-sm'
          : 'text-slate-300 hover:scale-102',
      )}
    >
      <span>{icon}</span>
      {/* <span className={`${!open ? 'hidden' : 'block'}`}>{label}</span> */}

      {open && label}
    </NavLink>
  );
};

export default NavItems;
