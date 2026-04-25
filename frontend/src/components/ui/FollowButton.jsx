import React, { useState, useEffect } from 'react';
import { UserPlus, UserMinus, Loader2 } from 'lucide-react';
import useAuthStore from '@/store/authStore';
import api from '@/services/api';
import { cn } from '@/utils/cn';

/**
 * FollowButton Component
 * Handles follow/unfollow logic with instant UI feedback and backend synchronization.
 */
const FollowButton = ({ targetUserId, initialIsFollowing = false, onToggle }) => {
  const { user, isAuthenticated, updateUser } = useAuthStore();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);

  // Sync with initialIsFollowing if it changes from parent
  useEffect(() => {
    setIsFollowing(initialIsFollowing);
  }, [initialIsFollowing]);

  const handleFollowToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      alert("Please login to follow users");
      return;
    }

    if (user?._id === targetUserId) {
      return; // Cannot follow self
    }

    setLoading(true);
    
    // Optimistic UI update
    const previousState = isFollowing;
    setIsFollowing(!previousState);

    try {
      const endpoint = previousState 
        ? `/community/unfollow/${targetUserId}` 
        : `/community/follow/${targetUserId}`;
      
      await api.post(endpoint);
      
      // Update global auth store state so it persists
      const updatedFollowing = previousState
        ? user.following.filter(id => id !== targetUserId)
        : [...(user.following || []), targetUserId];
      
      updateUser({ ...user, following: updatedFollowing });

      if (onToggle) onToggle(!previousState);
    } catch (err) {
      console.error('Follow toggle failed:', err);
      // Revert UI on error
      setIsFollowing(previousState);
      alert(err.response?.data?.message || "Failed to update follow status");
    } finally {
      setLoading(false);
    }
  };

  // Don't show if it's the current user
  if (user?._id === targetUserId) return null;

  return (
    <button
      onClick={handleFollowToggle}
      disabled={loading}
      className={cn(
        "flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest transition-all active:scale-95",
        isFollowing 
          ? "border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20" 
          : "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-700",
        loading && "opacity-70 cursor-wait"
      )}
    >
      {loading ? (
        <Loader2 size={14} className="animate-spin" />
      ) : isFollowing ? (
        <UserMinus size={14} />
      ) : (
        <UserPlus size={14} />
      )}
      <span>{isFollowing ? "Following" : "Follow"}</span>
    </button>
  );
};

export default FollowButton;
