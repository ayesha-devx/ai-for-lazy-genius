import React from 'react';
import { Heart, MessageCircle, Bookmark, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import useAuthStore from '@/store/authStore';

export const IconButton = ({ icon: Icon, label, count, onClick, className = "", isActive = false, activeColor = "red" }) => {
  const colorClasses = {
    red: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/30",
    indigo: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/30"
  };

  const iconClasses = {
    red: "fill-red-500 text-red-500",
    indigo: "fill-indigo-500 text-indigo-500"
  };

  return (
    <motion.button 
      onClick={onClick}
      aria-label={label}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all group ${
        isActive 
          ? colorClasses[activeColor]
          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-indigo-600 dark:hover:bg-indigo-600 hover:text-white"
      } ${className}`}
    >
      <Icon className={`w-5 h-5 group-hover:scale-110 transition-transform ${isActive ? iconClasses[activeColor] : ""}`} />
      {count !== undefined && <span>{count}</span>}
    </motion.button>
  );
};

export const SidebarAction = ({ icon: Icon, label, count, onClick, isActive = false, activeColor = "red" }) => {
  const colorClasses = {
    red: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/30",
    indigo: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/30"
  };

  const iconClasses = {
    red: "fill-red-500 text-red-500",
    indigo: "fill-indigo-500 text-indigo-500"
  };

  return (
    <motion.button 
      onClick={onClick}
      className="flex flex-col items-center gap-1 group" 
      aria-label={label}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <div className={`p-4 rounded-full shadow-md border transition-all ${
        isActive 
          ? colorClasses[activeColor]
          : "bg-white dark:bg-gray-800 dark:border-gray-700 group-hover:text-indigo-600 group-hover:-translate-y-1"
      }`}>
        <Icon className={`w-6 h-6 ${isActive ? iconClasses[activeColor] : ""}`} />
      </div>
      {count !== undefined && <span className="text-[10px] font-bold text-gray-400">{count}</span>}
    </motion.button>
  );
};

const ArticleEngagement = ({ blog, onLike, onBookmark, onCommentClick, commentCount }) => {
  const { user } = useAuthStore();
  
  // Safe comparison logic using .toString()
  const isLiked = blog?.likes?.some(uid => uid.toString() === user?._id?.toString());
  const isBookmarked = user?.bookmarks?.some(bid => bid.toString() === (blog?._id || blog?.id)?.toString());

  return (
    <motion.aside 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      className="hidden lg:block sticky top-32 h-fit"
    >
      <div className="flex flex-col items-center gap-6">
        <SidebarAction 
          icon={Heart} 
          label="Like" 
          count={blog?.likes?.length || 0} 
          onClick={onLike}
          isActive={isLiked}
          activeColor="red"
        />
        <SidebarAction 
          icon={MessageCircle} 
          label="Comment" 
          count={commentCount !== undefined ? commentCount : "--"} 
          onClick={onCommentClick}
        />
        <SidebarAction 
          icon={Bookmark} 
          label="Bookmark" 
          onClick={onBookmark}
          isActive={isBookmarked}
          activeColor="indigo"
        />
        <div className="w-px h-12 bg-gray-100 dark:bg-gray-800" />

      </div>
    </motion.aside>
  );
};

export default ArticleEngagement;
