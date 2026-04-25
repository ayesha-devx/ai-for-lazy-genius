import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User as UserIcon, 
  BookOpen, 
  Heart, 
  Settings, 
  Loader2, 
  Bookmark, 
  Users, 
  Zap, 
  Award, 
  Edit3, 
  Share2,
  Mail,
  Calendar,
  ChevronRight,
  Sparkles,
  X,
  CheckCircle2,
  Globe,
  ExternalLink,
  MapPin,
  Hash
} from 'lucide-react';
import userService from '@/services/userService';
import BlogCard from '@/components/blog/BlogCard';
import useAuthStore from '@/store/authStore';
import { useParams, Link } from 'react-router-dom';
import FollowButton from '@/components/ui/FollowButton';
import { getRandomAvatar } from '@/utils/avatars';

// Custom SVG Icons for Brands (Safe for any Lucide version)
const TwitterIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z" />
  </svg>
);

const GitHubIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const LinkedInIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.771-.773 1.771-1.729V1.729C24 .774 23.204 0 22.225 0z" />
  </svg>
);

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('mine');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ 
    name: '', 
    bio: '',
    title: '',
    location: '',
    interests: '',
    socialLinks: { twitter: '', github: '', linkedin: '', website: '' }
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const { id } = useParams();
  const { user: authUser, updateUser } = useAuthStore();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = id 
          ? await userService.getUserById(id) 
          : await userService.getProfile();
        setProfileData(data);
        if (!id || id === authUser?._id) {
           setEditForm({ 
             name: data.user.name, 
             bio: data.user.bio || '',
             title: data.user.title || '',
             location: data.user.location || '',
             interests: data.user.interests?.join(', ') || '',
             socialLinks: data.user.socialLinks || { twitter: '', github: '', linkedin: '', website: '' }
           });
        }
      } catch (err) {
        console.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
    window.scrollTo(0, 0);
  }, [id, authUser?._id]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      const updatedData = await userService.updateProfile(editForm);
      setProfileData(prev => ({
        ...prev,
        user: { ...prev.user, ...updatedData }
      }));
      // Merge with authUser to preserve the token!
      updateUser({ ...authUser, ...updatedData }); 
      setIsEditModalOpen(false);
    } catch (err) {
      alert('Failed to update profile');
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#030712]">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-purple-500 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const { user, blogs = [], likedBlogs = [], bookmarks = [], followersCount = 0, followingCount = 0 } = profileData;
  const isMyProfile = !id || id === authUser?._id;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-slate-100 pb-20 transition-colors duration-500">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 dark:bg-indigo-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto -mt-12 sm:mt-0 pt-0 sm:pt-12 px-4 relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-10"
        >
          {/* 1. PROFILE HERO SECTION */}
          <motion.div 
            variants={itemVariants}
            className="relative rounded-2xl sm:rounded-[40px] bg-white dark:bg-slate-900 overflow-hidden shadow-xl border border-purple-100 dark:border-purple-500/20"
          >
            <div className="relative p-6 sm:p-10 md:p-12">
              {/* Animated Background Mesh */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(168,85,247,0.1),transparent)] dark:bg-[radial-gradient(circle_at_50%_120%,rgba(168,85,247,0.05),transparent)]" />
              
              <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full overflow-hidden">
                    <img 
                      src={(user.avatar && !user.avatar.includes('149071.png')) ? user.avatar : getRandomAvatar(user.name)} 
                      alt={user.name} 
                      className="w-full h-full object-cover rounded-full" 
                    />
                  </div>
                </div>

                {/* Info Area */}
                <div className="flex-grow text-center md:text-left pt-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
                    <div>
                      <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white mb-1 tracking-tight leading-tight">
                        {user.name}
                      </h1>
                      {user.title && (
                        <p className="text-lg font-black text-purple-600 dark:text-purple-400 mb-3 tracking-wide">
                          {user.title}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-500 dark:text-slate-400 font-bold">
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-white/5 rounded-full text-xs uppercase tracking-widest border border-slate-200 dark:border-white/10">
                          @{user.email.split('@')[0]}
                        </span>
                        <span className="flex items-center gap-1.5 text-sm">
                          <Mail size={16} className="text-purple-500" />
                          {user.email}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center gap-3">
                      {!isMyProfile ? (
                        <FollowButton 
                          targetUserId={user._id} 
                          initialIsFollowing={authUser?.following?.includes(user._id)} 
                          onToggle={(nowFollowing) => {
                            setProfileData(prev => ({
                              ...prev,
                              followersCount: nowFollowing ? (prev.followersCount || 0) + 1 : (prev.followersCount || 0) - 1
                            }))
                          }}
                        />
                      ) : (
                        <motion.button 
                          onClick={() => setIsEditModalOpen(true)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-sm shadow-xl w-full sm:w-auto"
                        >
                          <Edit3 size={18} />
                          Edit Profile
                        </motion.button>
                      )}
                    </div>
                  </div>

                  <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl font-medium mb-6">
                    {user.bio || "This creator is a mystery. They haven't written a bio yet, but their work speaks for itself."}
                  </p>

                  {/* Interests Tags */}
                  {user.interests && user.interests.length > 0 && (
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-8">
                      {user.interests.map((interest, idx) => (
                        <span 
                          key={idx}
                          className="px-4 py-1.5 rounded-full bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-300 text-xs font-black border border-purple-100 dark:border-purple-500/20 shadow-sm"
                        >
                          #{interest}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Social Links Row */}
                  {(user.socialLinks && Object.values(user.socialLinks).some(v => v)) && (
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-8">
                      {user.socialLinks.twitter && (
                        <SocialButton href={user.socialLinks.twitter} icon={<TwitterIcon className="w-5 h-5" />} label="X" color="bg-black text-white" />
                      )}
                      {user.socialLinks.github && (
                        <SocialButton href={user.socialLinks.github} icon={<GitHubIcon className="w-5 h-5" />} label="GitHub" color="bg-[#24292e] text-white" />
                      )}
                      {user.socialLinks.linkedin && (
                        <SocialButton href={user.socialLinks.linkedin} icon={<LinkedInIcon className="w-5 h-5" />} label="LinkedIn" color="bg-[#0077b5] text-white" />
                      )}
                      {user.socialLinks.website && (
                        <SocialButton href={user.socialLinks.website} icon={<Globe className="w-5 h-5" />} label="Website" color="bg-purple-600 text-white" />
                      )}
                    </div>
                  )}
                  
                  <div className="mt-8 pt-8 border-t border-slate-100 dark:border-white/5 flex flex-wrap items-center justify-center md:justify-start gap-8">
                    <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 font-bold text-sm">
                      <Calendar size={18} className="text-purple-500" />
                      Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </div>
                    {user.location && (
                      <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 font-bold text-sm">
                        <MapPin size={18} className="text-red-500" />
                        {user.location}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 font-bold text-sm">
                      <Zap size={18} className="text-yellow-500" />
                      Lvl 5 Creator
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 2. STATS SECTION */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <StatCard label="Followers" value={followersCount} icon={<Users className="w-6 h-6 text-blue-500" />} color="blue" />
            <StatCard label="Following" value={followingCount} icon={<Heart className="w-6 h-6 text-red-500" />} color="red" />
            <StatCard label="Articles" value={blogs.length} icon={<BookOpen className="w-6 h-6 text-purple-500" />} color="purple" />
            <StatCard label="Insights" value={likedBlogs.length + (bookmarks?.length || 0)} icon={<Award className="w-6 h-6 text-yellow-500" />} color="yellow" />
          </motion.div>

          {/* 3. TAB SECTION */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center p-1.5 bg-white dark:bg-slate-900 rounded-[24px] border border-slate-100 dark:border-white/5 mb-10 w-fit max-w-full overflow-x-auto no-scrollbar shadow-sm">
              <TabButton active={activeTab === 'mine'} onClick={() => setActiveTab('mine')} icon={<BookOpen size={18} />} label="My Stories" count={blogs.length} />
              <TabButton active={activeTab === 'liked'} onClick={() => setActiveTab('liked')} icon={<Heart size={18} />} label="Liked Insights" count={likedBlogs.length} />
              <TabButton active={activeTab === 'saved'} onClick={() => setActiveTab('saved')} icon={<Bookmark size={18} />} label="Saved" count={bookmarks.length} />
            </div>

            {/* Content Grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'mine' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogs.length > 0 ? (
                      blogs.map(blog => <BlogCard key={blog._id} blog={blog} />)
                    ) : (
                      <EmptyState title="No stories yet" description="Start sharing your lazy genius insights with the world." icon={<BookOpen className="w-12 h-12" />} />
                    )}
                  </div>
                ) : activeTab === 'liked' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {likedBlogs.length > 0 ? (
                      likedBlogs.map(blog => <BlogCard key={blog._id} blog={blog} />)
                    ) : (
                      <EmptyState title="No liked insights" description="Explore the universe of ideas and show some love." icon={<Heart className="w-12 h-12" />} />
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {bookmarks.length > 0 ? (
                      bookmarks.map(blog => <BlogCard key={blog._id} blog={blog} />)
                    ) : (
                      <EmptyState title="Your Brain Bank is empty" description="Save powerful insights to build your collection." icon={<Bookmark className="w-12 h-12" />} />
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl overflow-hidden border border-slate-100 dark:border-white/10"
            >
              <div className="p-8 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">Edit Profile</h2>
                  <p className="text-slate-500 text-sm font-medium">Update your creator identity</p>
                </div>
                <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl text-slate-400 transition-colors"><X size={24} /></button>
              </div>

              <form onSubmit={handleUpdateProfile} className="p-8 space-y-8 max-h-[75vh] overflow-y-auto no-scrollbar">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Display Name</label>
                    <input 
                      type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-5 py-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-purple-500 outline-none transition-all font-medium text-slate-900 dark:text-white"
                      placeholder="Your name" required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Creator Title / Role</label>
                    <input 
                      type="text" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full px-5 py-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-purple-500 outline-none transition-all font-medium text-slate-900 dark:text-white"
                      placeholder="e.g. Senior Lazy Genius"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Location</label>
                    <div className="relative">
                       <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                       <input 
                        type="text" value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                        className="w-full pl-12 pr-6 py-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-purple-500 outline-none transition-all font-medium text-slate-900 dark:text-white"
                        placeholder="e.g. Mumbai, India"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Primary Interests (Comma separated)</label>
                    <div className="relative">
                       <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                       <input 
                        type="text" value={editForm.interests} onChange={(e) => setEditForm({ ...editForm, interests: e.target.value })}
                        className="w-full pl-12 pr-6 py-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-purple-500 outline-none transition-all font-medium text-slate-900 dark:text-white"
                        placeholder="e.g. AI, Productivity, Lifestyle"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Creator Bio</label>
                    <textarea 
                      value={editForm.bio} onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      className="w-full px-5 py-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-purple-500 outline-none transition-all font-medium text-slate-900 dark:text-white min-h-[100px] resize-none"
                      placeholder="Tell the world who you are..."
                    />
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-slate-900 dark:text-white border-l-4 border-purple-500 pl-3 uppercase tracking-tighter">Social Connections</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SocialInput label="X (Twitter) URL" value={editForm.socialLinks.twitter} onChange={(val) => setEditForm({ ...editForm, socialLinks: { ...editForm.socialLinks, twitter: val } })} icon={<TwitterIcon className="w-4 h-4" />} />
                    <SocialInput label="LinkedIn URL" value={editForm.socialLinks.linkedin} onChange={(val) => setEditForm({ ...editForm, socialLinks: { ...editForm.socialLinks, linkedin: val } })} icon={<LinkedInIcon className="w-4 h-4" />} />
                    <SocialInput label="GitHub URL" value={editForm.socialLinks.github} onChange={(val) => setEditForm({ ...editForm, socialLinks: { ...editForm.socialLinks, github: val } })} icon={<GitHubIcon className="w-4 h-4" />} />
                    <SocialInput label="Portfolio / Website" value={editForm.socialLinks.website} onChange={(val) => setEditForm({ ...editForm, socialLinks: { ...editForm.socialLinks, website: val } })} icon={<Globe className="w-4 h-4" />} />
                  </div>
                </div>

                <div className="pt-4 flex gap-4 sticky bottom-0 bg-white dark:bg-slate-900 py-4 border-t border-slate-100 dark:border-white/5">
                  <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-grow py-4 px-6 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 font-black text-sm hover:bg-slate-200 dark:hover:bg-white/10 transition-all">Cancel</button>
                  <button 
                    type="submit" disabled={updateLoading}
                    className="flex-grow py-4 px-6 rounded-2xl bg-purple-600 text-white font-black text-sm shadow-xl shadow-purple-500/20 hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
                  >
                    {updateLoading ? <Loader2 size={20} className="animate-spin" /> : <><CheckCircle2 size={20} />Save Changes</>}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SocialButton = ({ href, icon, label, color }) => (
  <motion.a
    href={href} target="_blank" rel="noopener noreferrer"
    whileHover={{ y: -4, scale: 1.05 }}
    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-lg ${color}`}
  >
    {icon}
    <span>{label}</span>
    <ExternalLink size={12} className="opacity-50" />
  </motion.a>
);

const SocialInput = ({ label, value, onChange, icon }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
      {icon} {label}
    </label>
    <input 
      type="url" value={value} onChange={(e) => onChange(e.target.value)}
      className="w-full px-5 py-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-purple-500 outline-none transition-all font-medium text-sm text-slate-900 dark:text-white"
      placeholder="https://..."
    />
  </div>
);

const StatCard = ({ label, value, icon, color }) => {
  const colorStyles = {
    blue: "group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 border-blue-500/0 hover:border-blue-500/20",
    red: "group-hover:bg-red-50 dark:group-hover:bg-red-500/10 border-red-500/0 hover:border-red-500/20",
    purple: "group-hover:bg-purple-50 dark:group-hover:bg-purple-500/10 border-purple-500/0 hover:border-purple-500/20",
    yellow: "group-hover:bg-yellow-50 dark:group-hover:bg-yellow-500/10 border-yellow-500/0 hover:border-yellow-500/20"
  };

  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      className={`group p-4 sm:p-6 rounded-2xl sm:rounded-[32px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 shadow-lg transition-all duration-300 ${colorStyles[color]}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 shadow-sm group-hover:scale-110 group-hover:-rotate-6 transition-transform">
          {icon}
        </div>
        <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-700 group-hover:translate-x-1 group-hover:text-slate-400 transition-all" />
      </div>
      <div>
        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-1">{value}</h3>
        <p className="text-[10px] sm:text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{label}</p>
      </div>
    </motion.div>
  );
};

const TabButton = ({ active, onClick, icon, label, count }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-3 px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl sm:rounded-[20px] text-xs sm:text-sm font-black transition-all relative group/tab whitespace-nowrap ${
      active 
        ? "bg-purple-600 dark:bg-white text-white dark:text-slate-900 shadow-xl" 
        : "text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white"
    }`}
  >
    {icon}
    <span>{label}</span>
    {count > 0 && (
      <span className={`flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-black ${
        active 
          ? "bg-white/20 dark:bg-slate-900/10 text-white dark:text-slate-900" 
          : "bg-slate-100 dark:bg-white/5 text-slate-400 group-hover/tab:text-slate-600"
      }`}>
        {count}
      </span>
    )}
  </button>
);

const EmptyState = ({ title, description, icon }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
    className="col-span-full py-24 px-8 rounded-[40px] bg-white/50 dark:bg-slate-900/20 border-2 border-dashed border-slate-200 dark:border-white/5 flex flex-col items-center text-center"
  >
    <div className="relative mb-8">
      <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full" />
      <div className="relative p-8 rounded-[32px] bg-white dark:bg-slate-800 text-purple-500 shadow-xl">{icon}</div>
    </div>
    <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">{title}</h3>
    <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto text-lg leading-relaxed font-medium">{description}</p>
  </motion.div>
);

export default Profile;
