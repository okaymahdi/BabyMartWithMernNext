// src/Components/Users/UsersTable.tsx
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/Components/ui/table';
import type { User } from '@/lib/Types/UserTypes';
import { cn } from '@/lib/utils';
import { Edit, Eye, Trash, Users } from 'lucide-react';

interface UsersTableProps {
  users: User[];
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  isAdmin?: boolean;
  searchTerm?: string;
  roleFilter?: string;
}

const UsersTable = ({
  users,
  onView,
  onEdit,
  onDelete,
  isAdmin = false,
  searchTerm = '',
  roleFilter = 'all',
}: UsersTableProps) => {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      case 'user':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleFilteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    console.log('users:', user);

    return matchesSearch && matchesRole;
  });

  return (
    <div className='bg-white rounded-lg shadow-sm border border-border overflow-hidden'>
      <Table>
        <TableHeader>
          <TableRow className='bg-gray-50'>
            <TableHead className='font-semibold'>Avatar</TableHead>
            <TableHead className='font-semibold'>Name</TableHead>
            <TableHead className='font-semibold'>Email</TableHead>
            <TableHead className='font-semibold'>Role</TableHead>
            <TableHead className='font-semibold'>Created At</TableHead>
            <TableHead className='font-semibold'>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {handleFilteredUsers.length > 0 ? (
            handleFilteredUsers.map((user) => (
              <TableRow key={user._id}>
                <TableCell>
                  <div className='h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold shadow-sm overflow-hidden'>
                    {user.avatar ? (
                      <img
                        src={
                          user.avatar.startsWith('http')
                            ? user.avatar
                            : `${import.meta.env.VITE_API_URL}${user.avatar}`
                        }
                        alt={user.name}
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      <span className='text-lg'>
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                </TableCell>

                <TableCell className='font-medium'>{user.name}</TableCell>
                <TableCell className='text-gray-600'>{user.email}</TableCell>
                <TableCell className='font-medium'>
                  <Badge className={cn('capitalize', getRoleColor(user.role))}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className='flex items-center gap-2'>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => onView(user)}
                      title='View User Details'
                    >
                      <Eye className='h-4 w-4' />
                    </Button>
                    {isAdmin && (
                      <>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => onEdit(user)}
                          title='Edit User Details'
                        >
                          <Edit className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => onDelete(user)}
                          title='Delete User!'
                          className='text-red-600 hover:text-red-700'
                        >
                          <Trash className='h-4 w-4' />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={6}
                className='text-center py-12'
              >
                <div className='flex flex-col items-center gap-4'>
                  <Users className='w-12 h-12 text-gray-400' />
                  <div>
                    <p className='text-lg font-medium text-gray-900'>
                      No users found.
                    </p>
                    <p className='text-sm text-gray-500'>
                      {searchTerm || roleFilter !== 'all'
                        ? 'Try Adjusting Your search or filters.'
                        : 'Users will Appear Here When They Registered.'}
                    </p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersTable;
