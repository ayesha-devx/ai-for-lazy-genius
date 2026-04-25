import React, { useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Brain, Zap, ChevronDown, CheckCircle2, Loader, AlertCircle, Copy, Check } from 'lucide-react';
import { cn } from '@/utils/cn';
import api from '@/services/api';

/**
 * LazySummary Component
 * A premium, AI-powered summarization card with high-end aesthetics.
 * Refined for maximum stability.
 */
const LazySummary = ({ content = "" }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const panelId = useId();

  const handleToggle = async () => {
    const nextState = !isExpanded;
    setIsExpanded(nextState);

    if (nextState && !summary && !loading) {
      fetchSummary();
    }
  };

  const fetchSummary = async () => {
    if (!content) {
      setError("No content found to analyze.");
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/ai/summarize', { content });
      setSummary(data.summary);
    } catch (err) {
      console.error('AI Error:', err);
      setError(err.response?.data?.message || 'The AI is taking a nap. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Master renderer for the Lazy Genius persona
  const renderSummary = (text) => {
    if (!text) return null;
    
    const lines = text.split('\n').filter(line => line.trim());
    
    return (
      <div className="space-y-10">
        {lines.map((line, i) => {
          // Detect Sections based on the persona prompt
          const isSection = line.startsWith('###') || 
                            line.includes('What is') || 
                            line.includes('How It Works') || 
                            line.includes('Why You Should Care') || 
                            line.includes('The Lazy Summary');
                            
          const isBullet = line.trim().startsWith('*') || line.trim().startsWith('-');
          
          let content = line.replace(/^###\s*/, '').replace(/^[*-\s]+/, '');
          
          // Parse **bold** text (if AI uses it despite instructions)
          const parts = content.split(/(\*\*.*?\*\*)/g);
          const parsedContent = parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={index} className="font-black text-zinc-900 dark:text-white">{part.slice(2, -2)}</strong>;
            }
            return part;
          });

          if (isSection) {
            return (
              <div key={i} className="relative pt-8 first:pt-0">
                <div className="absolute top-0 left-0 w-8 h-1 bg-indigo-500 rounded-full opacity-30" />
                <h4 className="text-2xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight flex items-center gap-3">
                  {parsedContent}
                </h4>
              </div>
            );
          }
          
          if (isBullet) {
            return (
              <div key={i} className="flex items-start gap-4 group pl-2">
                <div className="mt-2.5 w-4 h-4 rounded-full border-2 border-indigo-500/30 flex items-center justify-center flex-shrink-0 group-hover:border-indigo-500 transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 text-lg md:text-xl font-medium leading-relaxed">
                  {parsedContent}
                </p>
              </div>
            );
          }
          
          return (
            <p key={i} className="text-zinc-600 dark:text-zinc-400 text-lg md:text-xl font-medium leading-relaxed pl-2">
              {parsedContent}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <section className="mb-16 mt-8">
      {/* Premium Toggle Button */}
      <motion.button
        onClick={handleToggle}
        disabled={loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "group flex items-center gap-4 px-8 py-4 rounded-2xl font-black transition-all relative overflow-hidden",
          "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-2xl shadow-indigo-500/20",
          loading && "opacity-80 cursor-wait"
        )}
      >
        <div className="relative z-10 flex items-center gap-3">
          {loading ? (
            <Loader className="w-5 h-5 animate-spin text-indigo-400" />
          ) : (
            <Sparkles className={cn("w-5 h-5 text-indigo-400 transition-transform group-hover:rotate-12", isExpanded && "animate-pulse")} />
          )}
          <span className="tracking-tight">
            {loading ? "Neural Net Computing..." : "Explain Like I'm Lazy"}
          </span>
          <ChevronDown className={cn("w-4 h-4 ml-2 transition-transform duration-500", isExpanded && "rotate-180")} />
        </div>
        
        {/* Background Gradient Pulse */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0, y: -20 }}
            animate={{ height: 'auto', opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <div className={cn(
              "mt-6 p-8 md:p-12 rounded-[40px] border relative",
              "bg-white dark:bg-zinc-950 border-zinc-100 dark:border-zinc-800",
              "shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] dark:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)]"
            )}>
              {/* Decorative Neural Aura */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-white">
                      Lazy Genius AI
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                        Operational • AI Powered Insight
                      </span>
                    </div>
                  </div>
                </div>

                {summary && !loading && (
                  <button 
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-zinc-500 hover:text-indigo-600 transition-colors"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    <span className="text-xs font-bold uppercase tracking-widest">{copied ? "Copied!" : "Copy Insight"}</span>
                  </button>
                )}
              </div>

              {error ? (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="p-6 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-3xl flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-red-600">
                    <AlertCircle size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-red-600 dark:text-red-400">{error}</p>
                    <button onClick={fetchSummary} className="text-xs font-black uppercase text-red-500 underline mt-1">Request Reboot</button>
                  </div>
                </motion.div>
              ) : (
                <div className="relative z-10">
                  {loading ? (
                    <div className="space-y-6">
                      <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded-full w-3/4 animate-pulse" />
                      <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded-full w-full animate-pulse" />
                      <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded-full w-5/6 animate-pulse" />
                      <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded-full w-1/2 animate-pulse" />
                    </div>
                  ) : (
                    <div className="max-w-none">
                      {renderSummary(summary || "Summoning the genius within...")}
                    </div>
                  )}
                </div>
              )}

              <div className="mt-12 pt-8 border-t border-zinc-100 dark:border-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                  <Zap className="w-4 h-4 text-yellow-500 fill-current" />
                  Efficiency Target: 100%
                </div>
                <div className="px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                  Processed by Lazy-Genius Engine v2.0
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default LazySummary;
