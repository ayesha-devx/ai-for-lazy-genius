import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Heart, MessageCircle, FileText, Users, Award, MapPin, Link as LinkIcon, Calendar } from 'lucide-react';
import communityService from '@/services/communityService';
import FollowButton from '@/components/ui/FollowButton';
import useAuthStore from '@/store/authStore';
import { format } from 'date-fns';
import { getRandomAvatar } from '@/utils/avatars';

const defaultImage = "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop";

const AuthorProfile = () => {
  const { id } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await communityService.getAuthorProfile(id);
        setProfileData(data);
      } catch (err) {
        setError('Failed to load author profile.');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617]">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617]">
        <p className="text-slate-900 dark:text-white font-bold">{error}</p>
      </div>
    );
  }

  const { author, totalBlogs, totalLikes, followersCount, recentBlogs } = profileData;
  const isFollowing = user?.following?.includes(author._id);

  return (
    <div className="min-h-screen bg-white dark:bg-[#020617] text-slate-900 dark:text-white selection:bg-purple-500/30 transition-colors duration-500">
      
      {/* Pure White Header */}
      <div className="relative pt-32 pb-20 px-4 border-b border-slate-100 dark:border-white/5 bg-white dark:bg-[#020617]">
        <div className="max-w-5xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-10">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden flex-shrink-0"
          >
            <img 
              src={(author.profileImage && !author.profileImage.includes('149071.png')) ? author.profileImage : (author.avatar && !author.avatar.includes('149071.png') ? author.avatar : getRandomAvatar(author.name))} 
              alt={author.name} 
              className="w-full h-full object-cover"
            />
          </motion.div>

          <div className="text-center md:text-left flex-grow">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-2">{author.name}</h1>
              <p className="text-purple-600 dark:text-purple-400 font-bold uppercase tracking-widest text-sm flex items-center justify-center md:justify-start gap-2 mb-6">
                <Award size={16} /> Verified Creator
              </p>
            </motion.div>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-slate-600 dark:text-slate-300 text-lg md:text-xl max-w-2xl mb-8 leading-relaxed">
              {author.bio || "This creator is a mystery. They haven't written a bio yet, but their work speaks for itself."}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-wrap items-center justify-center md:justify-start gap-6 md:gap-10 mb-8">
              <div className="text-center md:text-left">
                <p className="text-3xl font-black text-slate-900 dark:text-white">{totalBlogs}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-1">Articles</p>
              </div>
              <div className="hidden sm:block w-px h-12 bg-slate-300 dark:bg-white/10" />
              <div className="text-center md:text-left">
                <p className="text-3xl font-black text-slate-900 dark:text-white">{followersCount}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-1">Followers</p>
              </div>
              <div className="hidden sm:block w-px h-12 bg-slate-300 dark:bg-white/10" />
              <div className="text-center md:text-left">
                <p className="text-3xl font-black text-slate-900 dark:text-white">{totalLikes}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-1">Likes</p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex justify-center md:justify-start">
              <FollowButton 
                targetUserId={author._id} 
                initialIsFollowing={isFollowing} 
              />
            </motion.div>
          </div>

        </div>
      </div>

      {/* Recent Blogs */}
      <div className="max-w-5xl mx-auto px-4 py-20 bg-white dark:bg-[#020617]">
        <div className="flex items-center gap-3 mb-10">
          <FileText className="text-purple-500" size={28} />
          <h2 className="text-3xl font-black">Recent Publications</h2>
        </div>

        {recentBlogs.length === 0 ? (
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-16 text-center backdrop-blur-md shadow-sm">
            <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">No articles published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {recentBlogs.map((blog, idx) => (
              <motion.div 
                key={blog._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                className="group relative flex flex-col bg-white dark:bg-[#111827] rounded-[32px] overflow-hidden border border-slate-200 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none hover:border-purple-300 dark:hover:border-purple-500/50 hover:shadow-[0_20px_40px_rgba(168,85,247,0.15)] transition-all duration-500"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img src={blog.image || defaultImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={blog.title} />
                  <div className="absolute top-4 left-4">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full shadow-lg">
                      {blog.category || 'Article'}
                    </span>
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-grow relative z-10">
                  <span className="text-xs text-purple-600 dark:text-purple-400 font-bold mb-3 uppercase tracking-widest">
                    {format(new Date(blog.createdAt), 'MMM dd, yyyy')}
                  </span>
                  <Link to={`/blog/${blog._id}`}>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {blog.title}
                    </h3>
                  </Link>
                  <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-3 mb-6 leading-relaxed flex-grow">
                    {blog.content?.substring(0, 150)}...
                  </p>
                  
                  <div className="flex items-center gap-6 pt-6 border-t border-slate-100 dark:border-white/10">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <Heart size={18} className={blog.likes?.length > 0 ? "text-rose-500 fill-rose-500" : ""} />
                      <span className="text-sm font-bold">{blog.likes?.length || 0}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default AuthorProfile;
