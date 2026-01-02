// src/Components/Users/UsersTable.tsx
import type { User } from '@/lib/Types/UserTypes';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { RoleBadge } from './RoleBadge';

interface Props {
  users: User[];
  isAdmin: boolean;
  onView: (u: User) => void;
  onEdit: (u: User) => void;
  onDelete: (u: User) => void;
}

const UsersTable = ({
  users = [],
  isAdmin,
  onView,
  onEdit,
  onDelete,
}: Props) => {
  return (
    <div className='overflow-x-auto rounded-2xl border border-white/10'>
      <table className='w-full text-sm'>
        <thead className='bg-slate-800/60 text-slate-400'>
          <tr>
            <th className='px-4 py-3 text-left'>Name</th>
            <th className='px-4 py-3 text-left'>Email</th>
            <th className='px-4 py-3'>Role</th>
            <th className='px-4 py-3 text-right'>Actions</th>
          </tr>
        </thead>

        <tbody className='divide-y divide-white/5'>
          {users.map((user) => (
            <tr
              key={user._id}
              className='hover:bg-slate-800/40 transition'
            >
              <td className='px-4 py-3 font-medium text-white'>{user.name}</td>
              <td className='px-4 py-3 text-slate-300'>{user.email}</td>
              <td className='px-4 py-3 text-center'>
                <RoleBadge role={user.role} />
              </td>
              <td className='px-4 py-3'>
                <div className='flex justify-end gap-2'>
                  <button
                    onClick={() => onView(user)}
                    className='p-2 rounded-lg hover:bg-slate-700/50'
                  >
                    <Eye size={16} />
                  </button>

                  {isAdmin && (
                    <>
                      <button
                        onClick={() => onEdit(user)}
                        className='p-2 rounded-lg hover:bg-indigo-500/20 text-indigo-400'
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(user)}
                        className='p-2 rounded-lg hover:bg-red-500/20 text-red-400'
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export { UsersTable };
