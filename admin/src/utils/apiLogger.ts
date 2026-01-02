import axios from 'axios';

// --------------------
// Types
// --------------------
type UserResponse = {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  addresses?: unknown[];
  token: string;
  createdAt: string;
  updatedAt: string;
};

type ApiResponse = {
  user?: UserResponse;
  [key: string]: unknown;
};

type ApiLoggerOptions = {
  event: string;
  endpoint?: string;
  payload?: Record<string, unknown>;
  response?: unknown; // Optional response for success
  error?: unknown;
  success?: boolean;
};

// --------------------
// Helper: Mask sensitive info
// --------------------
const maskSensitive = (data: unknown): unknown => {
  if (typeof data !== 'object' || data === null) return data;

  const cloned = structuredClone(data) as Record<string, unknown>;

  if ('token' in cloned) cloned.token = '***MASKED***';
  if ('password' in cloned) cloned.password = '***MASKED***';

  return cloned;
};

// --------------------
// Helper: Format user object exactly as frontend expects
// --------------------
const formatUserResponse = (user: UserResponse): UserResponse => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar || '',
  role: user.role,
  addresses: user.addresses || [],
  token: user.token || '',
  createdAt: new Date(user.createdAt).toLocaleString('en-BD', {
    timeZone: 'Asia/Dhaka',
  }),
  updatedAt: new Date(user.updatedAt).toLocaleString('en-BD', {
    timeZone: 'Asia/Dhaka',
  }),
});

// --------------------
// Main Logger
// --------------------
const apiLogger = ({
  event,
  endpoint = 'N/A',
  payload,
  response,
  error,
  success,
}: ApiLoggerOptions): void => {
  // -------------------- Time
  const time = new Date().toLocaleString('en-BD', {
    timeZone: 'Asia/Dhaka',
  });

  // -------------------- Resolve full endpoint
  let fullEndpoint = endpoint;
  try {
    const baseURL =
      (axios.defaults.baseURL as string | undefined) ??
      import.meta.env.VITE_API_URL;

    if (baseURL && endpoint !== 'N/A' && !endpoint.startsWith('http')) {
      fullEndpoint = `${baseURL}/api${
        endpoint.startsWith('/') ? endpoint : `/${endpoint}`
      }`;
    }
  } catch {
    // silent fallback
  }

  // -------------------- Default success
  success = success ?? !error;

  // -------------------- Error analysis
  let reason = 'Unknown error';
  let status: number | string = 'N/A';
  let backendMessage = 'N/A';

  if (axios.isAxiosError(error)) {
    status = error.response?.status ?? 'N/A';
    backendMessage =
      error.response?.data?.message ??
      (typeof error.response?.data === 'object'
        ? JSON.stringify(error.response?.data)
        : error.response?.data ?? 'N/A');

    switch (status) {
      case 400:
        reason = 'Bad Request → Invalid or missing fields';
        break;
      case 401:
        reason = 'Unauthorized → Invalid credentials or token expired';
        break;
      case 403:
        reason = 'Forbidden → No permission';
        break;
      case 404:
        reason = 'Not Found → Wrong API endpoint';
        break;
      case 500:
        reason = 'Server Error → Backend crashed';
        break;
      default:
        reason = 'Unhandled HTTP error';
    }
  } else if (error instanceof Error) {
    reason = error.message;
  }

  // -------------------- Pretty console output
  console.group(
    `%c${success ? '✅ SUCCESS' : '❌ FAILED'} : ${event}`,
    `color:${success ? 'green' : 'red'}; font-weight:bold;`,
  );

  console.log('🕒 Time       :', time);
  console.log('🎯 Endpoint   :', fullEndpoint);

  if (payload) {
    console.log('📦 Payload    :', maskSensitive(payload));
  }

  if (success && response) {
    // Type-safe user response formatting
    const res = response as ApiResponse;
    if (res.user) {
      console.log('📥 Response   :', formatUserResponse(res.user));
    } else if (res && typeof res === 'object' && '_id' in res) {
      console.log('📥 Response   :', formatUserResponse(res as UserResponse));
    } else {
      console.log('📥 Response   :', maskSensitive(response));
    }
  }

  if (!success) {
    console.log('📛 Status     :', status);
    console.log('❗ Reason     :', reason);
    console.log('🧠 Backend Msg:', backendMessage);
  }

  console.groupEnd();
};

export { apiLogger };
