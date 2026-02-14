import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AdminApp } from './admin/AdminApp';
import { DeleteAccountView } from './views/DeleteAccountView';
import { registerSW } from 'virtual:pwa-register'

// Register the PWA service worker (skip on admin and delete-account to avoid cache conflicts)
if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/admin') && !window.location.pathname.startsWith('/delete-account')) {
  registerSW({
    onNeedRefresh() {
      if (confirm('New content available. Reload?')) {
        window.location.reload()
      }
    },
    onOfflineReady() {
      console.log('App ready to work offline')
    },
  })
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const isAdmin = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
const isDeleteAccount = typeof window !== 'undefined' && window.location.pathname.startsWith('/delete-account');

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    {isAdmin ? <AdminApp /> : isDeleteAccount ? <DeleteAccountView /> : <App />}
  </React.StrictMode>
);