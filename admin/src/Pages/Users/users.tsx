// src/Pages/UsersPage.tsx
import useAxiosPrivate from '@/Hooks/useAxiosPrivate';
import type { User } from '@/lib/Types/UserTypes';
import useAuthStore from '@/Store/UseAuthStore';
import { Users } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Modal } from '@/Components/ui/Modal';
import { Pagination } from '@/Components/Users/Pagination';
import { RoleBadge } from '@/Components/Users/RoleBadge';
import { UsersSkeleton } from '@/Components/Users/UsersSkeleton';
import { UsersTable } from '@/Components/Users/UsersTable';
import { Button } from '@/Components/ui/button';

const UsersPage = () => {
  // 🔹 Users data state
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage] = useState(20);
  const [totalPage, setTotalPage] = useState(1);

  // 🔹 Loading state
  const [loading, setLoading] = useState(true);

  // 🔹 Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // 🔹 Filters
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // 🔹 Axios instance + admin check
  const axiosPrivate = useAxiosPrivate();
  const { checkIsAdmin } = useAuthStore();
  const isAdmin = checkIsAdmin();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      // 🔹 API call
      // const res = await axiosPrivate.get(
      //   `/users?page=${page}&perPage=${perPage}&role=${roleFilter}&search=${searchTerm}`,
      // );

      // 🔹 API call Second Style
      const res = await axiosPrivate.get('/users');
      console.log('User Data:', res);

      if (res?.data) {
        setUsers(res?.data?.users || []); // ✅ array of users
        setTotal(res?.data?.count || 0); // ✅ total count
        // setTotal(res?.data?.users?.length || 0); // ✅ total count
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [axiosPrivate, page, perPage, roleFilter, searchTerm]);

  // 🔹 Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await axiosPrivate.get(
          `/users?page=${page}&perPage=${perPage}&role=${roleFilter}&search=${searchTerm}`,
        );
        setUsers(res.data.users);
        setTotal(res.data.total);
        setTotalPage(res.data.totalPage);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [page, roleFilter, searchTerm, axiosPrivate, perPage]);

  return (
    <div className='min-h-screen p-6 space-y-6 bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-200'>
      {/* ===== 🔹 Header ===== */}
      <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight text-white'>
            Users Management
          </h1>
          <p className='text-sm text-slate-400'>
            View and manage all system users
          </p>
        </div>

        {/* ===== 📊 Stats Card ===== */}
        <div className='flex items-center gap-4 px-5 py-3 rounded-2xl bg-linear-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-white/10 backdrop-blur-md shadow-lg'>
          <div className='flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400'>
            <Users size={22} />
          </div>
          <div>
            <p className='text-xs uppercase text-slate-400'>Total Users</p>
            <p className='text-2xl font-bold text-white'>{total}</p>
          </div>
        </div>
      </div>

      {/* ===== 🔍 Filters & ➕ Add Button ===== */}
      <div className='flex flex-col gap-4 p-4 rounded-2xl bg-slate-900/60 border border-white/10 md:flex-row md:items-center md:justify-between'>
        <div className='flex gap-3'>
          {/* Search input */}
          <input
            type='text'
            placeholder='Search users...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='px-4 py-2 text-sm rounded-xl bg-slate-800/60 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500'
          />

          {/* Role filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className='px-4 py-2 text-sm rounded-xl bg-slate-800/60 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500'
          >
            <option value='all'>All Roles</option>
            <option value='admin'>Admin</option>
            <option value='manager'>Manager</option>
            <option value='user'>User</option>
          </select>
        </div>

        {/* ➕ Add User Button (Admin Only) */}
        {isAdmin && (
          <>
            {' '}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className='px-5 py-2 text-sm font-medium text-white rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 hover:opacity-90 transition shadow-md'
            >
              + Add User
            </button>
            <Button
              variant='outline'
              className='border-blue-600 text-blue-600 hover:bg-blue-50'
              onClick={() => {
                // example: modal open
                // setIsAddModalOpen(true);

                // demo refresh
                setRefresh((prev) => !prev);
              }}
            >
              Refresh
            </Button>
          </>
        )}
      </div>

      {/* ===== 🗃 Users Table ===== */}
      <div className='p-6 rounded-2xl bg-slate-900/60 border border-white/10'>
        {loading ? (
          <UsersSkeleton />
        ) : (
          <UsersTable
            users={users}
            isAdmin={isAdmin}
            onView={(u) => {
              setSelectedUser(u);
              setIsViewModalOpen(true);
            }} // 👁
            onEdit={(u) => {
              setSelectedUser(u);
              setIsEditModalOpen(true);
            }} // ✏️
            onDelete={(u) => {
              setSelectedUser(u);
              setIsDeleteModalOpen(true);
            }} // 🗑
          />
        )}
      </div>

      {/* ===== 🔢 Pagination ===== */}
      {!loading && (
        <Pagination
          page={page}
          totalPage={totalPage}
          setPage={setPage}
        />
      )}

      {/* ===== 📝 Modals ===== */}

      {/* ➕ Add User Modal */}
      {isAddModalOpen && (
        <Modal
          open={isAddModalOpen}
          title='Add User'
          onClose={() => setIsAddModalOpen(false)}
        >
          <p>Add user form here...</p>
        </Modal>
      )}

      {/* ✏️ Edit User Modal */}
      {isEditModalOpen && (
        <Modal
          open={isEditModalOpen}
          title='Edit User'
          onClose={() => setIsEditModalOpen(false)}
        >
          <p>Edit user form here...</p>
        </Modal>
      )}

      {/* 🗑 Delete User Modal */}
      {isDeleteModalOpen && (
        <Modal
          open={isDeleteModalOpen}
          title='Delete User'
          onClose={() => setIsDeleteModalOpen(false)}
        >
          <p>
            Are you sure you want to delete <b>{selectedUser?.name}</b>?
          </p>
          <div className='mt-4 flex justify-end gap-2'>
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className='px-4 py-2 rounded bg-slate-700'
            >
              Cancel
            </button>
            <button className='px-4 py-2 rounded bg-red-600 text-white'>
              Delete
            </button>
          </div>
        </Modal>
      )}

      {/* 👁 View User Modal */}
      {isViewModalOpen && (
        <Modal
          open={isViewModalOpen}
          title='User Details'
          onClose={() => setIsViewModalOpen(false)}
        >
          <p>Name: {selectedUser?.name}</p>
          <p>Email: {selectedUser?.email}</p>
          <p>
            Role: <RoleBadge role={selectedUser?.role || ''} />
          </p>
        </Modal>
      )}
    </div>
  );
};

export default UsersPage;
