import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please Enter a Valid Email Address!' }),
  password: z
    .string()
    .min(6, { message: 'Password Must be at least 6 Characters!' }),
});

export { loginSchema };
