import { UserSkeleton } from '@/Components/Index';
import { Button } from '@/Components/ui/button';
import { Spinner } from '@/Components/ui/spinner';
import UserFilters from '@/Components/Users/UserFilters';
import UsersTable from '@/Components/Users/UsersTable';
import useAxiosPrivate from '@/Hooks/useAxiosPrivate';
import { useUsers } from '@/Hooks/useUsers';
import {
  CreateUserSchema,
  UpdateUserSchema,
  type User,
} from '@/lib/Types/UserTypes';
import AddUserModal from '@/Modals/AddUserModal';
import DeleteUserModal from '@/Modals/DeleteUserModal';
import EditUserModal from '@/Modals/EditUserModal';
import ViewUserModal from '@/Modals/ViewUserModal';
import useAuthStore from '@/Store/UseAuthStore';
import { apiLogger } from '@/utils/apiLogger';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Plus, RefreshCcw, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type z from 'zod';

type CreateUserForm = z.infer<typeof CreateUserSchema>;
type UpdateUserForm = z.infer<typeof UpdateUserSchema>;

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

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewUser, setViewUser] = useState<User | null>(null);

  // RHF Form
  const addForm = useForm<CreateUserForm>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'user',
      avatar: '',
    },
  });

  const editForm = useForm<UpdateUserForm>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'user',
      avatar: '',
    },
  });

  // 🔹 Sync local state with useUsers hook
  useEffect(() => {
    setLocalUsers(users);
    setLocalTotal(total);
  }, [users, total]);

  // 🔹 Refresh handler
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchUsers(); // useUsers hook থেকে data reload
    } catch (error) {
      toast.error('Failed to Refresh Users!');
      console.log('Failed to Refresh Users!', error);
    } finally {
      setRefreshing(false);
    }
  };

  // 🔹 Filtered Users based on search & role
  const filteredUsers = localUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) return <UserSkeleton isAdmin={isAdmin} />;

  // 🔹 Add User handler
  const handleAddUser = async (data: CreateUserForm) => {
    if (formLoading) return;
    setFormLoading(true);

    try {
      // 1️⃣ Create user API call
      const res = await axiosPrivate.post('/users', data);

      // 2️⃣ Success toast
      toast.success('✅ User added successfully!');

      // 3️⃣ Log success
      apiLogger({
        event: 'ADD_USER',
        endpoint: '/users',
        payload: data,
        response: res.data,
        success: true,
      });

      // 4️⃣ Reset form & close modal
      addForm.reset();
      setIsAddModalOpen(false);

      // 5️⃣ Refresh table AFTER API call
      await fetchUsers();
    } catch (err) {
      console.error('Add User Error:', err);

      apiLogger({
        event: 'ADD_USER',
        endpoint: '/users',
        payload: data,
        error: err,
        success: false,
      });

      if (axios.isAxiosError(err))
        toast.error(err.response?.data?.message || '⚠️ Failed to add user!');
      else toast.error('⚠️ Failed to add user!');
    } finally {
      setFormLoading(false);
    }
  };

  // 🔹 View User Details handler (Modal open + form prefill)
  const handleViewUser = (user: User) => {
    setViewUser(user); // কোন user view করতে চাও
    setIsViewModalOpen(true); // modal open
  };

  // 🔹 Edit User handler (Modal open + form prefill)
  const handleEditUser = (user: User) => {
    // কোন user edit হচ্ছে সেটা store করা
    setSelectedUser(user);

    // 🔹 Form এ আগের data বসানো
    editForm.reset({
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    });

    // 🔹 Modal open
    setIsEditModalOpen(true);
  };

  // 🔹 Update User handler (API call)
  const handleUpdateUser = async (data: UpdateUserForm) => {
    if (!selectedUser || formLoading) return;

    setFormLoading(true);

    try {
      const res = await axiosPrivate.put(`/users/${selectedUser._id}`, data);

      toast.success('✅ User updated successfully!');

      apiLogger({
        event: 'UPDATE_USER',
        endpoint: `/users/${selectedUser._id}`,
        payload: data,
        response: res.data,
        success: true,
      });

      // 🔹 Modal close + reset
      setIsEditModalOpen(false);
      setSelectedUser(null);
      editForm.reset();

      // 🔹 Refresh table
      await fetchUsers();
    } catch (err) {
      console.error('Update User Error:', err);

      apiLogger({
        event: 'UPDATE_USER',
        endpoint: `/users/${selectedUser?._id}`,
        payload: data,
        error: err,
        success: false,
      });

      toast.error('⚠️ Failed to update user!');
    } finally {
      setFormLoading(false);
    }
  };

  // 🔹 Delete User handler
  // Delete User handler
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    setFormLoading(true);
    try {
      await axiosPrivate.delete(`/users/${selectedUser._id}`);
      toast.success('✅ User deleted successfully!');
      await fetchUsers();
      setIsDeleteModalOpen(false);
    } catch (err) {
      toast.error('⚠️ Failed to delete user!');
      console.log('Delete User Error:', err);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className='p-5 space-y-5'>
      {/* ===== 🔹 Header + Buttons ===== */}
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
      {/* ===== 🔹 Filters ===== */}
      <UserFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
      />

      {/* ===== 🔹 Users Table ===== */}
      <UsersTable
        users={filteredUsers}
        isAdmin={isAdmin}
        onView={handleViewUser} // 👈 view handler pass
        onEdit={handleEditUser} // ✅ এখানে
        onDelete={(user) => {
          setSelectedUser(user); // 👈 selectedUser set
          setIsDeleteModalOpen(true); // 👈 modal open
        }}
      />

      {/* ===== 🔹 Add User Modal ===== */}
      <AddUserModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        form={addForm}
        onSubmit={handleAddUser}
        loading={formLoading}
      />

      {/* ===== 🔹 Edit User Modal ===== */}
      <ViewUserModal
        open={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        user={viewUser}
      />

      {/* ===== 🔹 Edit User Modal ===== */}
      <EditUserModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        form={editForm} // ✅ UpdateUserForm type
        onSubmit={handleUpdateUser} // ✅ data: UpdateUserForm
        loading={formLoading}
      />

      {/* ===== 🔹 Delete User Modal ===== */}
      <DeleteUserModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteUser}
        loading={formLoading}
        user={selectedUser}
      />
    </div>
  );
};

export default UsersPage;
