interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'user' | 'manager';
  createdAt: string;
}

export type { User };
