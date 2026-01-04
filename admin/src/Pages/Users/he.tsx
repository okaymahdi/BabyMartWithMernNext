import useAxiosPrivate from '@/Hooks/useAxiosPrivate';
import useAuthStore from '@/Store/UseAuthStore';
import type { User } from '@/lib/Types/UserTypes';
import { useEffect, useState } from 'react';

import { Pagination } from '@/Components/AIUsers/Pagination';
import { UsersSkeleton } from '@/Components/Users/UsersSkeleton';
import { UsersTable } from '@/Components/AIUsers/UsersTable';
import { Modal } from '@/Components/ui/Modal';

const UsersPage = () => {
  const axiosPrivate = useAxiosPrivate();
  const { checkIsAdmin } = useAuthStore();
  const isAdmin = checkIsAdmin();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // 🔹 Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const res = await axiosPrivate.get(`/users?page=${page}`);
      setUsers(res.data.users);
      setTotalPage(res.data.totalPage);
      setLoading(false);
    };

    fetchUsers();
  }, [page, axiosPrivate]);

  return (
    <div className='space-y-6 p-6'>
      {/* Users Table */}
      {loading ? (
        <UsersSkeleton />
      ) : (
        <>
          <UsersTable
            users={users}
            isAdmin={isAdmin}
            onView={(u) => {
              setSelectedUser(u);
              setViewOpen(true);
            }}
            onEdit={(u) => {
              setSelectedUser(u);
              setEditOpen(true);
            }}
            onDelete={(u) => {
              setSelectedUser(u);
              setDeleteOpen(true);
            }}
          />

          <Pagination
            page={page}
            totalPage={totalPage}
            setPage={setPage}
          />
        </>
      )}

      {/* 🔍 View Modal */}
      <Modal
        open={viewOpen}
        title='User Details'
        onClose={() => setViewOpen(false)}
      >
        <p>Name: {selectedUser?.name}</p>
        <p>Email: {selectedUser?.email}</p>
        <p>Role: {selectedUser?.role}</p>
      </Modal>

      {/* ✏️ Edit Modal */}
      <Modal
        open={editOpen}
        title='Edit User'
        onClose={() => setEditOpen(false)}
      >
        <p>Edit form here...</p>
      </Modal>

      {/* 🗑 Delete Modal */}
      <Modal
        open={deleteOpen}
        title='Delete User'
        onClose={() => setDeleteOpen(false)}
      >
        <p>
          Are you sure you want to delete <b>{selectedUser?.name}</b>?
        </p>

        <div className='mt-4 flex justify-end gap-2'>
          <button
            onClick={() => setDeleteOpen(false)}
            className='px-4 py-2 rounded bg-slate-700'
          >
            Cancel
          </button>
          <button className='px-4 py-2 rounded bg-red-600 text-white'>
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default UsersPage;



এটার মতো কমেন্ট সহ দাও