// src/Pages/Users/components/UsersHeader.tsx
import { Button } from '@/Components/ui/button';

interface UsersHeaderProps {
  total: number;
  refreshing: boolean;
  onAdd: () => void;
  onRefresh: () => void;
  loading?: boolean;
}

export const UsersHeader = ({
  total,
  onAdd,
  onRefresh,
  loading,
}: UsersHeaderProps) => (
  <div className='flex justify-between items-center'>
    <div>
      <h1 className='text-3xl font-bold'>Users</h1>
      <p className='text-sm text-gray-500'>Total: {total}</p>
    </div>
    <div className='flex gap-3'>
      <Button
        variant='outline'
        onClick={onRefresh}
        disabled={loading}
      >
        {loading ? 'Refreshing...' : 'Refresh'}
      </Button>
      <Button onClick={onAdd}>Add User</Button>
    </div>
  </div>
);
