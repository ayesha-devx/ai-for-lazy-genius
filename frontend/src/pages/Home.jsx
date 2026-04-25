import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import LottieExport from "lottie-react";
import ErrorBoundary from '@/components/ErrorBoundary';

const Lottie = LottieExport.default || LottieExport;
import { 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  BookOpen, 
  Zap, 
  Cpu, 
  Code,
  Share2
} from 'lucide-react';
import { useBlogs, usePersonalizedFeed } from '@/hooks/useBlogHooks';
import useAuthStore from '@/store/authStore';
import BlogSkeleton from '@/components/ui/BlogSkeleton';
import Container from '@/components/ui/Container';
import BlogCard from '@/components/blog/BlogCard';
import communityService from '@/services/communityService';
import FollowButton from '@/components/ui/FollowButton';
import { Users, Award } from 'lucide-react';
import { getRandomAvatar } from '@/utils/avatars';

const CATEGORIES = [
  { 
    name: 'AI Basics', 
    description: 'Learn the fundamentals of artificial intelligence.',
    Icon: Sparkles, 
    color: 'text-purple-500', 
    gradient: 'from-purple-500/20 to-indigo-500/5',
    iconBg: 'bg-purple-100 dark:bg-purple-500/20'
  },
  { 
    name: 'Tools', 
    description: 'Explore the latest AI software and utilities.',
    Icon: Zap, 
    color: 'text-fuchsia-500', 
    gradient: 'from-fuchsia-500/20 to-pink-500/5',
    iconBg: 'bg-fuchsia-100 dark:bg-fuchsia-500/20'
  },
  { 
    name: 'Projects', 
    description: 'Build real-world applications using AI APIs.',
    Icon: Cpu, 
    color: 'text-indigo-500', 
    gradient: 'from-indigo-500/20 to-blue-500/5',
    iconBg: 'bg-indigo-100 dark:bg-indigo-500/20'
  },
  { 
    name: 'Tutorials', 
    description: 'Step-by-step guides for lazy geniuses.',
    Icon: Code, 
    color: 'text-violet-500', 
    gradient: 'from-violet-500/20 to-purple-500/5',
    iconBg: 'bg-violet-100 dark:bg-violet-500/20'
  },
];

