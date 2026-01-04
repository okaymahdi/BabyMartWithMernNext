// src/lib/Types/UserTypes.ts
interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'manager';
  gender?: 'male' | 'female' | 'other';
  avatar?: string;
  createdAt: string;
}

// src/lib/Validation/CreateUserSchema.ts
import z from 'zod';

const CreateUserSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
  role: z.enum(['user', 'admin', 'manager']),
  gender: z.enum(['male', 'female', 'other']).optional(),
  avatar: z.string().optional(),
});

// Form data type from Zod schema
export type FormData = z.infer<typeof CreateUserSchema>;

export { CreateUserSchema };
export type { User };
