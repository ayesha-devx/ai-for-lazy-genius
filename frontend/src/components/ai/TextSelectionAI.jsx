import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, X, Loader2, Copy, Check, Bookmark } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/utils/cn';
import api from '@/services/api';

/**
 * TextSelectionAI Component
 * Detects text selection and provides a floating AI action button to generate smart notes.
 */
const TextSelectionAI = () => {
  const [selection, setSelection] = useState(null);
  const [showButton, setShowButton] = useState(false);
  const [buttonPos, setButtonPos] = useState({ x: 0, y: 0 });
  const [isProcessing, setIsProcessing] = useState(false);
  const [notes, setNotes] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  const containerRef = useRef(null);

  useEffect(() => {
    const handleSelectionUpdate = () => {
      // Small delay to allow selection to finalize
      const timer = setTimeout(() => {
        const sel = window.getSelection();
        const text = sel.toString().trim();

        if (text && text.length > 20) { // Only for meaningful chunks
          try {
            const range = sel.getRangeAt(0);
            const rect = range.getBoundingClientRect();

            if (rect.width > 0) {
              setSelection(text);
              setButtonPos({
                x: rect.left + rect.width / 2,
                y: rect.top - 50 // Correct for 'fixed' positioning
              });
              setShowButton(true);
            }
          } catch (e) {
            // Range might be invalid during selection change
          }
        } else {
          if (!isProcessing) setShowButton(false);
        }
      }, 100);
      return timer;
    };

    const handleMouseDown = (e) => {
      if (!e.target.closest('.ai-action-btn')) {
        setShowButton(false);
      }
    };

    // Both listeners for maximum reliability on all devices
    document.addEventListener('mouseup', handleSelectionUpdate);
    document.addEventListener('selectionchange', handleSelectionUpdate);
    document.addEventListener('mousedown', handleMouseDown);
    return () => {
      document.removeEventListener('mouseup', handleSelectionUpdate);
      document.removeEventListener('selectionchange', handleSelectionUpdate);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [isProcessing]);

  const handleGenerateNotes = async () => {
    if (!selection) return;

    setIsProcessing(true);
    setShowButton(false);
    setShowModal(true);
    setNotes(null);

    try {
      const { data } = await api.post('/ai/smart-notes', { text: selection });
      setNotes(data.notes);
    } catch (err) {
      console.error("Smart Notes Error:", err);
      setNotes("Failed to generate notes. Even AI gets tired sometimes 😅");
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = () => {
    if (!notes) return;
    navigator.clipboard.writeText(notes);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveNote = async () => {
    if (!notes || isSaved) return;
    
    setIsSaving(true);
    try {
      await api.post('/notes', {
        originalText: selection,
        aiNotes: notes,
        title: selection.split('\n')[0].slice(0, 100) + (selection.length > 100 ? '...' : '')
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      console.error("Failed to save note:", err);
      alert("Please login to save notes!");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {showButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="ai-action-btn fixed z-50 px-4 py-2 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center gap-2 hover:bg-indigo-700 transition-all border border-indigo-400/30"
            style={{ 
              left: buttonPos.x, 
              top: buttonPos.y,
              transform: 'translateX(-50%)'
            }}
            onClick={handleGenerateNotes}
          >
            <Sparkles size={16} />
            <span className="text-xs font-black uppercase tracking-tighter">Smart Notes</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Result Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-zinc-950 rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              {/* Header */}
              <div className="p-6 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-indigo-600 text-white">
                    <Brain size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-zinc-900 dark:text-white uppercase tracking-tight">Smart Notes</h3>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Lazy Genius AI</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {notes && (
                    <button 
                      onClick={copyToClipboard}
                      className="p-2 text-zinc-400 hover:text-indigo-600 transition-colors"
                    >
                      {copied ? <Check size={18} /> : <Copy size={18} />}
                    </button>
                  )}
                  <button 
                    onClick={() => setShowModal(false)}
                    className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Save Button */}
              {notes && !isProcessing && (
                <div className="absolute bottom-20 right-8 z-10">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSaveNote}
                    disabled={isSaving || isSaved}
                    className={cn(
                      "flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl",
                      isSaved 
                        ? "bg-green-500 text-white" 
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    )}
                  >
                    {isSaving ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : isSaved ? (
                      <>
                        <Check size={16} />
                        Saved ✅
                      </>
                    ) : (
                      <>
                        <Bookmark className="fill-current" size={16} />
                        Save to Brain
                      </>
                    )}
                  </motion.button>
                </div>
              )}

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                {isProcessing ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                    <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest animate-pulse">Distilling Knowledge...</p>
                  </div>
                ) : (
                  <div className="prose prose-zinc dark:prose-invert max-w-none 
                    prose-h2:text-xl prose-h2:font-black prose-h2:mt-8 prose-h2:mb-4 prose-h2:flex prose-h2:items-center prose-h2:gap-2
                    prose-p:text-sm prose-p:text-zinc-600 dark:prose-p:text-zinc-400
                    prose-li:text-sm prose-li:text-zinc-600 dark:prose-li:text-zinc-400
                  ">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {notes}
                    </ReactMarkdown>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-900 text-center">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  Selection: "{selection?.slice(0, 40)}..."
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TextSelectionAI;
