// src/Pages/UsersPage.tsx

import { UserSkeleton } from '@/Components/Index';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/Components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/Components/ui/form';
import ImageUpload from '@/Components/ui/Image.upload';
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
import { apiLogger } from '@/utils/apiLogger';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import {
  Edit,
  Eye,
  Plus,
  RefreshCcw,
  Search,
  Trash,
  UserPlus,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm, type Path } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

// Zod Schema (Admin Create User)
const CreateUserSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
  role: z.enum(['user', 'admin', 'manager'], {
    message: 'Select a valid role',
  }),
  gender: z.enum(['male', 'female', 'other']).optional(),
  avatar: z.string().optional(),
});

type FormData = z.infer<typeof CreateUserSchema>;

// Form fields config
const formFields: { name: Path<FormData>; label: string; type: string }[] = [
  { name: 'name', label: 'Name', type: 'text' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'password', label: 'Password', type: 'password' },
  { name: 'role', label: 'Role', type: 'select' },
];

const UserField = () => {
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
  const [formLoading, setFormLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // 🔹 Filters
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // 🔹 Axios + auth
  const axiosPrivate = useAxiosPrivate();
  const { checkIsAdmin } = useAuthStore();
  const isAdmin = checkIsAdmin();

  // 🔹 Form hooks (must be at top level)
  const addForm = useForm<FormData>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'user',
      avatar: '', // 💡 add default value
    },
  });

  // 🔹 Fetch users
  const fetchUsers = async () => {
    setLoading(true); // 🦴 only first load

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
      setLoading(false);
    }
  };

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

  // 🔹 Effect (refresh যুক্ত)
  useEffect(() => {
    fetchUsers(); // 🦴 skeleton দেখাবে
  }, []);

  // 🔹 Filter User
  const handleFilteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // 🔹 Dynamic Role Colors
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

  // 🔹 Handle View Users Details
  const handleView = () => {};

  // 🔹 Handle Edit User Data
  const handleEditForm = useForm<FormData>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'user',
      avatar: '',
    },
  });

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    handleEditForm.reset({
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    });
    setIsEditModalOpen(true);
  };

  // 🔹 Handle Delete User
  const handleDelete = () => {};

  // 🔹 Handle Loading State
  if (loading) {
    return (
      <div>
        <UserSkeleton isAdmin={isAdmin} />
      </div>
    );
  }

  // 🔹 Handle Add User
  const handleAddUser = async (data: FormData) => {
    if (formLoading) return; // Prevent duplicate submits
    setFormLoading(true);

    const addUserPromise = (async () => {
      await axiosPrivate.post('/users', data);
    })();

    try {
      await toast.promise(addUserPromise, {
        loading: '⏳ Adding user...',
        success: () => {
          // Optionally: log success
          apiLogger({
            event: 'ADD_USER',
            endpoint: '/users',
            payload: data,
            response: 'User added successfully',
            success: true,
          });

          addForm.reset(); // Reset form fields
          handleRefresh(); // Refresh user list

          return '✅ User added successfully!';
        },
        error: (err) => {
          // Log error
          apiLogger({
            event: 'ADD_USER',
            endpoint: '/users',
            payload: data,
            error: err,
            success: false,
          });

          if (axios.isAxiosError(err))
            return err.response?.data?.message ?? '⚠️ Failed to add user!';
          if (err instanceof Error) return err.message;
          return '⚠️ Failed to add user!';
        },
      });

      await addUserPromise; // Ensure promise resolves
    } finally {
      setFormLoading(false);
    }
  };

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

      {/* ➕ Add User Modal */}
      <Dialog
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
      >
        <DialogContent className='sm:max-w-137.5 max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Add User</DialogTitle>
            <DialogDescription>Add a new user Account.</DialogDescription>
          </DialogHeader>
          <Form {...addForm}>
            <form
              onSubmit={addForm.handleSubmit(handleAddUser)}
              className='space-y-4'
            >
              {formFields.map((field) => (
                <FormField
                  key={field.name}
                  control={addForm.control}
                  name={field.name}
                  render={({ field: rhfField }) => (
                    <FormItem>
                      <FormLabel>{field.label}</FormLabel>
                      <FormControl>
                        {field.name === 'role' ? (
                          <Select
                            {...rhfField}
                            onValueChange={(val: FormData['role']) =>
                              rhfField.onChange(val)
                            }
                          >
                            <SelectTrigger className='w-full border-gray-300 rounded-lg focus:ring focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200'>
                              <SelectValue placeholder='Select role' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='user'>User</SelectItem>
                              <SelectItem value='admin'>Admin</SelectItem>
                              <SelectItem value='manager'>Manager</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            {...rhfField}
                            type={field.type}
                            placeholder={
                              field.type === 'password'
                                ? '********'
                                : `Enter ${field.label}`
                            }
                            disabled={formLoading}
                          />
                        )}
                      </FormControl>
                      <FormMessage>
                        {addForm.formState.errors[field.name]?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              ))}

              {/* ✅ Avatar Upload Conditional */}
              {isAddModalOpen && (
                <FormField
                  control={addForm.control}
                  name='avatar'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Avatar</FormLabel>
                      <FormControl>
                        <ImageUpload
                          value={field.value ?? ''}
                          onChange={field.onChange}
                          disabled={formLoading}
                        />
                      </FormControl>
                      <FormMessage>
                        {addForm.formState.errors['avatar']?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              )}

              <DialogFooter className='mt-6 flex justify-end gap-3'>
                <Button
                  type='button'
                  variant={'outline'}
                  onClick={() => setIsAddModalOpen(false)}
                  disabled={formLoading}
                  className='border-gray-300 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200'
                >
                  {formLoading ? (
                    <span className='flex items-center justify-center gap-2'>
                      <Spinner className='h-4 w-4 text-white' />
                      Creating...
                    </span>
                  ) : (
                    <span className='flex items-center justify-center gap-2'>
                      Cancel
                    </span>
                  )}
                </Button>
                <Button
                  type='submit'
                  disabled={formLoading}
                >
                  {formLoading ? (
                    <span className='flex items-center justify-center gap-2'>
                      <Spinner className='h-4 w-4 text-white' />
                      Creating...
                    </span>
                  ) : (
                    <span className='flex items-center justify-center gap-2'>
                      <UserPlus className='h-4 w-4' />
                      Create User
                    </span>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserField;
