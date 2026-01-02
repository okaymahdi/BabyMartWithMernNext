import { MainSidebar } from '@/Components/Index';
import { cn } from '@/lib/utils';
import { Header } from '@/Shared/Index';
import { useState } from 'react';
import { Outlet } from 'react-router';

const Main = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className='h-screen flex bg-background'>
      <MainSidebar
        open={open}
        setOpen={setOpen}
      />
      <div
        className={cn(
          'flex flex-col flex-1 max-w-[--breakpoint-2xl] hoverEffect',
          open ? 'ml-64' : 'ml-20',
        )}
      >
        <Header />
        <main className=''>
          {/* এখানে সব child routes render হবে */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Main;