const Home = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { blogs: trendingBlogs, loading: trendingLoading } = useBlogs({ sort: 'trending' });
  const { blogs: latestBlogs, loading: latestLoading } = useBlogs({ sort: 'latest' });
  const { blogs: feedBlogs, loading: feedLoading } = usePersonalizedFeed();
  const [animationData, setAnimationData] = useState(null);
  const [trendingCreators, setTrendingCreators] = useState([]);
  const [creatorsLoading, setCreatorsLoading] = useState(true);

  useEffect(() => {
    fetch('/animations/circle-animation.json')
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error("Failed to load animation:", err));

    const fetchCreators = async () => {
      try {
        const data = await communityService.getTrendingCreators();
        setTrendingCreators(data);
      } catch (err) {
        console.error("Failed to load trending creators", err);
      } finally {
        setCreatorsLoading(false);
      }
    };
    fetchCreators();
  }, []);

  return (
    <div className="relative pb-24 bg-purple-50/30 dark:bg-[#0B0F19] min-h-screen text-slate-900 dark:text-white transition-colors duration-500 overflow-hidden">
      
      {/* Global Premium Background Pattern & Ambient Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#e9d5ff_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-60" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-400/20 dark:bg-purple-600/20 rounded-full blur-[120px] -translate-y-1/4 translate-x-1/3" />
        <div className="absolute top-[40%] left-0 w-[600px] h-[600px] bg-indigo-400/20 dark:bg-indigo-600/20 rounded-full blur-[120px] -translate-x-1/2" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-500/15 rounded-full blur-[120px] translate-y-1/2" />
      </div>

      <div className="relative z-10 space-y-16 md:space-y-28">
        {/* Hero Section */}
        <section className="relative pt-4 pb-16 md:pt-8 md:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-20">
            
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left space-y-6 md:space-y-8 flex flex-col items-center lg:items-start">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-md text-purple-600 dark:text-purple-400 text-sm font-bold shadow-xl shadow-purple-500/5"
              >
                <Sparkles size={16} className="animate-pulse" />
                <span>The Future of Efficiency is Here</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-black leading-[1.1] md:leading-[1.05] tracking-tight text-slate-900 dark:text-white"
              >
                AI for the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-purple-500 to-fuchsia-500 dark:from-purple-400 dark:via-purple-300 dark:to-fuchsia-400 bg-[length:200%_auto] animate-gradient drop-shadow-sm">
                  Lazy Genius
                </span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-xl leading-relaxed"
              >
                High-level abstractions, low-effort implementation. We break down complex AI concepts into practical, easy-to-use insights for those who value their time.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 pt-4 md:pt-6 w-full sm:w-auto"
              >
                <Link to="/blogs" className="w-full sm:w-auto px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold shadow-xl shadow-purple-500/30 dark:shadow-purple-900/20 transition-all hover:-translate-y-1 flex items-center justify-center gap-3 group">
                  Start Reading 
                  <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
                </Link>

                <Link 
                  to="/write"
                  className="w-full sm:w-auto px-8 py-4 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-2xl font-bold border border-purple-200 dark:border-purple-500/30 hover:bg-purple-100 dark:hover:bg-purple-500/20 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  Start Writing
                </Link>

              </motion.div>
            </div>

            {/* Right Side Visual */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex-1 relative flex justify-center lg:justify-end"
            >
              {/* Glow behind animation */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px] animate-pulse" />
              
              <div className="w-full max-w-lg animate-float relative z-10">
                <div className="relative group flex items-center justify-center">
                  {animationData ? (
                    <ErrorBoundary>
                      <Lottie 
                        animationData={animationData} 
                        loop={true} 
                        className="w-full h-auto drop-shadow-[0_0_40px_rgba(168,85,247,0.3)] scale-110"
                      />
                    </ErrorBoundary>
                  ) : (
                    <div className="w-full aspect-square bg-transparent flex items-center justify-center">
                      <Sparkles size={120} className="text-purple-500/20 animate-pulse" />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Your Daily Feed - Only for Logged In Users */}
      {isAuthenticated && (
        <Container>
          <section>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider">
                  <Sparkles size={14} className="animate-pulse" />
                  Personalized For You
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                  Your Daily Feed
                </h2>
              </div>
              <Link to="/feed" className="group inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-slate-700 text-purple-600 dark:text-purple-400 text-sm font-bold rounded-full border border-slate-200 dark:border-slate-700 shadow-sm transition-all">
                Go to Feed <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {feedLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(3)].map((_, i) => <BlogSkeleton key={i} />)}
              </div>
            ) : feedBlogs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {feedBlogs.slice(0, 3).map(blog => (
                  <BlogCard key={blog._id} blog={blog} />
                ))}
              </div>
            ) : (
              <div className="py-16 px-8 bg-gradient-to-b from-purple-50/50 to-white dark:from-purple-900/10 dark:to-[#0B0F19] rounded-[32px] border border-dashed border-purple-200 dark:border-purple-500/20 text-center relative overflow-hidden shadow-sm">
                <div className="absolute inset-0 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.03] dark:opacity-[0.05]" />
                <p className="text-slate-600 dark:text-slate-400 font-bold mb-6 relative z-10 text-lg">Curate your personalized feed by following top voices.</p>
                <Link to="/blogs" className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-lg shadow-purple-500/20 transition-all hover:-translate-y-1 relative z-10">
                  Discover Creators <ArrowRight size={18} />
                </Link>
              </div>
            )}
          </section>
        </Container>
      )}

      {/* Categories Grid */}
      <Container>
        <section id="categories-section">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider">
                  <BookOpen size={14} />
                  Discover
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                  Browse Categories
                </h2>
              </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="h-full"
              >
                <Link 
                  to={`/blogs?category=${encodeURIComponent(cat.name)}`}
                  className="group relative flex flex-col justify-between h-full p-8 rounded-[32px] bg-white dark:bg-[#111827] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-200/80 dark:border-white/5 hover:-translate-y-2 hover:border-purple-200 dark:hover:border-purple-500/30 transition-all duration-500 overflow-hidden"
                >
                  {/* Hover Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  {/* Animated Background Blob */}
                  <div className="absolute -right-8 -top-8 w-32 h-32 bg-purple-500/5 dark:bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 ease-out" />

                  <div className="relative z-10 flex flex-col h-full items-start">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${cat.iconBg} mb-6 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500 shadow-sm border border-white/50 dark:border-white/10`}>
                      <cat.Icon className={`w-8 h-8 ${cat.color}`} />
                    </div>
                    
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{cat.name}</h3>
                    
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                      {cat.description}
                    </p>
                    
                    <div className="mt-auto inline-flex items-center text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors bg-slate-50 dark:bg-white/5 px-4 py-2.5 rounded-full border border-slate-100 dark:border-white/10 group-hover:border-purple-200 dark:group-hover:border-purple-500/30 shadow-sm">
                      Explore 
                      <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </Container>

      {/* Trending Creators Section */}
      <Container>
        <section>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider border border-slate-200 dark:border-white/10">
                <Users size={14} />
                Top Voices
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                Trending Creators
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {creatorsLoading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="h-64 bg-white dark:bg-zinc-900/50 rounded-[32px] animate-pulse border border-slate-200 dark:border-white/5" />
              ))
            ) : trendingCreators.slice(0, 4).map((creator, i) => (
              <div key={creator._id} className="group relative flex flex-col items-center p-8 bg-white dark:bg-[#111827] rounded-[32px] shadow-sm hover:shadow-md border border-slate-200 dark:border-white/5 hover:-translate-y-2 transition-all duration-500 overflow-hidden text-center">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {i === 0 && (
                  <div className="absolute top-4 left-4 bg-yellow-400/20 text-yellow-600 dark:text-yellow-400 p-2 rounded-full border border-yellow-400/30">
                    <Award size={16} />
                  </div>
                )}
                
                <Link to={`/author/${creator._id}`} className="relative z-10 w-24 h-24 rounded-full overflow-hidden mb-4 group-hover:scale-105 transition-transform duration-300">
                  <img src={(creator.avatar && !creator.avatar.includes('149071.png')) ? creator.avatar : getRandomAvatar(creator.name)} alt={creator.name} className="w-full h-full object-cover" />
                </Link>
                
                <Link to={`/author/${creator._id}`} className="relative z-10 text-xl font-black text-slate-900 dark:text-white mb-1 hover:text-purple-600 transition-colors">
                  {creator.name}
                </Link>
                
                <p className="relative z-10 text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">
                  {creator.followersCount} Followers
                </p>
                
                <div className="relative z-10 w-full mt-auto flex justify-center">
                  <FollowButton targetUserId={creator._id} initialIsFollowing={isAuthenticated && user?.following?.includes(creator._id)} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </Container>

      {/* Trending Section */}
      <Container>
        <section>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider border border-slate-200 dark:border-white/10">
                <TrendingUp size={14} />
                Hot Topics
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                Trending Now
              </h2>
            </div>
            <Link to="/blogs?sort=trending" className="group inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 text-sm font-bold rounded-full border border-slate-200 dark:border-slate-700 shadow-sm transition-all">
              View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trendingLoading ? (
              [...Array(3)].map((_, i) => <BlogSkeleton key={i} />)
            ) : trendingBlogs.slice(0, 3).map(blog => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        </section>
      </Container>

      {/* Latest Stories */}
      <Container>
        <section>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider border border-slate-200 dark:border-white/10">
                <Clock size={14} />
                Fresh Insights
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                Latest Stories
              </h2>
            </div>
            <Link to="/blogs?sort=latest" className="group inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-slate-700 text-purple-600 dark:text-purple-400 text-sm font-bold rounded-full border border-slate-200 dark:border-slate-700 shadow-sm transition-all">
              View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestLoading ? (
              [...Array(3)].map((_, i) => <BlogSkeleton key={i} />)
            ) : latestBlogs.slice(0, 3).map(blog => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        </section>
      </Container>
    </div>
    </div>
  );
};

export default Home;
