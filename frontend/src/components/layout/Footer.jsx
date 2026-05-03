import React from 'react';
import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';
import Subscribe from '../blog/Subscribe';
import lgIcon from '@/assets/lg icon.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 dark:bg-[#0B0F19] border-t border-slate-200 dark:border-white/5 transition-colors duration-500 relative overflow-hidden mt-auto">
      {/* Ambient Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-400/5 dark:bg-purple-600/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-400/5 dark:bg-indigo-600/10 rounded-full blur-[120px] -translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6 group inline-flex">
              <img src={lgIcon} alt="Lazy Genius Logo" className="w-10 h-10 object-contain group-hover:rotate-12 group-hover:scale-110 transition-all drop-shadow-md" />
              <span className="text-2xl font-black bg-gradient-to-r from-purple-700 via-purple-500 to-fuchsia-500 dark:from-purple-400 dark:via-purple-300 dark:to-fuchsia-400 bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent">
                Lazy Genius AI
              </span>
            </Link>
            <p className="text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed mb-8 font-medium">
              Simplifying the complex world of Artificial Intelligence for modern developers. 
              Built for those who value efficiency and high-level abstractions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white mb-6">Platform</h4>
            <ul className="space-y-4">
              <li><Link to="/" className="text-slate-500 dark:text-slate-400 font-medium hover:text-purple-600 dark:hover:text-purple-400 hover:translate-x-1 inline-block transition-all">Home</Link></li>
              <li><Link to="/feed" className="text-slate-500 dark:text-slate-400 font-medium hover:text-purple-600 dark:hover:text-purple-400 hover:translate-x-1 inline-block transition-all">Daily Feed</Link></li>
              <li><Link to="/blogs" className="text-slate-500 dark:text-slate-400 font-medium hover:text-purple-600 dark:hover:text-purple-400 hover:translate-x-1 inline-block transition-all">Explore Blogs</Link></li>
              <li><Link to="/dashboard" className="text-slate-500 dark:text-slate-400 font-medium hover:text-purple-600 dark:hover:text-purple-400 hover:translate-x-1 inline-block transition-all">Dashboard</Link></li>
              <li><Link to="/notes" className="text-slate-500 dark:text-slate-400 font-medium hover:text-purple-600 dark:hover:text-purple-400 hover:translate-x-1 inline-block transition-all">Smart Notes</Link></li>
              <li><Link to="/write" className="text-slate-500 dark:text-slate-400 font-medium hover:text-purple-600 dark:hover:text-purple-400 hover:translate-x-1 inline-block transition-all">Write Post</Link></li>
            </ul>
          </div>

          {/* Newsletter / Contact */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white mb-6">Join Us</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 font-medium">Get the latest AI insights delivered to your inbox.</p>
            <Subscribe />
          </div>

        </div>

        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row justify-between items-center text-sm font-medium text-slate-500 dark:text-slate-400 gap-4">
          <p>&copy; {currentYear} Lazy Genius AI. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
