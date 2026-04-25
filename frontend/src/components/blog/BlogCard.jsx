import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Heart, Loader2, Bookmark, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDate } from '@/utils/formatDate';
import blogService from '@/services/blogService';
import useAuthStore from '@/store/authStore';
import { getRandomAvatar } from '@/utils/avatars';

const BlogCard = ({ blog }) => {
  const [blogData, setBlogData] = useState(blog);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated, updateUser } = useAuthStore();

  // Use _id for backend data
  const blogId = blogData._id || blogData.id;
  
  const isLiked = blogData.likes?.some(id => id.toString() === user?._id?.toString());
  const isBookmarked = user?.bookmarks?.some(id => id.toString() === blogId.toString());

  const handleLike = async (e) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    
    if (!isAuthenticated) {
      alert('Please login to like this post!');
      return;
    }

    setLoading(true);
    try {
      const updatedBlog = await blogService.likeBlog(blogId);
      setBlogData(updatedBlog);
    } catch (err) {
      console.error('Failed to like blog');
    } finally {
      setLoading(false);
    }
  };

  const stripMarkdown = (text) => {
    if (!text) return "";
    return text
      .replace(/[#*`~_]/g, '') 
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') 
      .replace(/!\[.*?\]\(.*?\)/g, '') 
      .trim();
  };

  const previewText = stripMarkdown(blogData.content || blogData.excerpt || "");

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      alert('Please login to save this post!');
      return;
    }

    try {
      const updatedBookmarks = await blogService.bookmarkBlog(blogId);
      updateUser({ ...user, bookmarks: updatedBookmarks });
    } catch (err) {
      console.error('Failed to bookmark');
    }
  };

  const defaultImage = "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop";
  const readingTime = "5 min read";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -12 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="h-full group"
    >
      <Link 
        to={`/blog/${blogId}`} 
        className="relative flex flex-col h-full bg-white/80 dark:bg-slate-900/40 backdrop-blur-xl rounded-[32px] overflow-hidden border border-slate-200/60 dark:border-white/5 shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500"
      >
        {/* Hover Glow Effect */}
        <div className="absolute -inset-[1px] bg-gradient-to-br from-purple-500/20 via-transparent to-blue-500/20 rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Thumbnail Section */}
        <div className="relative aspect-[16/10] overflow-hidden m-2 rounded-[24px]">
          <motion.img 
            src={blogData.image || defaultImage} 
            alt={blogData.title}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <div className="bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black text-white uppercase tracking-widest border border-white/10 flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              {blogData.readingTime || readingTime}
            </div>
          </div>

          <div className="absolute top-3 right-3">
             <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 duration-500">
                <ArrowUpRight size={16} />
             </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 flex flex-col flex-grow">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {blogData.tags?.length > 0 ? blogData.tags.slice(0, 2).map((tag) => (
              <span 
                key={tag} 
                className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg bg-purple-500/5 text-purple-600 dark:text-purple-400 border border-purple-500/10"
              >
                {tag}
              </span>
            )) : (
              <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg bg-slate-500/5 text-slate-500 border border-slate-500/10">
                AI Article
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-3 line-clamp-2 leading-tight tracking-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            {blogData.title}
          </h3>

          {/* Excerpt */}
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-6">
            {previewText}
          </p>

          {/* Footer Info */}
          <div className="mt-auto pt-5 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white dark:border-slate-800 shadow-sm ring-1 ring-slate-100 dark:ring-white/5">
                <img 
                  src={(blogData.author?.avatar && !blogData.author.avatar.includes('149071.png')) ? blogData.author.avatar : getRandomAvatar(blogData.author?.name || blogData.author)} 
                  alt={blogData.author?.name || 'Author'} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black text-slate-900 dark:text-white leading-none mb-1">
                  {blogData.author?.name || blogData.author || 'Lazy Genius'}
                </span>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">
                  {formatDate(blogData.createdAt || blogData.date)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={handleLike}
                disabled={loading}
                className={`p-2 rounded-xl transition-all duration-300 ${
                  isLiked 
                    ? "bg-red-500/10 text-red-500" 
                    : "text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-600 dark:hover:text-slate-200"
                }`}
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Heart size={18} className={isLiked ? "fill-red-500" : ""} />
                )}
              </button>

              <button 
                onClick={handleBookmark}
                className={`p-2 rounded-xl transition-all duration-300 ${
                  isBookmarked 
                    ? "bg-purple-500/10 text-purple-600 dark:text-purple-400" 
                    : "text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-purple-600"
                }`}
              >
                <Bookmark size={18} className={isBookmarked ? "fill-purple-600" : ""} />
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default BlogCard;
