import api, { ADMIN_API_ENDPOINTS } from '@/Api/Api';
import { apiLogger } from '@/utils/apiLogger';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// --------------------
// User Type
// --------------------
export type AuthUser = {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user' | 'manager';
  addresses?: unknown[]; // optional, if you return addresses
};

// --------------------
// Zustand State
// --------------------
type AuthState = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;

  register: (userData: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) => Promise<void>;

  login: (credentials: { email: string; password: string }) => Promise<void>;

  logout: () => void;
  checkIsAdmin: () => boolean;
};

// --------------------
// Optional TypeScript interface for structured login response
// --------------------
interface LoginResponse {
  user: AuthUser;
  token: string;
}

// --------------------
// Zustand Store
// --------------------
const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // --------------------
      // REGISTER
      // --------------------
      register: async (userData) => {
        try {
          const response = await api.post(
            ADMIN_API_ENDPOINTS.REGISTER,
            userData,
          );

          apiLogger({
            event: 'REGISTER',
            endpoint: ADMIN_API_ENDPOINTS.REGISTER,
            payload: userData,
            response: response.data, // ✅ Include response for debugging
            success: true,
          });
        } catch (error: unknown) {
          apiLogger({
            event: 'REGISTER',
            endpoint: ADMIN_API_ENDPOINTS.REGISTER,
            payload: userData,
            error,
            success: false,
          });
          throw error; // throw to let UI handle error
        }
      },

      // --------------------
      // LOGIN
      // --------------------
      login: async (credentials) => {
        try {
          const response = await api.post<LoginResponse>(
            ADMIN_API_ENDPOINTS.LOGIN,
            credentials,
          );

          const responseData: unknown = response.data;

          let user: AuthUser;
          let token: string;

          // --------------------
          // Flexible response handling:
          // 1️⃣ { user: {...}, token } (new structure)
          // 2️⃣ { _id, ..., token } directly (old structure)
          // --------------------
          if (
            typeof responseData === 'object' &&
            responseData !== null &&
            'user' in responseData &&
            'token' in responseData
          ) {
            const data = responseData as LoginResponse;
            user = data.user;
            token = data.token;
          } else if (
            typeof responseData === 'object' &&
            responseData !== null &&
            '_id' in responseData &&
            'token' in responseData
          ) {
            const data = responseData as AuthUser & { token: string };
            user = {
              _id: data._id,
              name: data.name,
              email: data.email,
              avatar: data.avatar,
              role: data.role,
              addresses: data.addresses || [],
            };
            token = data.token;
          } else {
            // ❌ Invalid response → prevents login and dashboard access
            throw new Error('Invalid login response structure');
          }

          // --------------------
          // ✅ Update Zustand store
          // --------------------
          set({
            user,
            token,
            isAuthenticated: true,
          });

          // --------------------
          // ✅ Immediate localStorage update
          // --------------------
          // localStorage.setItem(
          //   'auth-storage',
          //   JSON.stringify({ state: { user, token, isAuthenticated: true } }),
          // );

          // --------------------
          // ✅ Logger with full response
          // --------------------
          apiLogger({
            event: 'LOGIN',
            endpoint: ADMIN_API_ENDPOINTS.LOGIN,
            payload: credentials,
            response: { user, token },
            success: true,
          });
        } catch (error: unknown) {
          // --------------------
          // ✅ Failed login logging
          // --------------------
          apiLogger({
            event: 'LOGIN',
            endpoint: ADMIN_API_ENDPOINTS.LOGIN,
            payload: credentials,
            error,
            success: false,
          });

          // ❌ Throw error prevents navigation to dashboard
          throw error;
        }
      },

      // --------------------
      // LOGOUT
      // --------------------
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        localStorage.removeItem('auth-storage');
      },

      // --------------------
      // ADMIN CHECK
      // --------------------
      checkIsAdmin: () => {
        const { user } = get();
        return user?.role === 'admin';
      },
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => {
        console.log('Zustand auth rehydrated');
      },
    },
  ),
);

export default useAuthStore;
