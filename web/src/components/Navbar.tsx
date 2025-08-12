import React, { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logos/img1.jpg';
import { useAuth } from '../auth';
// Removed icon imports for brand typewriter (using only blinking caret)

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  // Simple NavLink wrappers for clarity
  const item = (to: string, label: string) => (
    <NavLink to={to} className={({isActive})=> isActive ? 'text-brand-400 border-b border-brand-500' : 'hover:text-brand-400'}>{label}</NavLink>
  );
  return (
    <>
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur bg-neutral-950/70 border-b border-neutral-800">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Slight Tech logo" className="h-12 w-12 md:h-14 md:w-14 rounded-xl object-cover shadow-lg shadow-brand-900/30" loading="eager" />
          <TypewriterBrand />
        </div>
        {/* Desktop nav */}
        <nav className="hidden md:flex gap-7 text-base md:text-lg text-neutral-200 font-medium">
          {item('/','Home')}
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
        {/* Mobile drawer trigger */}
        <div className="md:hidden">
          <label htmlFor="nav-drawer" className="btn btn-ghost btn-md text-neutral-200">Menu</label>
        </div>
      </div>
      {/* Drawer content */}
      <input id="nav-drawer" type="checkbox" className="drawer-toggle hidden" />
      <div className="drawer-side z-50">
        <label htmlFor="nav-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu p-4 w-72 min-h-full bg-neutral-950 text-neutral-200 border-r border-neutral-800">
          <li>{item('/','Home')}</li>
          <li>{item('/repairs','Repairs')}</li>
          <li>{item('/sales','Sales')}</li>
          <li>{item('/software','Software')}</li>
          <li>{item('/contact','Contact')}</li>
          <li>{item('/about','About')}</li>
          {user ? (
            <>
              <li><NavLink to="/dashboard">Dashboard</NavLink></li>
              {user.role === 'admin' && <li><NavLink to="/admin">Admin</NavLink></li>}
              <li><button onClick={()=>{logout(); nav('/');}}>Logout</button></li>
            </>
          ) : (
            <>
              <li><NavLink to="/login">Login</NavLink></li>
              <li><NavLink to="/register">Register</NavLink></li>
            </>
          )}
        </ul>
      </div>
    </header>
  {/* Spacer to offset the fixed header height on all pages */}
  <div className="h-20 md:h-24" aria-hidden />
  </>
  );
};

export default Navbar;

// --- Typewriter brand subcomponent ---
const TypewriterBrand: React.FC = () => {
  const text = 'Slight Tech';
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1); // 1 typing, -1 deleting
  const [pause, setPause] = useState(0);
  const display = useMemo(() => text.slice(0, index), [text, index]);
  const isTyping = dir === 1 && index < text.length;
  const isDeleting = dir === -1 && index > 0;
  const showCaret = isTyping || isDeleting;

  useEffect(() => {
    if (pause > 0) {
      const t = setTimeout(() => setPause(0), pause);
      return () => clearTimeout(t);
    }
    const typingSpeed = dir === 1 ? 110 : 60; // ms per step
    const t = setTimeout(() => {
      setIndex((i) => {
        const next = i + dir;
        if (next >= text.length) {
          setDir(-1);
          setPause(1000);
          return text.length;
        }
        if (next <= 0) {
          setDir(1);
          setPause(600);
          return 0;
        }
        return next;
      });
    }, typingSpeed);
    return () => clearTimeout(t);
  }, [dir, text, pause, index]);

  return (
    <Link to="/" aria-label="Slight Tech home" className="inline-flex items-center">
      <span className={"font-extrabold tracking-tight text-3xl md:text-4xl leading-none bg-clip-text text-transparent bg-gradient-to-r from-white to-brand-300 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)] " + (showCaret ? 'caret-blink' : '')}>
        {display || '\u200B'}
      </span>
    </Link>
  );
};
