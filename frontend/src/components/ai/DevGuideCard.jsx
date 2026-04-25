import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, 
  Cpu, 
  Copy, 
  Check, 
  AlertCircle, 
  Loader2, 
  Rocket, 
  Code2, 
  Lightbulb,
  FileCode2,
  Target
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/utils/cn';
import api from '@/services/api';

/**
 * DevGuideCard Component
 * A senior-dev themed AI assistant that provides "Do It For Me" developer guides.
 * Features markdown rendering, code blocks, and premium animations.
 */
const DevGuideCard = ({ content = "" }) => {
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleGenerateGuide = async () => {
    if (!content) {
      setError("No content found to process.");
      return;
    }

    setLoading(true);
    setError(null);
    setGuide(null);

    try {
      const { data } = await api.post('/ai/dev-guide', { content });
      
      if (data && data.guide) {
        setGuide(data.guide);
      } else {
        throw new Error("Invalid response from AI");
      }
    } catch (err) {
      console.error('Dev Guide Error:', err);
      setError("Failed to build the guide. Even senior devs have bad days 😅");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!guide) return;
    navigator.clipboard.writeText(guide);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn(
      "relative w-full max-w-4xl mx-auto overflow-hidden",
      "rounded-3xl border transition-all duration-500",
      "shadow-2xl hover:shadow-indigo-500/10",
      "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800",
      "p-8 my-12"
    )}>
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-10 relative z-10">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
            <Terminal size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
              Lazy Genius <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Dev Guide</span>
            </h3>
            <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <Cpu size={14} className="text-indigo-500" />
              Do It For Me Edition
            </p>
          </div>
        </div>
        
        {guide && (
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-zinc-500 hover:text-indigo-600 transition-all border border-zinc-100 dark:border-zinc-800 font-bold text-xs uppercase tracking-tighter"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Copied!" : "Copy Code"}
          </button>
        )}
      </div>

      {/* Main Action / Content */}
      <AnimatePresence mode="wait">
        {!guide && !loading ? (
          <motion.div
            key="initial"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full animate-pulse" />
              <div className="relative p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-inner">
                <Code2 size={48} className="text-indigo-500" />
              </div>
            </div>
            
            <h4 className="text-xl font-bold text-zinc-800 dark:text-zinc-200 mb-2">
              Too much text? Just want the code?
            </h4>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-md mb-10 leading-relaxed">
              Our AI will distill this article into a practical implementation guide, complete with folder structures and starter code.
            </p>

            <button
              onClick={handleGenerateGuide}
              className="group relative px-10 py-4 rounded-2xl font-black text-white transition-all overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:scale-110 transition-transform duration-500" />
              <div className="relative flex items-center gap-3">
                <Rocket size={20} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                <span>GENERATE DEV GUIDE</span>
              </div>
            </button>
          </motion.div>
        ) : loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="relative mb-6">
              <Loader2 className="w-16 h-16 text-indigo-500 animate-spin" />
              <div className="absolute inset-0 blur-2xl bg-indigo-500/20 rounded-full" />
            </div>
            <p className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-[0.2em] animate-pulse">
              Architecting Solution...
            </p>
            <div className="flex gap-1 mt-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-indigo-500/40" style={{ animation: `pulse 1.5s infinite ${i * 0.2}s` }} />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="prose prose-zinc dark:prose-invert max-w-none 
              prose-headings:font-black prose-headings:tracking-tight
              prose-h2:flex prose-h2:items-center prose-h2:gap-3 prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
              prose-p:text-zinc-600 dark:prose-p:text-zinc-400 prose-p:leading-relaxed
              prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-2xl prose-pre:shadow-2xl
              prose-code:text-indigo-400 prose-code:font-bold
              prose-ul:list-none prose-ul:pl-0
              prose-li:flex prose-li:gap-3 prose-li:mb-3
            "
          >
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({ node, ...props }) => {
                  const content = props.children.toString();
                  let icon = <Lightbulb className="text-yellow-500" />;
                  if (content.includes('🧠')) icon = <BrainIcon />;
                  if (content.includes('⚡')) icon = <Rocket className="text-orange-500" />;
                  if (content.includes('📁')) icon = <FileCode2 className="text-blue-500" />;
                  if (content.includes('💻')) icon = <Code2 className="text-indigo-500" />;
                  if (content.includes('🚀')) icon = <Rocket className="text-green-500" />;
                  if (content.includes('📝')) icon = <Lightbulb className="text-purple-500" />;
                  if (content.includes('🎯')) icon = <Target className="text-red-500" />;
                  
                  return (
                    <h2 {...props} className="flex items-center gap-3 text-zinc-900 dark:text-white group">
                      <span className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 group-hover:scale-110 transition-transform">
                        {icon}
                      </span>
                      {props.children}
                    </h2>
                  );
                },
                li: ({ node, ...props }) => (
                  <li className="flex gap-3 text-zinc-600 dark:text-zinc-400">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                    <span>{props.children}</span>
                  </li>
                )
              }}
            >
              {guide}
            </ReactMarkdown>

            <div className="mt-12 pt-8 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
              <button
                onClick={() => setGuide(null)}
                className="text-xs font-black text-zinc-400 hover:text-indigo-500 transition-colors uppercase tracking-widest flex items-center gap-2"
              >
                <span>← BACK TO MENU</span>
              </button>
              <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-tighter">
                Crafted by Lazy Genius Engine v2.0
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      {error && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 rounded-2xl border border-red-100 bg-red-50 dark:bg-red-900/10 dark:border-red-900/30 flex items-start gap-4"
        >
          <AlertCircle className="text-red-600 mt-1 flex-shrink-0" size={20} />
          <div>
            <p className="text-sm font-bold text-red-600 dark:text-red-400 uppercase tracking-tight">
              Build Failed
            </p>
            <p className="text-sm text-red-500/80 mb-2">{error}</p>
            <button 
              onClick={handleGenerateGuide}
              className="text-xs font-black text-red-600 underline uppercase"
            >
              RETRY BUILD
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

const BrainIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-500">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.54Z"/>
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.54Z"/>
  </svg>
);

export default DevGuideCard;
