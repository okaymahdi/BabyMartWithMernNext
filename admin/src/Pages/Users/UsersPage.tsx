import { UserSkeleton } from '@/Components/Index';
import { Button } from '@/Components/ui/button';
import { Spinner } from '@/Components/ui/spinner';
import UserFilters from '@/Components/Users/UserFilters';
import UsersTable from '@/Components/Users/UsersTable';
import useAxiosPrivate from '@/Hooks/useAxiosPrivate';
import { useUsers } from '@/Hooks/useUsers';
import { CreateUserSchema } from '@/lib/Types/UserTypes';
import AddUserModal from '@/Modals/AddUserModal';
import useAuthStore from '@/Store/UseAuthStore';
import { apiLogger } from '@/utils/apiLogger';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, RefreshCcw, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type z from 'zod';

type FormData = z.infer<typeof CreateUserSchema>;

const UsersPage = () => {
  const { users, total, loading, fetchUsers } = useUsers();
  const axiosPrivate = useAxiosPrivate();
  const { checkIsAdmin } = useAuthStore();
  const isAdmin = checkIsAdmin();

  const [localUsers, setLocalUsers] = useState(users);
  const [localTotal, setLocalTotal] = useState(total);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const addForm = useForm<FormData>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'user',
      avatar: '',
    },
  });

  const handleRefresh = async () => {
    setRefreshing(true); // 🔄 spinner
    try {
      await new Promise((res) => setTimeout(res, 1000)); // 🧪 test

      // 🔹 API call
      // const res = await axiosPrivate.get(
      //   `/users?page=${page}&perPage=${perPage}&role=${roleFilter}&search=${searchTerm}`,
      // );

      const res = await axiosPrivate.get('/users');
      setLocalUsers(res.data.users || []);
      setLocalTotal(res.data.count || 0);
    } catch (error) {
      console.log('Failed to Load Users!', error);
      toast.error('Failed to Load Users!');
    } finally {
      setRefreshing(false); // 🔄 spinner
    }
  };

  const handleAddUser = async (data: FormData) => {
    if (formLoading) return;
    setFormLoading(true);

    try {
      await toast.promise(axiosPrivate.post('/users', data), {
        loading: '⏳ Adding user...',
        success: () => {
          apiLogger({
            event: 'ADD_USER',
            endpoint: '/users',
            payload: data,
            success: true,
          });
          addForm.reset();
          void fetchUsers();
          return '✅ User added successfully!';
        },
        error: (err) => {
          apiLogger({
            event: 'ADD_USER',
            endpoint: '/users',
            payload: data,
            success: false,
            error: err,
          });
          return err instanceof Error ? err.message : '⚠️ Failed to add user!';
        },
      });
    } finally {
      setFormLoading(false);
    }
  };

  useEffect(() => {
    setLocalUsers(users);
    setLocalTotal(total);
  }, [users, total]);

  // 🔹 Filtered Users
  const handleFilteredUsers = localUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  if (loading) return <UserSkeleton isAdmin={isAdmin} />;

  return (
    <div className='p-5 space-y-5'>
      {/* Header + Buttons */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight text-gray-900'>
            Users Management
          </h1>
          <p className='text-sm text-gray-600'>
            View and manage all system users
          </p>
        </div>

        <div className='flex items-center gap-4'>
          <Users className='w-8 h-8 text-blue-600' />
          <span className='text-2xl font-bold text-blue-600 flex items-center gap-2 w-10'>
            {refreshing ? (
              <Spinner className='h-5 w-5 animate-spin text-blue-600' />
            ) : (
              localTotal
            )}
          </span>
          {isAdmin && (
            <>
              <Button
                type='button'
                variant='outline'
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCcw
                  className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`}
                />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus className='mr-2 h-4 w-4' /> Add User
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Filters */}
      <UserFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
      />

      {/* Users Table */}
      <UsersTable
        users={handleFilteredUsers}
        isAdmin={isAdmin}
        onView={(user) => console.log('view', user)}
        onEdit={(user) => console.log('edit', user)}
        onDelete={(user) => console.log('delete', user)}
      />

      {/* Add User Modal */}
      <AddUserModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        form={addForm}
        onSubmit={handleAddUser}
        loading={formLoading}
      />

      {/* ➕ Add User Modal */}
    </div>
  );
};

export default UsersPage;
