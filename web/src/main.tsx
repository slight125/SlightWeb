import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import { AuthProvider } from './auth';
import './styles.css';
import Repairs from './pages/Repairs';
import Sales from './pages/Sales';
import Accessories from './pages/Accessories';
import Software from './pages/Software';
import Contact from './pages/Contact';
import About from './pages/About';
import Forgot from './pages/Forgot';
import Reset from './pages/Reset';

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/repairs', element: <Repairs /> },
  { path: '/sales', element: <Sales /> },
  { path: '/accessories', element: <Accessories /> },
  { path: '/software', element: <Software /> },
  { path: '/contact', element: <Contact /> },
  { path: '/about', element: <About /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/forgot', element: <Forgot /> },
  { path: '/reset', element: <Reset /> },
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/admin', element: <Admin /> }
]);

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
