import { Plus, RefreshCcw, Users } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Spinner } from '../ui/spinner';
import type { User } from '@/lib/Types/UserTypes';

const UsersHeader = () => {
  const [refreshing, setRefreshing] = useState(false);
  // 🔹 Users data state
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);

  // 🔹 Refresh Control
  const handleRefresh = async () => {
    setRefreshing(true); // 🔄 spinner
    try {
      await new Promise((res) => setTimeout(res, 1000)); // 🧪 test

      // 🔹 API call
      // const res = await axiosPrivate.get(
      //   `/users?page=${page}&perPage=${perPage}&role=${roleFilter}&search=${searchTerm}`,
      // );

      const res = await axiosPrivate.get('/users');
      setUsers(res.data.users || []);
      setTotal(res.data.count || 0);
    } catch (error) {
      console.log('Failed to Load Users!', error);
      toast.error('Failed to Load Users!');
    } finally {
      setRefreshing(false); // 🔄 spinner
    }
  };
  return (
    <div className='flex items-center justify-between'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight text-gray-900'>
          Users Management
        </h1>
        <p className='text-sm text-gray-600'>
          View and manage all system users
        </p>
      </div>

      {/* ===== 🔍 Refresh & ➕ Add Button ===== */}
      <div className='flex items-center gap-4'>
        <Users className='w-8 h-8 text-blue-600' />
        <span className='text-2xl font-bold text-blue-600 flex items-center gap-2 w-10'>
          {refreshing ? (
            <Spinner className='h-5 w-5 animate-spin text-blue-600' /> // 🔄
          ) : (
            total // 🔢
          )}
        </span>

        {isAdmin && (
          <>
            <Button
              variant='outline'
              className='w-30 flex items-center justify-center border-blue-600 text-blue-600 hover:bg-blue-50'
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCcw
                className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`}
              />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className='px-5 py-2 text-sm font-medium  rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 hover:opacity-90 transition shadow-md'
            >
              <Plus className='mr-2 h-4 w-4' /> Add User
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default UsersHeader;
