import { Button } from '@/Components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/Components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/Components/ui/form';
import { Input } from '@/Components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/ui/select';
import { Spinner } from '@/Components/ui/spinner';

import useAuthStore from '@/Store/UseAuthStore';
import { apiLogger } from '@/utils/apiLogger';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { UserPlus } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useForm, type Path, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { z } from 'zod';

// ======================================================
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
});

type FormData = z.infer<typeof CreateUserSchema>;

// ======================================================
// Form fields config
const formFields: { name: Path<FormData>; label: string; type: string }[] = [
  { name: 'name', label: 'Name', type: 'text' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'password', label: 'Password', type: 'password' },
  { name: 'role', label: 'Role', type: 'select' },
];

// ======================================================
// Admin Create User Page
const CreateUserPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register: createUser, user: currentUser } = useAuthStore();
  const navigate = useNavigate();

  // Redirect non-admin users away
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/dashboard'); // only admin allowed
    }
  }, [currentUser, navigate]);

  const form = useForm<FormData>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'user',
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      await toast.promise(
        (async () => {
          try {
            await createUser(data); // Zustand store register
            apiLogger({
              event: 'ADMIN_CREATE_USER',
              endpoint: '/auth/register',
              payload: data,
              response: data,
              success: true,
            });
          } catch (error: unknown) {
            apiLogger({
              event: 'ADMIN_CREATE_USER',
              endpoint: '/auth/register',
              payload: data,
              error,
              success: false,
            });
            throw error;
          }
          await new Promise((res) => setTimeout(res, 2000));
        })(),
        {
          loading: 'Creating user...',
          success: 'User created successfully! 🎉',
          error: (err: unknown) => {
            if (axios.isAxiosError(err))
              return err.response?.data?.message ?? 'Creation failed!';
            if (err instanceof Error) return err.message;
            return 'Creation failed!';
          },
        },
      );

      form.reset(); // reset form after success
    } catch (error) {
      console.error('Create user failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen w-full flex items-center justify-center'>
      <motion.div
        className='w-full'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className='w-full max-w-md mx-auto bg-white shadow-xl'>
          <CardHeader className='text-center'>
            <CardTitle className='text-3xl font-bold'>
              Create New User
            </CardTitle>
            <CardDescription>Admin can create users here</CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4'
              >
                {formFields.map((field) => (
                  <FormField
                    key={field.name}
                    control={form.control}
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
                              <SelectTrigger>
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
                              disabled={isLoading}
                            />
                          )}
                        </FormControl>
                        <FormMessage>
                          {form.formState.errors[field.name]?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                ))}

                <Button
                  type='submit'
                  disabled={isLoading}
                  className='w-full h-11 bg-violet-800 hover:bg-violet-900 disabled:opacity-60 disabled:cursor-not-allowed'
                >
                  {isLoading ? (
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
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CreateUserPage;
