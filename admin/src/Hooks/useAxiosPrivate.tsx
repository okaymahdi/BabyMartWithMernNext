import api from '@/Api/Api';
import useAuthStore from '@/Store/UseAuthStore';
import { useEffect } from 'react';

const useAxiosPrivate = () => {
  const { logout } = useAuthStore();

  useEffect(() => {
    const responseIntercept = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error?.response?.status === 401) {
          logout();

          window.location.href = '/login';
        }

        return Promise.reject(error);
      },
    );
    return () => {
      api.interceptors.response.eject(responseIntercept);
    };
  }, [logout]);
  return api;
};

export default useAxiosPrivate;
