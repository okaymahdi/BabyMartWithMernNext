// components/Navbar/NavBar.tsx
// ====================================================
// Full Navbar Component (Single File)
// Features:
// 1. Logo
// 2. Main Navigation
// 3. Dashboard button (colorful linear)
// 4. Conditional Sign In / Sign Out
// 5. Desktop + Mobile responsive
// ====================================================

import { Button } from '@/Components/ui/button';
import { Logs, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router';

import Logo from '../../assets/Images/logo.png';

// ====================================================
// 1️⃣ Navigation Data
// ====================================================
type NavItem = { id: number; label: string; path: string };

const NAV_ITEMS: NavItem[] = [
  { id: 1, label: 'Home', path: '/' },
  { id: 2, label: 'Services', path: '/services' },
  { id: 3, label: 'Blogs', path: '/blogs' },
  { id: 4, label: 'Contact', path: '/contact' },
  { id: 5, label: 'Dashboard', path: '/dashboard' },
  { id: 6, label: 'Sign In', path: '/signin' },
  { id: 7, label: 'Sign Up', path: '/signup' },
];

// Split links for easier use
const NAV_LINKS = {
  main: NAV_ITEMS.slice(0, 4), // Home, Services, Blogs, Contact
  dashboard: NAV_ITEMS[4], // Dashboard
  auth: NAV_ITEMS.slice(5), // Sign In, Sign Up
};

// ====================================================
// 2️⃣ Full Navbar Component
// ====================================================
const NavBar = () => {
  const [open, setOpen] = useState(false); // Mobile menu toggle
  const [stickNav, setStickNav] = useState(false); // Sticky on scroll
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Authentication state

  // Sticky navbar on scroll
  const handleScroll = useCallback(() => {
    setStickNav(window.scrollY > 100);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : 'auto';
  }, [open]);

  // NavLink styling
  const baseLink =
    'font-medium transition-colors duration-300 flex items-center';
  const getLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `${baseLink} ${
      isActive ? 'text-purple-600' : 'text-indigo-400 hover:text-purple-600'
    }`;

  // ---------------- Mobile links ----------------
  // Create mobile links array: main + dashboard + conditional auth
  const mobileLinks = [
    ...NAV_LINKS.main, // Main links: Home, Services, Blogs, Contact
    NAV_LINKS.dashboard, // Dashboard always visible
    ...(isLoggedIn ? [] : [NAV_LINKS.auth[0]]), // Sign In only if not logged in
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-75
        ${stickNav ? 'bg-background shadow-lg' : 'bg-background'}`}
    >
      <div className='max-w-7xl mx-auto px-6 py-4 flex justify-between items-center'>
        {/* ================= Left: Logo + Mobile toggle ================= */}
        <div className='flex items-center justify-between md:justify-start w-full md:w-auto gap-4'>
          {/* Logo */}
          <Link
            to={'/'}
            className='flex items-center'
          >
            <img
              src={Logo}
              alt='Logo'
              className='w-52 mr-2'
            />
          </Link>

          {/* Mobile menu toggle button */}
          <button
            className='md:hidden p-2 rounded-md hover:bg-gray-700 transition'
            onClick={() => setOpen((prev) => !prev)}
            aria-label='Toggle navigation menu'
            aria-expanded={open}
          >
            {open ? <X /> : <Logs />}
          </button>
        </div>

        {/* ================= Center: Main navigation (Desktop) ================= */}
        <nav className='hidden md:flex space-x-6'>
          {NAV_LINKS.main.map((route) => (
            <NavLink
              key={route.id}
              to={route.path}
              className={getLinkClasses}
            >
              {route.label}
            </NavLink>
          ))}
        </nav>

        {/* ================= Right: Dashboard + Auth buttons (Desktop) ================= */}
        <div className='hidden md:flex items-center gap-4'>
          {/* Dashboard always visible - colorful linear button */}
          <NavLink
            to={NAV_LINKS.dashboard.path}
            className='bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-semibold hover:scale-105 transition transform'
          >
            {NAV_LINKS.dashboard.label}
          </NavLink>

          {/* Sign In / Sign Out conditional */}
          {isLoggedIn ? (
            <Button
              onClick={() => setIsLoggedIn(false)}
              className='text-white bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition'
            >
              Sign Out
            </Button>
          ) : (
            <NavLink
              to={NAV_LINKS.auth[0].path}
              className={getLinkClasses}
            >
              <Button>{NAV_LINKS.auth[0].label}</Button>
            </NavLink>
          )}
        </div>
      </div>

      {/* ================= Mobile Menu ================= */}
      {open && (
        <div className='md:hidden bg-background shadow-lg fixed top-20 left-0 h-screen w-full'>
          <nav className='flex flex-col items-center gap-4 py-4'>
            {mobileLinks.map((route) => {
              // Dashboard colorful button
              if (route.label === 'Dashboard') {
                return (
                  <NavLink
                    key={route.id}
                    to={route.path}
                    onClick={() => setOpen(false)}
                    className='w-3/4 flex justify-center'
                  >
                    <Button className='w-full py-2 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold hover:scale-105 transition transform'>
                      {route.label}
                    </Button>
                  </NavLink>
                );
              }

              // Sign In conditional - skip if logged in
              if (route.label === 'Sign In' && isLoggedIn) return null;

              // Sign In button for mobile
              if (route.label === 'Sign In' && !isLoggedIn) {
                return (
                  <NavLink
                    key={route.id}
                    to={route.path}
                    onClick={() => setOpen(false)}
                    className='w-3/4 flex justify-center'
                  >
                    <Button className='w-full py-2'>{route.label}</Button>
                  </NavLink>
                );
              }

              // Normal link
              return (
                <NavLink
                  key={route.id}
                  to={route.path}
                  onClick={() => setOpen(false)}
                  className={getLinkClasses}
                >
                  {route.label}
                </NavLink>
              );
            })}

            {/* Sign Out button for mobile if logged in */}
            {isLoggedIn && (
              <Button
                onClick={() => {
                  setIsLoggedIn(false);
                  setOpen(false);
                }}
                className='text-white bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition w-3/4 text-center'
              >
                Sign Out
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default NavBar;
