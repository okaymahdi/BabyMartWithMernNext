// src/Pages/Users/hooks/useUsers.ts
import { useState, useEffect, useCallback } from 'react';
import type { User } from '@/lib/Types/UserTypes';
import useAxiosPrivate from '@/Hooks/useAxiosPrivate';
import { toast } from 'sonner';

export const useUsers = () => {
  const axiosPrivate = useAxiosPrivate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosPrivate.get('/users');
      setUsers(res.data.users || []);
      setTotal(res.data.count || 0);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load users!');
    } finally {
      setLoading(false);
    }
  }, [axiosPrivate]);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  return { users, setUsers, total, loading, fetchUsers };
};
