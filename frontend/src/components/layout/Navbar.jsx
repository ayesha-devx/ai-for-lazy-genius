import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  Sun,
  Moon,
  Menu,
  X,
  PenSquare,
  BookOpen,
  Home as HomeIcon,
  Cpu,
  User,
  LogOut,
  Sparkles,
  Bell,
  LayoutDashboard,
  Brain,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '@/store/authStore';
import { useNotifications } from '@/hooks/useNotificationHooks';
import NotificationDropdown from './NotificationDropdown';
import { getRandomAvatar } from '@/utils/avatars';
import lgIcon from '@/assets/lg icon.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

  const [showNotifications, setShowNotifications] = useState(false);
  const {
    notifications,
    unreadCount,
    loading: notificationsLoading,
    markAsRead,
    markAllAsRead
  } = useNotifications(user);

  // Initialize theme from document class (which is set in index.html)
  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark'));

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/blogs?search=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue('');
      setIsOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/', Icon: HomeIcon },
    { name: 'Feed', path: '/feed', Icon: Sparkles, protected: true },
    { name: 'Blogs', path: '/blogs', Icon: BookOpen },
    { name: 'Dashboard', path: '/dashboard', Icon: LayoutDashboard, protected: true },
    { name: 'Notes', path: '/notes', Icon: Brain, protected: true },
    { name: 'Write', path: '/write', Icon: PenSquare, protected: true },
  ];

  const filteredLinks = navLinks.filter(link => !link.protected || isAuthenticated);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
        ? 'bg-white/80 dark:bg-[#0B0F19]/80 backdrop-blur-md border-b border-gray-200 dark:border-white/10 shadow-sm'
        : 'bg-transparent'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 group">
              <img src={lgIcon} alt="Lazy Genius Logo" className="w-9 h-9 object-contain group-hover:rotate-12 transition-transform drop-shadow-md" />
              <span className="text-xl font-black bg-gradient-to-r from-purple-700 via-purple-500 to-fuchsia-500 dark:from-purple-400 dark:via-purple-300 dark:to-fuchsia-400 bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent hidden sm:block">
                Lazy Genius AI
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {filteredLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive(link.path)
                    ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-purple-50 dark:hover:bg-white/5'
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search - Visible on desktop */}
            <form onSubmit={handleSearch} className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search..."
                className="pl-10 pr-4 py-1.5 w-40 lg:w-64 bg-gray-100 dark:bg-white/5 border border-transparent hover:border-gray-200 dark:hover:border-white/10 rounded-full text-xs focus:ring-2 focus:ring-purple-500 transition-all outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </form>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notifications Bell */}
            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`p-2 rounded-lg transition-all relative ${showNotifications
                      ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                      : 'hover:bg-purple-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400'
                    }`}
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {showNotifications && (
                    <NotificationDropdown
                      notifications={notifications}
                      loading={notificationsLoading}
                      onClose={() => setShowNotifications(false)}
                      onMarkRead={markAsRead}
                      onMarkAllRead={markAllAsRead}
                    />
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Auth Buttons */}
            <div className="hidden sm:flex items-center gap-2">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <Link to="/profile" className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-white dark:bg-[#111827] text-sm font-medium text-gray-700 dark:text-zinc-300 border border-gray-200 dark:border-white/10 hover:border-purple-300 dark:hover:border-purple-500/50 hover:shadow-md hover:shadow-purple-500/10 transition-all">
                    {user?.avatar && !user.avatar.includes('149071.png') ? (
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <img
                        src={getRandomAvatar(user?.name)}
                        alt="Avatar"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                    <span>{user?.name?.split(' ')[0]}</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                    title="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <>
                  <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-zinc-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                    Login
                  </Link>
                  <Link to="/signup" className="px-5 py-2 text-sm font-bold bg-purple-600 text-white rounded-full shadow-lg shadow-purple-500/20 hover:bg-purple-700 transition-all active:scale-95">
                    Join
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden border-b dark:border-gray-800 bg-white dark:bg-gray-900"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="px-4 mb-4 relative">
                <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </form>

              {filteredLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium ${isActive(link.path)
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                >
                  <link.Icon className="w-5 h-5" />
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 px-4 border-t dark:border-gray-800">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <Link 
                      to="/profile"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-transparent hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-white border border-gray-100 dark:border-gray-800 flex items-center justify-center">
                        {user?.avatar && !user.avatar.includes('149071.png') ? (
                          <img 
                            src={user.avatar.includes('dicebear.com') ? `${user.avatar}&backgroundColor=ffffff` : user.avatar} 
                            alt={user.name} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <img
                            src={getRandomAvatar(user?.name)}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-grow">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{user?.name}</p>
                        <p className="text-xs text-gray-500 dark:text-zinc-400">{user?.email}</p>
                      </div>
                      <ChevronRight size={16} className="text-gray-400" />
                    </Link>
                    <button
                      onClick={() => { logout(); setIsOpen(false); }}
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-red-600 font-bold hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                    >
                      <LogOut size={20} />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="w-full py-3 rounded-xl text-center font-bold text-gray-700 dark:text-zinc-300 border border-gray-200 dark:border-gray-700"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsOpen(false)}
                      className="w-full bg-indigo-600 text-white text-center py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/30"
                    >
                      Join Community
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
