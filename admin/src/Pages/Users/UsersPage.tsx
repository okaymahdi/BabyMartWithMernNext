// src/Pages/UsersPage.tsx
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/ui/select';
import { Spinner } from '@/Components/ui/spinner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/Components/ui/table';
import useAxiosPrivate from '@/Hooks/useAxiosPrivate';
import type { User } from '@/lib/Types/UserTypes';
import { cn } from '@/lib/utils';
import useAuthStore from '@/Store/UseAuthStore';
import { Edit, Eye, RefreshCcw, Search, Trash, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const UsersPage = () => {
  // 🔹 Users data state
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage] = useState(20);
  const [totalPage, setTotalPage] = useState(1);

  // 🔹 Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // 🔹 Loading & refresh
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // 🔹 Filters
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // 🔹 Axios + auth
  const axiosPrivate = useAxiosPrivate();
  const { checkIsAdmin } = useAuthStore();
  const isAdmin = checkIsAdmin();

  // 🔹 Fetch users
  const fetchUsers = async () => {
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
  };

  // 🔹 Refresh Control
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchUsers();
    } finally {
      setRefreshing(false);
    }
  };

  // 🔹 Effect (refresh যুক্ত)
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter User
  const handleFilteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Dynamic Role Colors
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'user':
        return 'bg-green-100 text-green-800';
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle View Users Details
  const handleView = () => {};

  // Handle Edit User Data
  const handleEdit = () => {};

  // Handle Delete User
  const handleDelete = () => {};

  return (
    <div className='p-5 space-y-5'>
      {/* ===== 🔹 Header ===== */}
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
            {loading ? (
              <Spinner className='animate-spin text-blue-600' />
            ) : (
              total
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
                + Add User
              </Button>
            </>
          )}
        </div>
      </div>

      {/* ===== 🔍 Search & Filter ===== */}
      <div>
        <div className='flex items-center gap-4 flex-wrap'>
          <div className='flex items-center gap-2'>
            <Search className='h-4 w-4 text-gray-500' />
            <Input
              placeholder='Search Users...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-64'
            />
          </div>
          <div>
            <Select
              value={roleFilter}
              onValueChange={setRoleFilter}
            >
              <SelectTrigger className='w-48'>
                <SelectValue placeholder='Filter By Role' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Role</SelectItem>
                <SelectItem value='admin'>Admin</SelectItem>
                <SelectItem value='manager'>Manager</SelectItem>
                <SelectItem value='user'>User</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* ===== 📊 Users Table / List ===== */}

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
            {handleFilteredUsers?.length > 0 ? (
              handleFilteredUsers?.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <div className='h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold shadow-sm overflow-hidden'>
                      {user?.avatar ? (
                        <img
                          src={user?.avatar}
                          alt={user?.name}
                          className='w-full h-full object-cover'
                        />
                      ) : (
                        <span className='text-lg'>
                          {user?.name?.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className='font-medium'>{user.name}</TableCell>
                  <TableCell className='text-gray-600'>{user.email}</TableCell>
                  <TableCell className='font-medium'>
                    <Badge
                      className={cn('capitalize', getRoleColor(user.role))}
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      <Button
                        variant={'ghost'}
                        size={'icon'}
                        onClick={() => handleView(user)}
                        title='View User Details'
                      >
                        <Eye className='h-4 w-4' />
                      </Button>
                      {isAdmin && (
                        <>
                          <Button
                            variant={'ghost'}
                            size={'icon'}
                            onClick={() => handleEdit(user)}
                            title='Edit User Details'
                          >
                            <Edit className='h-4 w-4' />
                          </Button>
                          <Button
                            variant={'ghost'}
                            size={'icon'}
                            onClick={() => handleDelete(user)}
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
                      <p className='text-sm text-gray-500 '>
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
    </div>
  );
};

export default UsersPage;
