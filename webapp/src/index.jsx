import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { SWRConfig } from 'swr';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ModalProvider } from './context/ModalContext';
import { NotificationProvider } from './context/NotificationContext';
import api from './api/axios';
import './styles/index.css';

// Configuración global de SWR
const swrConfig = {
  fetcher: (url) => api.get(url).then((res) => res.data),
  shouldRetryOnError: false,
  revalidateOnFocus: false,
};

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter
      future={{
        v7_startTransition: true,
      }}
    >
      <SWRConfig value={swrConfig}>
        <AuthProvider>
          <NotificationProvider>
            <ModalProvider>
              <App />
            </ModalProvider>
          </NotificationProvider>
        </AuthProvider>
      </SWRConfig>
    </BrowserRouter>
  </React.StrictMode>
);
