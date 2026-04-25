import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageCircle, Clock, Trash2, Loader2, AlertCircle } from 'lucide-react';
import blogService from '@/services/blogService';
import useAuthStore from '@/store/authStore';
import { formatDate } from '@/utils/formatDate';
import { getRandomAvatar } from '@/utils/avatars';

const CommentSection = ({ blogId, onCommentAdded }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    fetchComments();
  }, [blogId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const data = await blogService.getComments(blogId);
      setComments(data);
    } catch (err) {
      setError('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!isAuthenticated) {
      alert('Please login to comment');
      return;
    }

    setSubmitting(true);
    try {
      const data = await blogService.addComment(blogId, newComment);
      setComments([data, ...comments]);
      setNewComment('');
      if (onCommentAdded) onCommentAdded();
    } catch (err) {
      alert('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="comments" className="mt-16 pt-16 border-t border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600">
          <MessageCircle size={24} />
        </div>
        <div>
          <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            Conversations
          </h3>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
            {comments.length} Thoughts Shared
          </p>
        </div>
      </div>

      {/* Add Comment Input */}
      <div className="bg-gray-50 dark:bg-zinc-800/50 p-6 rounded-[32px] mb-12 border border-transparent focus-within:border-indigo-500/30 focus-within:bg-white dark:focus-within:bg-zinc-800 transition-all shadow-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={isAuthenticated ? "Share your genius perspective..." : "Login to join the conversation"}
            disabled={!isAuthenticated || submitting}
            className="w-full bg-transparent border-none focus:ring-0 text-gray-800 dark:text-zinc-300 resize-none min-h-[100px] leading-relaxed"
          />
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-zinc-700/50">
            <div className="flex items-center gap-2">
              {isAuthenticated && (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center overflow-hidden">
                    <img src={(user.avatar && !user.avatar.includes('149071.png')) ? user.avatar : getRandomAvatar(user.name)} alt="" />
                  </div>
                  <span className="text-xs font-bold text-gray-500">{user.name.split(' ')[0]}</span>
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={!isAuthenticated || submitting || !newComment.trim()}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
            >
              {submitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
              <span>Post Comment</span>
            </button>
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Gathering Thoughts...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="py-20 text-center bg-gray-50/50 dark:bg-zinc-800/30 rounded-[40px] border-2 border-dashed border-gray-100 dark:border-zinc-800">
            <div className="w-16 h-16 bg-white dark:bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              <MessageCircle className="text-gray-300" size={32} />
            </div>
            <p className="text-gray-900 dark:text-white font-black">No thoughts yet.</p>
            <p className="text-sm text-gray-400">Be the first to share your genius!</p>
          </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence initial={false}>
              {comments.map((comment, index) => (
                <motion.div
                  key={comment._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative p-6 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-[32px] hover:shadow-xl hover:shadow-indigo-500/5 transition-all"
                >
                  <div className="flex gap-4">
                    <div className="shrink-0 w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 border-2 border-white dark:border-zinc-800 shadow-sm overflow-hidden">
                      <img 
                        src={(comment.user?.avatar && !comment.user.avatar.includes('149071.png')) ? comment.user.avatar : getRandomAvatar(comment.user?.name)} 
                        alt={comment.user?.name} 
                      />
                    </div>
                    <div className="flex-grow space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-black text-gray-900 dark:text-white text-sm">
                            {comment.user?.name}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            <Clock size={10} />
                            <span>{formatDate(comment.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-zinc-400 text-sm leading-relaxed">
                        {comment.text}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
};

export default CommentSection;
