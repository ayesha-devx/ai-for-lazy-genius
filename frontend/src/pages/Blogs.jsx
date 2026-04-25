import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useBlogs } from '@/hooks/useBlogHooks';
import BlogCard from '@/components/blog/BlogCard';
import BlogSkeleton from '@/components/ui/BlogSkeleton';
import { AlertCircle, RefreshCw, Search, Tag, X, ChevronDown, Filter } from 'lucide-react';
import Container from '@/components/ui/Container';

const CATEGORIES = ['AI Basics', 'Tools', 'Projects', 'Tutorials'];

const Blogs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const initialSearch = searchParams.get('search') || '';
  const initialTag = searchParams.get('tag') || '';
  const initialCategory = searchParams.get('category') || '';
  const initialSort = searchParams.get('sort') || 'latest';

  const [search, setSearch] = useState(initialSearch);
  const [selectedTag, setSelectedTag] = useState(initialTag);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sort, setSort] = useState(initialSort);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);

  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    const urlTag = searchParams.get('tag') || '';
    const urlCategory = searchParams.get('category') || '';
    const urlSort = searchParams.get('sort') || 'latest';
    
    setSearch(urlSearch);
    setDebouncedSearch(urlSearch);
    setSelectedTag(urlTag);
    setSelectedCategory(urlCategory);
    setSort(urlSort);
  }, [searchParams]);

  useEffect(() => {
    const params = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (selectedTag) params.tag = selectedTag;
    if (selectedCategory) params.category = selectedCategory;
    if (sort !== 'latest') params.sort = sort;
    setSearchParams(params);
  }, [debouncedSearch, selectedTag, selectedCategory, sort]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const { blogs, loading, error, refresh } = useBlogs({ 
    search: debouncedSearch, 
    tag: selectedTag,
    category: selectedCategory,
    sort: sort
  });

  const clearFilters = () => {
    setSearch('');
    setSelectedTag('');
    setSelectedCategory('');
    setSort('latest');
    setSearchParams({});
  };

  if (error) return (
    <div className="py-20 flex flex-col items-center justify-center text-center">
      <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-full mb-6">
        <AlertCircle className="w-12 h-12 text-red-500" />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
        Failed to load insights.
      </h3>
      <button onClick={refresh} className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-full font-bold">
        <RefreshCw size={16} /> Try Again
      </button>
    </div>
  );

  return (
    <Container className="pt-0 pb-8">
      {/* Premium Header Section */}
      <div className="relative py-6 px-6 sm:px-10 lg:px-12 bg-gradient-to-br from-purple-50 via-white to-purple-50 dark:from-[#111827] dark:via-[#111827] dark:to-purple-900/10 rounded-[32px] mb-6 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-purple-100 dark:border-white/5 flex flex-col lg:flex-row lg:items-end justify-between gap-8 z-10">
        
        {/* Animated BG */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-400/10 dark:bg-purple-600/10 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3 pointer-events-none" />

        <div className="max-w-2xl relative z-10 text-center lg:text-left">
          <h2 className="text-3xl sm:text-5xl lg:text-[56px] font-black text-slate-900 dark:text-white mb-3 sm:mb-4 tracking-tight leading-[1.1]">
            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-600 animate-gradient bg-[length:200%_auto] drop-shadow-sm">Library</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 font-medium">
            Find the perfect guide for your AI journey, filtered by your interests.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto relative z-10">
          {/* Search Bar */}
          <div className="relative group flex-grow lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
            <input 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search library..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md border border-slate-200 dark:border-white/10 hover:border-purple-200 dark:hover:border-purple-500/30 focus:ring-2 focus:ring-purple-500 outline-none transition-all shadow-sm text-slate-900 dark:text-white font-medium placeholder:text-slate-400"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative group">
            <select 
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none w-full sm:w-40 pl-4 pr-10 py-3.5 rounded-2xl bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md border border-slate-200 dark:border-white/10 hover:border-purple-200 dark:hover:border-purple-500/30 focus:ring-2 focus:ring-purple-500 outline-none transition-all font-bold text-sm cursor-pointer text-slate-700 dark:text-slate-300 shadow-sm"
            >
              <option value="latest">Latest</option>
              <option value="trending">Trending</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none group-hover:text-purple-600 transition-colors" />
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-8 sm:mb-12">
        <div className="flex items-center gap-2 text-slate-400 mr-1 sm:mr-2">
          <Filter size={18} />
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-500">Categories:</span>
        </div>
        
        <button
          onClick={() => setSelectedCategory('')}
          className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold transition-all border shadow-sm ${
            selectedCategory === '' 
              ? "bg-purple-600 text-white border-purple-600 shadow-purple-500/30 -translate-y-1" 
              : "bg-white dark:bg-[#111827] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:border-purple-300 dark:hover:border-purple-500/40 hover:-translate-y-0.5"
          }`}
        >
          All
        </button>

        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold transition-all border shadow-sm ${
              selectedCategory === cat 
                ? "bg-purple-600 text-white border-purple-600 shadow-purple-500/30 -translate-y-1" 
                : "bg-white dark:bg-[#111827] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:border-purple-300 dark:hover:border-purple-500/40 hover:-translate-y-0.5"
            }`}
          >
            {cat}
          </button>
        ))}

        {(search || selectedTag || selectedCategory || sort !== 'latest') && (
          <button 
            onClick={clearFilters}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-full transition-all"
          >
            <X size={14} /> Clear All
          </button>
        )}
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        {loading ? (
          [...Array(6)].map((_, i) => <BlogSkeleton key={i} />)
        ) : blogs.length > 0 ? (
          <AnimatePresence>
            {blogs.map((blog) => (
              <motion.div 
                key={blog._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <BlogCard blog={blog} />
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="col-span-full py-24 text-center bg-gray-50 dark:bg-zinc-900/50 rounded-[40px] border border-dashed border-gray-200 dark:border-zinc-800">
            <div className="text-6xl mb-6">🏜️</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Library is empty</h3>
            <p className="text-gray-500">No blogs found in this category yet.</p>
          </div>
        )}
      </div>
    </Container>
  );
};

export default Blogs;
