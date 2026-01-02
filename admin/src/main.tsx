import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { Toaster } from 'sonner';
import './index.css';
import AppRouter from './Routes/Router.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster
      richColors
      position='bottom-right'
      toastOptions={{ duration: 6000 }}
    />
    <AppRouter />
  </StrictMode>,
);
