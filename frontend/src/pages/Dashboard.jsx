import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Send, Edit, Trash2, LayoutDashboard, Plus, Loader2, AlertCircle, Heart, MessageCircle, Flame, Target, BookOpen, Award } from 'lucide-react';
import blogService from '@/services/blogService';
import progressService from '@/services/progressService';
import { format } from 'date-fns';

const defaultImage = "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop";

const Dashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogData, progressData] = await Promise.all([
          blogService.getMyBlogs(),
          progressService.getProgress()
        ]);
        setBlogs(blogData);
        setProgress(progressData);
      } catch (err) {
        setError('Failed to load your dashboard. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await blogService.deleteBlog(id);
        setBlogs(blogs.filter(blog => blog._id !== id));
      } catch (err) {
        alert('Failed to delete blog.');
      }
    }
  };

  const drafts = blogs.filter(blog => blog.status === 'draft');
  const published = blogs.filter(blog => blog.status === 'published' || !blog.status);

  const totalLikes = published.reduce((acc, blog) => acc + (blog.likes?.length || 0), 0);
  const totalComments = published.reduce((acc, blog) => acc + (blog.comments?.length || 0), 0);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        <p className="text-gray-500 font-bold animate-pulse">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pt-0 pb-12 px-4 space-y-12">
      {/* Premium Header */}
      <div className="relative py-6 sm:py-8 px-6 sm:px-10 lg:px-12 bg-gradient-to-br from-purple-50 via-white to-fuchsia-50 dark:from-[#111827] dark:via-[#111827] dark:to-purple-900/10 rounded-[32px] mb-6 sm:mb-12 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-purple-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-8 z-10">
        
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-purple-400/20 dark:bg-purple-600/20 rounded-full blur-[80px] translate-x-1/3 -translate-y-1/3 pointer-events-none" />

        <div className="relative z-10">
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white flex items-center gap-3 tracking-tight">
            <LayoutDashboard className="text-purple-600 w-8 h-8 sm:w-10 sm:h-10" />
            Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-2 text-base sm:text-lg">
            Manage your thoughts and drafts
          </p>
        </div>
        
        <Link 
          to="/write"
          className="relative z-10 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-black shadow-xl shadow-purple-500/30 transition-all hover:-translate-y-1 group w-full sm:w-auto"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" />
          Write New Post
        </Link>
      </div>

      {/* User Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
        <div className="bg-purple-50/50 dark:bg-[#111827] p-4 sm:p-6 rounded-[24px] border border-purple-100/50 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-4 hover:-translate-y-1 transition-transform text-center sm:text-left">
          <div className="p-3 sm:p-4 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl">
            <Send size={20} className="sm:w-6 sm:h-6" />
          </div>
          <div>
            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mb-0.5 sm:mb-1">Published</p>
            <p className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white leading-none">{published.length}</p>
          </div>
        </div>
        
        <div className="bg-purple-50/50 dark:bg-[#111827] p-4 sm:p-6 rounded-[24px] border border-purple-100/50 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-4 hover:-translate-y-1 transition-transform text-center sm:text-left">
          <div className="p-3 sm:p-4 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl">
            <FileText size={20} className="sm:w-6 sm:h-6" />
          </div>
          <div>
            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mb-0.5 sm:mb-1">Drafts</p>
            <p className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white leading-none">{drafts.length}</p>
          </div>
        </div>

        <div className="bg-purple-50/50 dark:bg-[#111827] p-4 sm:p-6 rounded-[24px] border border-purple-100/50 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-4 hover:-translate-y-1 transition-transform text-center sm:text-left">
          <div className="p-3 sm:p-4 bg-rose-50 dark:bg-rose-500/10 text-rose-500 dark:text-rose-400 rounded-2xl">
            <Heart size={20} className="sm:w-6 sm:h-6" />
          </div>
          <div>
            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mb-0.5 sm:mb-1">Likes</p>
            <p className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white leading-none">{totalLikes}</p>
          </div>
        </div>

        <div className="bg-purple-50/50 dark:bg-[#111827] p-4 sm:p-6 rounded-[24px] border border-purple-100/50 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-4 hover:-translate-y-1 transition-transform text-center sm:text-left">
          <div className="p-3 sm:p-4 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-2xl">
            <MessageCircle size={20} className="sm:w-6 sm:h-6" />
          </div>
          <div>
            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mb-0.5 sm:mb-1">Comments</p>
            <p className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white leading-none">{totalComments}</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-2xl border border-red-100">
          <AlertCircle size={20} />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Learning Journey Section */}
      {progress && (
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 dark:border-zinc-800 pb-4">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <Award className="text-purple-600" size={24} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">Your Learning Journey</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Streak Card */}
            <div className="bg-purple-50/50 dark:bg-[#111827] p-6 rounded-[32px] border border-purple-100/50 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_20px_40px_rgb(0,0,0,0.2)] relative overflow-hidden group hover:-translate-y-1 transition-transform">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="flex items-start justify-between mb-8 relative z-10">
                <div className="p-4 bg-orange-500/10 text-orange-500 rounded-2xl">
                  <Flame size={28} />
                </div>
              </div>
              <div className="relative z-10">
                <p className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mb-1">Current Streak</p>
                <div className="flex items-end gap-2">
                  <p className="text-4xl font-black text-slate-900 dark:text-white leading-none">{progress.streakCount}</p>
                  <span className="text-slate-500 dark:text-slate-400 font-medium mb-1">Days</span>
                </div>
              </div>
            </div>

            {/* Weekly Goal Card */}
            <div className="bg-purple-50/50 dark:bg-[#111827] p-6 rounded-[32px] border border-purple-100/50 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_20px_40px_rgb(0,0,0,0.2)] relative overflow-hidden group hover:-translate-y-1 transition-transform">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="flex items-start justify-between mb-8 relative z-10">
                <div className="p-4 bg-blue-500/10 text-blue-500 rounded-2xl">
                  <Target size={28} />
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">{progress.weeklyCompleted}</span>
                  <span className="text-slate-500 dark:text-slate-400 font-bold"> / {progress.weeklyGoal}</span>
                </div>
              </div>
              <div className="relative z-10">
                <p className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mb-3">Weekly Goal</p>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 mb-2 overflow-hidden shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((progress.weeklyCompleted / progress.weeklyGoal) * 100, 100)}%` }}
                    className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                  />
                </div>
                <p className="text-right text-[10px] font-bold text-slate-500 uppercase tracking-wider">{Math.min(Math.round((progress.weeklyCompleted / progress.weeklyGoal) * 100), 100)}% Completed</p>
              </div>
            </div>

            {/* Articles Completed Card */}
            <div className="bg-purple-50/50 dark:bg-[#111827] p-6 rounded-[32px] border border-purple-100/50 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_20px_40px_rgb(0,0,0,0.2)] relative overflow-hidden group hover:-translate-y-1 transition-transform">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="flex items-start justify-between mb-8 relative z-10">
                <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-2xl">
                  <BookOpen size={28} />
                </div>
              </div>
              <div className="relative z-10">
                <p className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mb-1">Articles Completed</p>
                <p className="text-4xl font-black text-slate-900 dark:text-white leading-none">{progress.totalArticlesRead}</p>
              </div>
            </div>
          </div>

          {/* Badges Section */}
          <div className="bg-purple-50/50 dark:bg-[#111827] rounded-[32px] p-5 sm:p-8 border border-purple-100/50 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_20px_40px_rgb(0,0,0,0.2)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2 relative z-10">
              <Award className="text-purple-600 dark:text-purple-400" /> Achievements
            </h3>
            
            {progress.badges && progress.badges.length > 0 ? (
              <div className="flex flex-wrap gap-4 relative z-10">
                {progress.badges.map((badge, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-2 px-5 py-3 bg-purple-100/50 dark:bg-white/5 border border-purple-200/50 dark:border-white/10 rounded-2xl shadow-sm dark:shadow-[0_8px_16px_rgb(0,0,0,0.4)] backdrop-blur-md hover:-translate-y-1 transition-all"
                  >
                    <span className="text-xl">{badge.split(' ')[0]}</span>
                    <span className="font-bold text-slate-700 dark:text-white text-sm tracking-wider">{badge.substring(badge.indexOf(' ') + 1)}</span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-purple-100/50 dark:bg-white/5 border border-purple-200/50 dark:border-white/5 relative z-10 text-center">
                <p className="text-slate-500 dark:text-slate-400 font-medium">Complete articles and maintain streaks to earn badges!</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Drafts Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b border-gray-100 dark:border-zinc-800 pb-4">
          <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
            <FileText className="text-amber-600" size={24} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">Drafts ({drafts.length})</h2>
        </div>

        {drafts.length === 0 ? (
          <div className="bg-gray-50 dark:bg-zinc-900/50 rounded-3xl p-12 text-center border-2 border-dashed border-gray-100 dark:border-zinc-800">
            <p className="text-gray-400 font-bold">No drafts yet. Start writing something amazing!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drafts.map(blog => (
              <motion.div 
                key={blog._id}
                whileHover={{ y: -8 }}
                className="group relative flex flex-col bg-white dark:bg-[#111827] rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-200/80 dark:border-white/5 hover:shadow-[0_20px_40px_rgb(168,85,247,0.15)] hover:border-amber-300 dark:hover:border-amber-500/40 transition-all duration-500 h-full p-6"
              >
                <div className="flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 px-3 py-1.5 rounded-full">
                      Draft
                    </span>
                    <span className="text-xs text-slate-400 font-bold">
                      {format(new Date(blog.updatedAt), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors">
                    {blog.title || 'Untitled Draft'}
                  </h3>
                  <p className="text-slate-500 text-sm line-clamp-3 mb-6 leading-relaxed flex-grow">
                    {blog.content?.substring(0, 100) || 'No content yet...'}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-white/10">
                  <Link 
                    to={`/edit/${blog._id}`}
                    className="flex-grow flex items-center justify-center gap-2 bg-slate-50 dark:bg-white/5 hover:bg-amber-50 dark:hover:bg-amber-500/20 hover:text-amber-600 dark:hover:text-amber-400 text-slate-600 dark:text-slate-300 p-3 rounded-2xl transition-all"
                  >
                    <Edit size={16} />
                    <span className="text-xs font-black">Continue Editing</span>
                  </Link>
                  <button 
                    onClick={() => handleDelete(blog._id)}
                    className="p-3 bg-slate-50 dark:bg-white/5 hover:bg-rose-50 dark:hover:bg-rose-500/20 hover:text-rose-600 dark:hover:text-rose-400 text-slate-600 dark:text-slate-300 rounded-2xl transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Published Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b border-gray-100 dark:border-zinc-800 pb-4">
          <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
            <Send className="text-emerald-600" size={24} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">Published ({published.length})</h2>
        </div>

        {published.length === 0 ? (
          <div className="bg-gray-50 dark:bg-zinc-900/50 rounded-3xl p-12 text-center border-2 border-dashed border-gray-100 dark:border-zinc-800">
            <p className="text-gray-400 font-bold">You haven't published any blogs yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {published.map(blog => (
              <motion.div 
                key={blog._id}
                whileHover={{ y: -8 }}
                className="group relative flex flex-col bg-white dark:bg-[#111827] rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-200/80 dark:border-white/5 hover:shadow-[0_20px_40px_rgb(168,85,247,0.15)] hover:border-purple-300 dark:hover:border-purple-500/40 transition-all duration-500 h-full"
              >
                {/* Thumbnail */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={blog.image || defaultImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={blog.title} />
                  <div className="absolute top-4 left-4">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/90 backdrop-blur-md text-white px-3 py-1.5 rounded-full shadow-lg">
                      Published
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <span className="text-xs text-slate-400 font-bold mb-3">
                    {format(new Date(blog.createdAt), 'MMM dd, yyyy')}
                  </span>
                  <Link to={`/blog/${blog._id}`}>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                      {blog.title}
                    </h3>
                  </Link>
                  <p className="text-slate-500 text-sm line-clamp-2 mb-6 leading-relaxed flex-grow">
                    {blog.content?.substring(0, 100)}...
                  </p>
                  
                  {/* Stats Row */}
                  <div className="flex items-center gap-4 mb-4 text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Heart size={16} className={blog.likes?.length > 0 ? "text-rose-500 fill-rose-500" : ""} />
                      <span className="text-xs font-bold">{blog.likes?.length || 0}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MessageCircle size={16} />
                      <span className="text-xs font-bold">{blog.comments?.length || 0}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-white/10">
                    <Link 
                      to={`/edit/${blog._id}`}
                      className="flex-grow flex items-center justify-center gap-2 bg-slate-50 dark:bg-white/5 hover:bg-purple-50 dark:hover:bg-purple-500/20 hover:text-purple-600 dark:hover:text-purple-400 text-slate-600 dark:text-slate-300 p-3 rounded-2xl transition-all"
                    >
                      <Edit size={16} />
                      <span className="text-xs font-black">Edit</span>
                    </Link>
                    <button 
                      onClick={() => handleDelete(blog._id)}
                      className="p-3 bg-slate-50 dark:bg-white/5 hover:bg-rose-50 dark:hover:bg-rose-500/20 hover:text-rose-600 dark:hover:text-rose-400 text-slate-600 dark:text-slate-300 rounded-2xl transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
