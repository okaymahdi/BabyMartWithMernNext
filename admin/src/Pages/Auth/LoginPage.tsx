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
import { loginSchema } from '@/lib/validation';
import useAuthStore from '@/Store/UseAuthStore';
import { apiLogger } from '@/utils/apiLogger';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { LogIn } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { z } from 'zod';

// ---------------------------
// TypeScript type inferred from Zod schema
// ---------------------------
type FormData = z.infer<typeof loginSchema>;

// ---------------------------
// Form field configuration
// ---------------------------
const formFields: { name: keyof FormData; label: string; type: string }[] = [
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'password', label: 'Password', type: 'password' },
];

// ---------------------------
// LoginPage Component
// ---------------------------
const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const form = useForm<FormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // ---------------------------
  // Form submission handler
  // ---------------------------
  const onSubmit = async (data: FormData) => {
    if (isLoading) return;
    setIsLoading(true);

    // 🔥 actual async task
    const loginPromise = (async () => {
      const user = await login(data); // login must throw on error
      await new Promise((res) => setTimeout(res, 3000)); // spinner delay
      apiLogger({
        event: 'LOGIN',
        endpoint: '/auth/login',
        payload: data,
        response: useAuthStore.getState().user,
        success: true,
      });

      return user;
    })();

    try {
      toast.promise(loginPromise, {
        loading: '🌀 Signing you in...',
        success: () => {
          navigate('/dashboard'); // ✅ only on success
          console.log('login', data);
          return '🎉 Signed in successfully!';
        },
        error: (err: unknown) => {
          apiLogger({
            event: 'LOGIN',
            endpoint: '/auth/login',
            payload: data,
            error: err,
            success: false,
          });

          if (axios.isAxiosError(err))
            return err.response?.data?.message ?? 'Sign In failed!';
          if (err instanceof Error) return err.message;
          return '❌ Unable to sign in!';
        },
      });

      await loginPromise; // ✅ THIS controls loading
    } catch (error) {
      console.error('❌ Log In failed:', error);
    } finally {
      setIsLoading(false); // ✅ spinner stops at the right time
    }
  };

  return (
    <div className='min-h-screen w-full flex items-center justify-center bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500'>
      <motion.div
        className='w-full'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <Card className='w-full max-w-md mx-auto bg-white/95 backdrop-blur-sm shadow-xl border border-gray-200'>
          <CardHeader className='text-center space-y-2'>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <CardTitle className='text-3xl font-bold text-gray-800'>
                Admin Dashboard
              </CardTitle>
            </motion.div>
            <CardDescription className='text-gray-500'>
              Enter Your Credentials to Sign In
            </CardDescription>
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
                        <FormLabel className='text-sm font-medium text-gray-700'>
                          {formField.label}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder={
                              formField.name === 'password'
                                ? '********'
                                : `Enter your ${formField.label.toLowerCase()}`
                            }
                            type={formField.type}
                            disabled={isLoading}
                            className='border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-sm hoverEffect'
                          />
                        </FormControl>
                        <FormMessage>
                          {form.formState.errors[formField.name]?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                ))}

                <Button
                  type='submit'
                  disabled={isLoading} // ✅ disabled works now
                  className='w-full h-11 bg-violet-800 hover:bg-violet-900 disabled:opacity-60 disabled:cursor-not-allowed hoverEffect'
                >
                  {isLoading ? (
                    <>
                      <Spinner className='h-4 w-4 text-white animate-spin' />
                      Signing In...
                    </>
                  ) : (
                    <>
                      <LogIn className='h-4 w-4' />
                      Login
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>

          <CardFooter className='justify-center'>
            <p className='text-sm text-gray-500'>
              Don't have an account?{' '}
              <Link
                to='/register'
                className='text-violet-800 hover:text-violet-900 font-medium hover:underline hoverEffect'
              >
                Register
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;
