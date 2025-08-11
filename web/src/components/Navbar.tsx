import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  // Simple NavLink wrappers for clarity
  const item = (to: string, label: string) => (
    <NavLink to={to} className={({isActive})=> isActive ? 'text-brand-400 border-b border-brand-500' : 'hover:text-brand-400'}>{label}</NavLink>
  );
  return (
    <header className="sticky top-0 z-10 backdrop-blur bg-neutral-950/70 border-b border-neutral-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded bg-brand-500" />
          <Link to="/" className="font-bold">Sight Tech</Link>
        </div>
        <nav className="hidden md:flex gap-6 text-sm text-neutral-300">
          {item('/repairs','Repairs')}
          {item('/sales','Sales')}
          {item('/software','Software')}
          {item('/contact','Contact')}
          {item('/about','About')}
          {user ? (
            <>
              <NavLink to="/dashboard" className={({isActive})=> isActive ? 'text-brand-400 border-b border-brand-500' : 'hover:text-brand-400'}>Dashboard</NavLink>
              {user.role === 'admin' && <NavLink to="/admin" className={({isActive})=> isActive ? 'text-brand-400 border-b border-brand-500' : 'hover:text-brand-400'}>Admin</NavLink>}
              <button className="text-neutral-400 hover:text-neutral-200" onClick={()=>{logout(); nav('/');}}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({isActive})=> isActive ? 'text-brand-400 border-b border-brand-500' : 'hover:text-brand-400'}>Login</NavLink>
              <NavLink to="/register" className={({isActive})=> isActive ? 'text-brand-400 border-b border-brand-500' : 'hover:text-brand-400'}>Register</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
