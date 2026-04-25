import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rss, Users, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import blogService from '@/services/blogService';
import BlogCard from '@/components/blog/BlogCard';
import BlogSkeleton from '@/components/ui/BlogSkeleton';

/**
 * Feed Page
 * Displays a personalized feed of blogs from followed users.
 */
const Feed = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeed = async () => {
      setLoading(true);
      try {
        const data = await blogService.getPersonalizedFeed();
        setBlogs(data);
      } catch (err) {
        console.error('Failed to load feed:', err);
        setError('Unable to load your personalized feed. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-12">
      {/* Premium Header */}
      <div className="relative py-8 sm:py-10 px-5 sm:px-10 lg:px-12 bg-gradient-to-br from-purple-50 via-white to-fuchsia-50 dark:from-[#111827] dark:via-[#111827] dark:to-purple-900/10 rounded-[32px] mb-8 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-purple-100 dark:border-white/5">
        {/* Animated Background Mesh */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-400/20 dark:bg-purple-600/20 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3 animate-pulse pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-fuchsia-400/20 dark:bg-fuchsia-600/20 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3 animate-pulse pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-white/10 text-purple-700 dark:text-purple-300 font-black uppercase tracking-widest text-xs shadow-sm border border-purple-100 dark:border-purple-500/30 mb-2"
          >
            <Sparkles size={16} className="text-purple-500 animate-pulse" />
            <span>Curated For You</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-[56px] font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]"
          >
            Personalized <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-600 animate-gradient bg-[length:200%_auto] drop-shadow-sm">
              Feed
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium mt-2"
          >
            Insights and abstractions from the developers you follow, updated in real-time.
          </motion.p>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <BlogSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-2xl border border-red-100 dark:border-red-500/20">
             <Rss size={48} className="animate-pulse" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">{error}</h3>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-purple-600 text-white rounded-xl font-bold shadow-lg"
          >
            Try Again
          </button>
        </div>
      ) : blogs.length > 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {blogs.map((blog, index) => (
            <motion.div
              key={blog._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="h-full"
            >
              <BlogCard blog={blog} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <EmptyFeedState />
      )}
    </div>
  );
};

const EmptyFeedState = () => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center py-16 sm:py-24 text-center space-y-8 bg-purple-50/50 dark:bg-white/5 rounded-[40px] border border-dashed border-purple-200 dark:border-white/10 relative overflow-hidden"
  >
    <div className="absolute inset-0 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.03] dark:opacity-[0.05]" />
    
    <div className="relative z-10 p-8 rounded-[32px] bg-white dark:bg-slate-800 shadow-xl shadow-purple-500/10 border border-slate-100 dark:border-white/5">
      <Users size={64} className="text-purple-600 dark:text-purple-400" />
    </div>
    <div className="relative z-10 space-y-3 max-w-sm">
      <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
        Your Feed is Quiet
      </h3>
      <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
        Follow your favorite creators to see their latest insights and "Lazy Genius" summaries right here.
      </p>
    </div>
    <Link 
      to="/blogs" 
      className="relative z-10 flex items-center gap-2 px-8 py-4 bg-purple-600 text-white rounded-2xl font-black shadow-xl shadow-purple-500/30 hover:bg-purple-700 hover:-translate-y-1 transition-all group"
    >
      <span>Discover Creators</span>
      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
    </Link>
  </motion.div>
);

export default Feed;
