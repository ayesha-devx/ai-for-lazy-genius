import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Brain, Copy, Check, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import api from '@/services/api';

/**
 * LazyExplainCard Component
 * A premium, modern AI assistant card that provides "Explain Like I'm Lazy" summaries.
 * Built with React, Tailwind CSS, and Framer Motion.
 */
const LazyExplainCard = ({ content = "" }) => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleExplain = async () => {
    if (!content) {
      setError("No content found to analyze.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // API call to the backend AI summarization endpoint
      const { data } = await api.post('/ai/summarize', { content });
      
      if (data && data.summary) {
        setResult(parseAIResponse(data.summary));
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error('Lazy Genius Error:', err);
      setError("Something broke… even lazy genius has limits 😅");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    
    // Combine sections back for plain text copy
    const fullText = Object.entries(result)
      .map(([key, value]) => `${key.replace(/([A-Z])/g, ' $1').trim()}:\n${value}`)
      .join('\n\n');
      
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /**
   * Parses the AI response into structured sections.
   * Expects sections like "Big Idea", "How It Works", etc.
   */
  const parseAIResponse = (text) => {
    const sections = {
      bigIdea: "",
      howItWorks: "",
      whyItMatters: "",
      lazySummary: ""
    };

    const lines = text.split('\n').filter(l => l.trim());
    let currentKey = 'bigIdea';

    lines.forEach(line => {
      const lowerLine = line.toLowerCase();
      if (lowerLine.includes('big idea')) currentKey = 'bigIdea';
      else if (lowerLine.includes('how it works')) currentKey = 'howItWorks';
      else if (lowerLine.includes('why it matters') || lowerLine.includes('why you should care')) currentKey = 'whyItMatters';
      else if (lowerLine.includes('lazy summary')) currentKey = 'lazySummary';
      else {
        // Aggressively remove markdown formatting like ** or ###
        const cleanLine = line.replace(/\*\*/g, '').replace(/^[#*\s-]+/, '').trim();
        if (cleanLine) {
          sections[currentKey] += (sections[currentKey] ? ' ' : '') + cleanLine;
        }
      }
    });

    // Fallback: if parsing failed to populate fields, treat whole text as lazy summary
    if (!sections.lazySummary && text) {
      return {
        bigIdea: "Main Point",
        howItWorks: "Detailed in the post.",
        whyItMatters: "Crucial context.",
        lazySummary: text
      };
    }

    return sections;
  };

  return (
    <div className={cn(
      "relative w-full max-w-2xl mx-auto overflow-hidden",
      "rounded-2xl border transition-all duration-300",
      "shadow-lg hover:shadow-xl",
      "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800",
      "p-6 my-8"
    )}>
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
            <Brain size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Lazy Genius AI
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Optimized for laziness</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300">
          AI Powered
        </span>
      </div>

      {/* Action Button */}
      {!result && !loading && (
        <div className="flex flex-col items-center justify-center py-10 space-y-4">
          <div className="p-4 rounded-full bg-zinc-50 dark:bg-zinc-800/50">
            <Sparkles size={32} className="text-indigo-500 animate-pulse" />
          </div>
          <p className="text-zinc-500 text-center max-w-xs text-sm">
            Can't be bothered to read the whole thing? Let me do it for you.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExplain}
            className={cn(
              "px-8 py-3 rounded-full font-bold text-white transition-all shadow-md",
              "bg-gradient-to-r from-purple-600 to-indigo-600",
              "hover:shadow-indigo-500/25"
            )}
          >
            Explain Like I'm Lazy
          </motion.button>
        </div>
      )}

      {/* Loading State */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12 space-y-4"
          >
            <div className="relative">
              <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
              <div className="absolute inset-0 blur-xl bg-indigo-500/20 animate-pulse rounded-full" />
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium">
              Thinking lazily...
            </p>
            
            {/* Shimmer Skeleton */}
            <div className="w-full space-y-4 mt-8 opacity-50">
              <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full w-3/4 animate-pulse" />
              <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full w-full animate-pulse" />
              <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full w-5/6 animate-pulse" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      {error && !loading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-xl border border-red-100 bg-red-50 dark:bg-red-900/10 dark:border-red-900/30 flex items-start gap-3"
        >
          <AlertCircle className="text-red-600 mt-0.5 flex-shrink-0" size={18} />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-600 dark:text-red-400">
              {error}
            </p>
            <button 
              onClick={handleExplain}
              className="mt-2 text-xs font-bold text-red-500 underline uppercase tracking-tighter"
            >
              Try Again
            </button>
          </div>
        </motion.div>
      )}

      {/* Result Output */}
      <AnimatePresence>
        {result && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative space-y-6"
          >
            {/* Copy Button */}
            <div className="absolute top-0 right-0">
              <button
                onClick={copyToClipboard}
                className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-500 hover:text-indigo-600 transition-colors border border-zinc-100 dark:border-zinc-700"
                title="Copy Summary"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>

            {/* Sections */}
            <Section title="Big Idea" content={result.bigIdea} color="text-black dark:text-white" />
            <Section title="How It Works" content={result.howItWorks} />
            <Section title="Why It Matters" content={result.whyItMatters} />
            
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <Section 
                title="Lazy Summary" 
                content={result.lazySummary} 
                className="bg-indigo-50/30 dark:bg-indigo-900/10 p-4 rounded-xl"
              />
            </div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setResult(null)}
              className="text-xs font-bold text-zinc-400 hover:text-zinc-600 uppercase tracking-widest pt-4"
            >
              ← Back to menu
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Section = ({ title, content, color = "text-zinc-900 dark:text-zinc-100", className }) => (
  <div className={cn("space-y-1.5", className)}>
    <h4 className={cn("text-base font-bold", color)}>
      {title}
    </h4>
    <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
      {content}
    </p>
  </div>
);

export default LazyExplainCard;
