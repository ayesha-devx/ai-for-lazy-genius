import React from 'react';
import { motion } from 'framer-motion';

const ReadingProgressBar = ({ progress }) => (
  <div 
    className="fixed top-0 left-0 w-full h-1.5 bg-gray-100 dark:bg-gray-800 z-[100]" 
    role="progressbar" 
    aria-valuenow={progress} 
    aria-valuemin="0" 
    aria-valuemax="100"
  >
    <motion.div 
      className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ type: 'spring', stiffness: 300, damping: 30, restDelta: 0.001 }}
    />
  </div>
);

export default ReadingProgressBar;
