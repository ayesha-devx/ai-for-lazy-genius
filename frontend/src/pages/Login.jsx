import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { LogIn, Mail, Lock, Loader2 } from 'lucide-react';
import useAuthStore from '@/store/authStore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-800"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full mb-4">
            <LogIn size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h2>
          <p className="text-gray-500 dark:text-zinc-400 mt-2">Log in to your account to continue</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg text-sm mb-6 border border-red-100 dark:border-red-900/30"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <Mail size={18} />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-zinc-700 rounded-xl bg-gray-50 dark:bg-zinc-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <Lock size={18} />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-zinc-700 rounded-xl bg-gray-50 dark:bg-zinc-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : <LogIn className="mr-2" size={20} />}
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500 dark:text-zinc-400">
          Don't have an account?{' '}
          <Link to="/signup" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
