import { createApiInstance } from './Config';

const api = createApiInstance();

export default api;

export {
  ADMIN_API_ENDPOINTS,
  buildAdminQueryParams,
  getAdminApiConfig,
} from './Config';
