import React from 'react';
import { useAuth } from '../auth';
import { Navigate, Outlet } from 'react-router-dom';

export default function RequireAuth() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}
