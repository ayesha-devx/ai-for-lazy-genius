import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

const AuthorCard = ({ author }) => {
  const authorName = author?.name || author || 'Unknown';
  const authorAvatar = author?.avatar;
  const initial = authorName.charAt(0);

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-32 pt-20 border-t border-gray-100 dark:border-gray-800/80"
    >
      <div className="relative p-8 md:p-12 bg-white dark:bg-gray-800 rounded-[48px] shadow-2xl shadow-indigo-500/5 border border-gray-100 dark:border-gray-700/50 flex flex-col md:flex-row items-center gap-10">
        <button 
          className="absolute top-0 right-0 p-8 text-gray-300 hover:text-gray-600 dark:hover:text-white transition-colors" 
          aria-label="More options"
        >
          <MoreHorizontal />
        </button>
        
        <div className="relative flex-shrink-0">
          <div className="absolute -inset-2 bg-gradient-to-tr from-indigo-600 to-pink-500 rounded-full blur opacity-20" />
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-5xl md:text-6xl text-indigo-600 dark:text-indigo-400 font-extrabold shadow-inner overflow-hidden">
            {authorAvatar ? (
              <img src={authorAvatar} alt={authorName} className="w-full h-full object-cover" />
            ) : (
              initial
            )}
          </div>
        </div>

        <div className="flex-grow text-center md:text-left">
          <span className="inline-block px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
            Staff Writer
          </span>
          <h4 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Meet {authorName}</h4>
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-lg max-w-2xl mb-8 font-medium">
            Distilling complex machine learning concepts into actionable, low-friction strategies. Creating the roadmap for the next generation of efficient builders.
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-bold hover:scale-105 transition-all shadow-xl shadow-gray-900/10"
            >
              Follow
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 border border-gray-200 dark:border-gray-700 rounded-2xl font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              View Profile
            </motion.button>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default AuthorCard;
