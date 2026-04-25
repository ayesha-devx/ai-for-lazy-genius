import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Heart, MessageCircle, UserPlus, Circle, CheckCircle2, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const NotificationDropdown = ({ 
  notifications, 
  onClose, 
  onMarkRead, 
  onMarkAllRead,
  loading 
}) => {
  const navigate = useNavigate();

  const getIcon = (type) => {
    switch (type) {
      case 'like': return <Heart size={16} className="text-red-500 fill-red-500" />;
      case 'comment': return <MessageCircle size={16} className="text-blue-500 fill-blue-500" />;
      case 'follow': return <UserPlus size={16} className="text-purple-500" />;
      default: return <Bell size={16} />;
    }
  };

  const handleNotificationClick = (n) => {
    if (!n.read) onMarkRead(n._id);
    navigate(n.link);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="fixed sm:absolute top-20 sm:top-full right-4 sm:right-0 w-[calc(100vw-2rem)] sm:w-96 bg-white dark:bg-zinc-900 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-zinc-800 z-[100] overflow-hidden"
    >
      <div className="p-4 border-b border-gray-50 dark:border-zinc-800 flex items-center justify-between">
        <h3 className="font-black text-gray-900 dark:text-white">Notifications</h3>
        <button 
          onClick={onMarkAllRead}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          Mark all read
        </button>
      </div>

      <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="p-10 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-bold text-gray-400">Loading alerts...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <div className="w-12 h-12 bg-gray-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="text-gray-300" />
            </div>
            <p className="font-bold text-gray-900 dark:text-white">All caught up!</p>
            <p className="text-xs text-gray-400">No new notifications for you yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-zinc-800/50">
            {notifications.map((n) => (
              <button
                key={n._id}
                onClick={() => handleNotificationClick(n)}
                className={`w-full p-4 flex gap-3 text-left transition-all hover:bg-gray-50 dark:hover:bg-zinc-800/50 relative group ${!n.read ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''}`}
              >
                <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 shadow-sm relative`}>
                  {n.sender?.profileImage ? (
                    <img src={n.sender.profileImage} alt="" className="w-full h-full rounded-xl object-cover" />
                  ) : (
                    <div className="w-full h-full rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs uppercase">
                      {n.sender?.name?.[0] || '?'}
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center shadow-sm border border-gray-50 dark:border-zinc-800">
                    {getIcon(n.type)}
                  </div>
                </div>

                <div className="flex-grow min-w-0">
                  <p className={`text-sm leading-snug break-words ${!n.read ? 'font-bold text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                    {n.message}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock size={10} className="text-gray-400" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>

                {!n.read && (
                  <div className="shrink-0 pt-1">
                    <Circle size={8} className="fill-indigo-600 text-indigo-600 animate-pulse" />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="p-3 border-t border-gray-50 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/30">
        <button className="w-full py-2 text-xs font-black text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors uppercase tracking-widest">
          View All History
        </button>
      </div>
    </motion.div>
  );
};

export default NotificationDropdown;
