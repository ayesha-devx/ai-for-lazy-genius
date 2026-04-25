import React, { useState } from 'react';
import { Mail, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '@/services/api';
import { cn } from '@/utils/cn';

/**
 * Subscribe Component
 * A premium newsletter subscription component.
 * Connects to the backend POST /api/subscribe endpoint.
 */
const Subscribe = ({ className, variant = "default" }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(() => {
    // Check localStorage on mount
    return localStorage.getItem('isSubscribed') === 'true';
  });
  const [successMsg, setSuccessMsg] = useState(() => {
    return localStorage.getItem('isSubscribed') === 'true' ? "You're on the list! ✨" : '';
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // POST request to backend using api instance
      const response = await api.post('/subscribe', {
        email: email
      });

      if (response.data.success) {
        setSuccess(true);
        setSuccessMsg('Subscribed successfully 🎉');
        localStorage.setItem('isSubscribed', 'true');
        setEmail('');
      }
    } catch (err) {
      console.error('Subscription Error:', err);
      const errMsg = err.response?.data?.message || 'Something went wrong. Please try again.';
      
      if (errMsg === 'Already subscribed') {
        setSuccess(true);
        setSuccessMsg("You're already on the list! ✨");
        localStorage.setItem('isSubscribed', 'true');
        setEmail('');
      } else {
        setError(errMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  // Styles for the card-based variant (used in BlogDetail)
  if (variant === "card") {
    return (
      <div className={cn(
        "p-6 rounded-3xl bg-purple-600 text-white space-y-4 shadow-xl shadow-purple-500/20",
        className
      )}>
        <h4 className="font-black text-sm uppercase">Join the Genius</h4>
        <p className="text-xs text-purple-100 leading-relaxed">
          Get the latest high-level abstractions delivered to your inbox.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address" 
            className="w-full py-2 px-4 bg-purple-500/50 border border-purple-400/30 rounded-xl text-xs placeholder:text-purple-200 outline-none focus:ring-2 focus:ring-white/20 transition-all"
            disabled={loading || success}
          />
          
          <button 
            type="submit"
            disabled={loading || success}
            className={cn(
              "w-full py-2 bg-white text-purple-600 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm shadow-black/5",
              (loading || success) ? "opacity-80 cursor-not-allowed" : "hover:bg-purple-50 active:scale-[0.98]"
            )}
          >
            {loading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : success ? (
              <CheckCircle2 size={14} />
            ) : (
              "Subscribe"
            )}
            {loading ? "Processing..." : success ? "Subscribed!" : ""}
          </button>
        </form>

        {success && (
          <p className="text-[10px] font-bold text-purple-200 animate-pulse text-center">
            {successMsg}
          </p>
        )}
        
        {error && (
          <div className="flex items-center gap-2 p-2 bg-red-500/20 rounded-lg border border-red-500/30">
            <AlertCircle size={12} className="text-red-200" />
            <p className="text-[10px] font-medium text-red-100">{error}</p>
          </div>
        )}
      </div>
    );
  }

  // Default variant (used in Footer)
  return (
    <div className={cn("space-y-4", className)}>
      {!success ? (
        <form onSubmit={handleSubmit} className="flex group">
          <div className="relative flex-1">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email..." 
              disabled={loading}
              className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-purple-200 dark:hover:border-purple-500/30 rounded-l-xl py-2.5 px-4 text-sm focus:ring-1 focus:ring-purple-500 outline-none w-full text-slate-900 dark:text-white transition-all disabled:opacity-50"
            />
            {error && <span className="absolute -bottom-5 left-0 text-[10px] text-red-500 font-bold uppercase">{error}</span>}
          </div>
          <button 
            type="submit"
            disabled={loading}
            className={cn(
              "bg-purple-600 text-white px-5 rounded-r-xl transition-all flex items-center justify-center border border-purple-600 shadow-md shadow-purple-500/20",
              loading ? "opacity-80" : "hover:bg-purple-700 active:bg-purple-800"
            )}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
          </button>
        </form>
      ) : (
        <p className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2 py-2 px-4 bg-purple-50 dark:bg-purple-500/10 rounded-xl border border-purple-100 dark:border-purple-500/20 w-fit shadow-sm">
          <CheckCircle2 size={14} /> {successMsg}
        </p>
      )}
    </div>
  );
};

export default Subscribe;
