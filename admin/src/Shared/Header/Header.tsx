import { Button } from '@/Components/ui/button';
import useAuthStore from '@/Store/UseAuthStore';
import { Bell } from 'lucide-react';

const Header = () => {
  const { user } = useAuthStore();
  return (
    <header className='sticky top-0 z-10 flex items-center h-16 bg-background border-b border-border px-4'>
      <div className='flex items-center gap-4 ml-auto'>
        <Button
          variant={'ghost'}
          size={'icon'}
          className='rounded-full border border-border '
        >
          <Bell size={18} />
        </Button>
        <div>
          <div className='hidden md:block'>
            <p className='text-sm font-medium'>{user?.name}</p>
            <p className='text-xs text-muted-foreground capitalize'>
              {user?.role}
            </p>
          </div>
        </div>
        <div className='w-9 h-9 border border-sidebar-foreground rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold overflow-hidden'>
          {user?.avatar ? (
            <img
              src={user?.avatar}
              alt={user?.name}
              className='w-full h-full object-cover'
            />
          ) : (
            user?.name?.charAt(0).toUpperCase()
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
