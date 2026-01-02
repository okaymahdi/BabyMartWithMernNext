import { Button } from '@/Components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Spinner } from '@/Components/ui/spinner';
import useAuthStore from '@/Store/UseAuthStore';
import { apiLogger } from '@/utils/apiLogger';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { UserPlus } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useForm, type Path, type SubmitHandler } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { z } from 'zod';

// -----------------------------
// Zod Schema
// -----------------------------
const RegisterSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
  role: z.enum(['user'], { message: 'Role is fixed for normal users' }), // 🔒 fixed role
  gender: z.enum(['male', 'female'], { message: 'Gender is required' }), // Added gender field
});

type FormData = z.infer<typeof RegisterSchema>;

// -----------------------------
// Form Fields Config
// -----------------------------
const formFields: {
  name: Path<FormData>;
  label: string;
  type: string;
}[] = [
  { name: 'name', label: 'Name', type: 'text' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'password', label: 'Password', type: 'password' },
  { name: 'role', label: 'Role', type: 'text' }, // fixed 'user'
  { name: 'gender', label: 'Gender', type: 'radio' }, // gender field (radio button)
];

// -----------------------------
// Register Page
// -----------------------------
const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register: registerUser } = useAuthStore();

  const form = useForm<FormData>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'user', // fixed role
      gender: 'male', // default gender as male
    },
  });

  // Watch gender value for conditional rendering
  const gender = form.watch('gender'); // Use watch to get current gender value

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (isLoading) return;
    setIsLoading(true);

    const { name, gender } = data; // Get name and gender from form data

    const registerPromise = (async () => {
      await registerUser(data);
      await new Promise((res) => setTimeout(res, 3000));
      apiLogger({
        event: 'REGISTER',
        endpoint: '/auth/register',
        payload: data,
        response: useAuthStore.getState().user,
        success: true,
      });
    })();

    try {
      toast.promise(registerPromise, {
        loading: '⏳ Creating your account...',
        success: () => {
          // Gender-based message
          const genderMessage =
            gender === 'male' ? 'Welcome, Sir!' : "Welcome, Ma'am!";

          // Returning the success message with user's name and gender-based message
          navigate('/login', { state: { email: data.email } });

          // This is the message shown in the toast
          return (
            <>
              <p>{`Account created successfully, ${name}! 🎉`}</p>
              <p>{genderMessage}</p>
            </>
          );
        },
        error: (err) => {
          apiLogger({
            event: 'REGISTER',
            endpoint: '/auth/register',
            payload: data,
            error: err,
            success: false,
          });
          if (axios.isAxiosError(err))
            return err.response?.data?.message ?? '⚠️ Registration failed';
          if (err instanceof Error) return err.message;
          return '⚠️ Registration failed';
        },
      });

      await registerPromise; // 🔥 await actual promise here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen w-full flex items-center justify-center bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500'>
      <motion.div
        className='w-full'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className='w-full max-w-md mx-auto bg-white shadow-xl'>
          <CardHeader className='text-center'>
            <CardTitle className='text-3xl font-bold'>
              Create an Account
            </CardTitle>
            <CardDescription>Enter your details to sign up</CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4'
              >
                {formFields.map((formField) => (
                  <FormField
                    key={formField.name}
                    control={form.control}
                    name={formField.name}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{formField.label}</FormLabel>
                        <FormControl>
                          {formField.name === 'role' ? (
                            <Input
                              {...field}
                              value='user'
                              disabled
                              className='cursor-not-allowed border-gray-300 bg-gray-100 text-gray-500'
                            />
                          ) : formField.name === 'gender' ? (
                            <div className='flex gap-4'>
                              <label className='inline-flex items-center'>
                                <input
                                  {...field}
                                  type='radio'
                                  value='male'
                                  checked={field.value === 'male'}
                                  className='form-radio text-blue-600'
                                />
                                <span className='ml-2'>Male</span>
                              </label>
                              <label className='inline-flex items-center'>
                                <input
                                  {...field}
                                  type='radio'
                                  value='female'
                                  checked={field.value === 'female'}
                                  className='form-radio text-pink-600'
                                />
                                <span className='ml-2'>Female</span>
                              </label>
                            </div>
                          ) : (
                            <Input
                              {...field}
                              type={formField.type}
                              placeholder={
                                formField.type === 'password'
                                  ? '********'
                                  : `Enter your ${formField.label.toLowerCase()}`
                              }
                              disabled={isLoading}
                            />
                          )}
                        </FormControl>
                        <FormMessage>
                          {form.formState.errors[formField.name]?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                ))}

                {/* Conditional Rendering based on Gender */}
                {gender === 'male' && (
                  <div className='mt-4 text-blue-600'>
                    {/* Male-specific content or image */}
                    <p>Welcome, Sir!</p>
                  </div>
                )}

                {gender === 'female' && (
                  <div className='mt-4 text-pink-600'>
                    {/* Female-specific content or image */}
                    <p>Welcome, Ma'am!</p>
                  </div>
                )}

                <Button
                  type='submit'
                  disabled={isLoading}
                  className='w-full h-11 bg-violet-800 hover:bg-violet-900 disabled:opacity-60 disabled:cursor-not-allowed'
                >
                  {isLoading ? (
                    <span className='flex items-center justify-center gap-2'>
                      <Spinner className='h-4 w-4 text-white' />
                      Signing Up...
                    </span>
                  ) : (
                    <span className='flex items-center justify-center gap-2'>
                      <UserPlus className='h-4 w-4' />
                      Register
                    </span>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>

          <CardFooter className='justify-center'>
            <p className='text-sm text-gray-500'>
              Already have an account?{' '}
              <Link
                to='/login'
                className='text-violet-800 font-medium hover:underline'
              >
                Login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
