import React from 'react';
import { cn } from '@/utils/cn';

const BlogSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 animate-pulse">
      <div className="aspect-video bg-gray-200 dark:bg-gray-700" />
      <div className="p-5 space-y-4">
        <div className="flex gap-2">
          <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
        </div>
        <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        <div className="space-y-2">
          <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-3 w-5/6 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        <div className="pt-4 border-t border-gray-50 dark:border-gray-700/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="space-y-1">
              <div className="h-2 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-2 w-10 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
          <div className="h-2 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    </div>
  );
};

export default BlogSkeleton;
