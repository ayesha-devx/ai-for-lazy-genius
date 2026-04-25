import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  ChevronRight,
  Heart,
  Bookmark,
  Share2,
  Loader2,
  AlertCircle,
  MessageSquare,
  Send,
  Edit3,
  Trash2,
  List,
  RefreshCw
} from 'lucide-react';

// Core Utils / Services / Hooks
import { useBlog } from '@/hooks/useBlogHooks';
import { formatDate } from '@/utils/formatDate';
import { cn } from '@/utils/cn';
import blogService from '@/services/blogService';
import progressService from '@/services/progressService';
import { getRandomAvatar } from '@/utils/avatars';
import useAuthStore from '@/store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateReadingTime, extractHeadings } from '@/utils/readingUtils';

// Feature Components
import ReadingProgressBar from '@/components/blog/ReadingProgressBar';
import AuthorCard from '@/components/blog/AuthorCard';
import ArticleEngagement, { IconButton } from '@/components/blog/ArticleEngagement';
import ArticleBody from '@/components/blog/ArticleBody';
import LazyExplainCard from '@/components/ai/LazyExplainCard';
import DevGuideCard from '@/components/ai/DevGuideCard';
import TextSelectionAI from '@/components/ai/TextSelectionAI';
import VoiceReader from '@/components/ai/VoiceReader';
import Subscribe from '@/components/blog/Subscribe';
import FollowButton from '@/components/ui/FollowButton';
import CommentSection from '@/components/blog/CommentSection';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { blog, loading, error, retry } = useBlog(id);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('');
  const [commentCount, setCommentCount] = useState(0);
  const [progressToast, setProgressToast] = useState(null);
  const hasTriggeredProgress = React.useRef(false);

  useEffect(() => {
    // Fetch comment count initially
    const fetchCommentCount = async () => {
      try {
        const comments = await blogService.getComments(id);
        setCommentCount(comments.length);
      } catch (err) {
        console.error("Failed to fetch comment count");
      }
    };
    if (id) fetchCommentCount();
  }, [id]);

  const scrollToComments = () => {
    document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      // Update progress
      const { scrollY, innerHeight } = window;
      const { scrollHeight } = document.documentElement;
      const totalScrollable = scrollHeight - innerHeight;
      const progress = totalScrollable > 0 ? (scrollY / totalScrollable) * 100 : 0;
      setScrollProgress(progress);

      // Trigger reading progress at 80%
      if (progress > 80 && !hasTriggeredProgress.current && id) {
        hasTriggeredProgress.current = true;
        progressService.updateProgress('read_blog')
          .then(res => {
            if (res.streakIncreased) {
              setProgressToast(`🔥 Streak increased to ${res.progress.streakCount} days!`);
              setTimeout(() => setProgressToast(null), 4000);
            } else if (res.newBadges?.length > 0) {
              setProgressToast(`🏆 Earned new badge: ${res.newBadges[0]}`);
              setTimeout(() => setProgressToast(null), 4000);
            }
          })
          .catch(err => console.error("Progress update failed", err));
      }

      // Detect active section
      const headings = document.querySelectorAll('h1, h2, h3');
      let currentSection = '';
      headings.forEach((heading) => {
        const top = heading.getBoundingClientRect().top;
        if (top < 150) {
          currentSection = heading.id;
        }
      });
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [blogData, setBlogData] = useState(null);
  const { user, isAuthenticated, updateUser } = useAuthStore();

  useEffect(() => {
    if (blog) setBlogData(blog);
  }, [blog]);

  // Derived data for reading experience
  const readingTime = useMemo(() => calculateReadingTime(blogData?.content), [blogData?.content]);
  const headings = useMemo(() => extractHeadings(blogData?.content), [blogData?.content]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      alert('Please login to like this post!');
      return;
    }
    try {
      const updatedBlog = await blogService.likeBlog(id);
      setBlogData(updatedBlog);
    } catch (err) {
      console.error('Failed to like blog');
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      alert('Please login to save this post!');
      return;
    }
    try {
      const updatedBookmarks = await blogService.bookmarkBlog(id);
      updateUser({ ...user, bookmarks: updatedBookmarks });
    } catch (err) {
      console.error('Failed to bookmark');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
      try {
        await blogService.deleteBlog(id);
        navigate('/blogs');
      } catch (err) {
        console.error('Delete failed:', err);
        const errorMessage = err.response?.data?.message || err.message || 'Unknown error';
        alert(`Failed to delete blog: ${errorMessage}`);
      }
    }
  };

  if (loading) return <LoadingState />;
  if (error || !blogData) return <ErrorState error={error} retry={retry} />;
  
  const isLiked = blogData?.likes?.some(uid => uid.toString() === user?._id?.toString());
  const isBookmarked = user?.bookmarks?.some(uid => uid.toString() === id.toString());

  return (
    <div className="relative min-h-screen selection:bg-indigo-500/30">
      <ReadingProgressBar progress={scrollProgress} />

      {/* Progress Toast */}
      <AnimatePresence>
        {progressToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-4 bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex items-center gap-3"
          >
            <span className="text-slate-900 dark:text-white font-black tracking-wide text-sm">{progressToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <div className="relative pt-12 sm:pt-20 pb-12 sm:pb-16 overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-[10px] sm:text-sm font-bold text-gray-400 mb-6 sm:mb-12 overflow-x-auto no-scrollbar">
            <button onClick={() => navigate('/')} className="hover:text-indigo-600 transition-colors">HOME</button>
            <ChevronRight size={14} />
            <button onClick={() => navigate('/blogs')} className="hover:text-indigo-600 transition-colors">BLOGS</button>
            <ChevronRight size={14} />
            <span className="text-gray-900 dark:text-white truncate uppercase tracking-widest">{blogData.title}</span>
          </nav>

          <header className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-4 py-1.5 rounded-full bg-indigo-600 text-white text-xs font-black tracking-widest uppercase">
                  {blogData.category || "Insight"}
                </span>
                <div className="flex items-center gap-2 text-gray-400 text-sm font-bold">
                  <Clock size={16} />
                  <span>{readingTime}</span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-7xl font-[900] text-gray-900 dark:text-white leading-[1.2] sm:leading-[1.1] tracking-tight text-balance">
                {blogData.title}
              </h1>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 py-8 border-y border-gray-100 dark:border-gray-800/60">
              <AuthorMetadata 
                author={blogData.author} 
                date={blogData.createdAt} 
                isFollowing={user?.following?.includes(blogData.author?._id)}
              />
              
              <div className="flex flex-wrap items-center gap-4">
                {isAuthenticated && user?._id === blogData.author?._id && (
                  <div className="flex items-center gap-2 pr-4 border-r border-gray-100 dark:border-gray-800">
                    <button 
                      onClick={() => navigate(`/edit/${id}`)}
                      className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
                    >
                      <Edit3 size={20} />
                    </button>
                    <button onClick={handleDelete} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all">
                      <Trash2 size={20} />
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <IconButton icon={Heart} label="Like" count={blogData.likes?.length || 0} onClick={handleLike} isActive={isLiked} />
                  <IconButton icon={MessageSquare} label="Comment" count={commentCount} onClick={scrollToComments} />
                  <IconButton icon={Bookmark} label="Bookmark" onClick={handleBookmark} isActive={isBookmarked} activeColor="indigo" />
                </div>
              </div>
            </div>
          </header>

          {/* Cover Image */}
          {blogData.image && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 sm:mt-12 rounded-2xl sm:rounded-[40px] overflow-hidden shadow-2xl border border-gray-100 dark:border-zinc-800"
            >
              <img 
                src={blogData.image} 
                alt={blogData.title} 
                className="w-full h-auto max-h-[600px] object-cover"
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-[280px_1fr_80px] gap-12 relative">
        
        {/* Table of Contents - Sticky Sidebar */}
        <aside className="hidden lg:block sticky top-32 h-fit space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white font-black uppercase tracking-widest text-xs">
              <List size={16} className="text-indigo-600" />
              <span>Table of Contents</span>
            </div>
            
            <nav className="space-y-1">
              {headings.length > 0 ? headings.map((heading) => (
                <a
                  key={heading.id}
                  href={`#${heading.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={cn(
                    "block py-2 text-sm transition-all duration-300 border-l-2 pl-4",
                    activeSection === heading.id
                      ? "text-indigo-600 border-indigo-600 font-bold bg-indigo-50/50 dark:bg-indigo-900/10"
                      : "text-gray-500 border-gray-100 dark:border-zinc-800 hover:text-gray-900 dark:hover:text-white hover:border-gray-300"
                  )}
                  style={{ marginLeft: `${(heading.level - 1) * 12}px` }}
                >
                  {heading.text}
                </a>
              )) : (
                <p className="text-xs text-gray-400 italic">No headings found in this article.</p>
              )}
            </nav>
          </div>

          <Subscribe variant="card" />
        </aside>

        {/* Article Body */}
        <div className="space-y-12 pb-32">
          <div className="bg-white dark:bg-zinc-900/50 p-5 sm:p-10 md:p-12 rounded-2xl sm:rounded-[40px] border border-gray-100 dark:border-zinc-800 shadow-2xl shadow-indigo-500/5">
            <VoiceReader content={blogData.content} />
            <ArticleBody content={blogData.content} />
          </div>
          
          <LazyExplainCard content={blogData.content} />
          <DevGuideCard content={blogData.content} />
          
          <CommentSection blogId={id} onCommentAdded={() => setCommentCount(prev => prev + 1)} />
        </div>

        {/* Floating Engagement Sidebar */}
        <ArticleEngagement 
          blog={blogData} 
          onLike={handleLike} 
          onBookmark={handleBookmark} 
          onCommentClick={scrollToComments}
          commentCount={commentCount}
        />
      </div>

      <TextSelectionAI />
    </div>
  );
};

const AuthorMetadata = ({ author, date, isFollowing }) => (
  <div className="flex flex-wrap items-center gap-4 sm:gap-6">
    <div className="flex items-center gap-4">
      <Link to={`/author/${author?._id}`} className="w-14 h-14 rounded-full overflow-hidden block hover:opacity-80 transition-opacity">
        <img 
          src={(author?.avatar && !author.avatar.includes('149071.png')) ? author.avatar : getRandomAvatar(author?.name)} 
          alt={author?.name} 
          className="w-full h-full object-cover"
        />
      </Link>
      <div>
        <Link to={`/author/${author?._id}`} className="font-black text-gray-900 dark:text-white text-lg tracking-tight hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors block">
          {author?.name || 'Ayesha Topiwala'}
        </Link>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">
          {formatDate(date)}
        </p>
      </div>
    </div>
    <FollowButton targetUserId={author?._id} initialIsFollowing={isFollowing} />
  </div>
);

const LoadingState = () => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-4">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-indigo-600/20 rounded-full animate-pulse" />
      <Loader2 className="absolute top-0 w-16 h-16 text-indigo-600 animate-spin" />
    </div>
    <p className="text-gray-500 font-black uppercase tracking-widest text-xs animate-pulse">Analyzing Abstractions...</p>
  </div>
);

const ErrorState = ({ error, retry }) => (
  <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
    <div className="p-6 bg-red-50 dark:bg-red-900/10 rounded-[40px] mb-8">
      <AlertCircle className="w-16 h-16 text-red-500" />
    </div>
    <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">Content Restricted</h2>
    <p className="text-gray-500 max-w-md mb-8 leading-relaxed">
      {error || "Our AI neural net encountered an unexpected break. Please try reloading the insight."}
    </p>
    <button onClick={retry} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all flex items-center gap-2">
      <RefreshCw size={20} /> Initialize Retry
    </button>
  </div>
);

export default BlogDetail;
