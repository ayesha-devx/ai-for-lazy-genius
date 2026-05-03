import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, AlertCircle, Tag as TagIcon, Eye, Edit3, BookOpen, Sparkles, RefreshCcw, FileText, Image as ImageIcon, X } from 'lucide-react';
import blogService from '@/services/blogService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import SmartCoverPicker from '@/components/blog/SmartCoverPicker';

// Premium Curated Cover Images
const ALL_COVERS = Array.from({ length: 21 }, (_, i) => `/covers/cover${i + 1}.png`);

const Write = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('AI Basics');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [image, setImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [coverIndex, setCoverIndex] = useState(0);
  
  // AI States
  const [aiTopic, setAiTopic] = useState('');
  const [aiTone, setAiTone] = useState('Lazy Genius');
  const [aiLevel, setAiLevel] = useState('Beginner');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showAiTool, setShowAiTool] = useState(false);
  const [showSmartCoverPicker, setShowSmartCoverPicker] = useState(false);
  
  const navigate = useNavigate();

  const handleAiGenerate = async () => {
    if (!aiTopic) {
      setError('Please provide a topic for the AI to write about.');
      return;
    }

    setIsAiLoading(true);
    setError('');

    try {
      const { content: generatedContent } = await blogService.generateBlogWithAI({
        topic: aiTopic,
        tone: aiTone,
        level: aiLevel
      });

      const lines = generatedContent.split('\n');
      const possibleTitle = lines[0].startsWith('# ') ? lines[0].replace('# ', '').trim() : '';
      
      if (possibleTitle) {
        setTitle(possibleTitle);
        setContent(lines.slice(1).join('\n').trim());
      } else {
        setContent(generatedContent);
      }
      
      setTags(aiTopic.toLowerCase().split(' ').join(', '));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate blog with AI.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const data = await blogService.uploadImage(formData);
      setImage(data.imageUrl);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  const handleGenerateImage = async () => {
    setIsGeneratingImage(true);
    setError('');

    try {
      // 🥇 Smart Cover Picker: Premium Curated Local Library
      // Cycles through 10 high-end technical images (AI, Code, Servers, Robots)
      await new Promise(resolve => setTimeout(resolve, 600));

      const nextIndex = (coverIndex + 1) % ALL_COVERS.length;
      setImage(ALL_COVERS[coverIndex]);
      setCoverIndex(nextIndex);
      
    } catch (err) {
      setError("Failed to fetch smart cover.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Smart UX: Auto-generate image is now disabled per user request
  // Only manual selection or upload will trigger image loading

  const handleSubmit = async (e, status = 'published') => {
    if (e) e.preventDefault();
    if (!title || !content) {
      setError('Please provide both a title and content.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
      
      await blogService.createBlog({
        title,
        content,
        tags: tagsArray,
        category,
        status,
        image
      });

      navigate('/dashboard');
    } catch (err) {
      const action = status === 'published' ? 'publish' : 'save draft';
      setError(err.response?.data?.message || `Failed to ${action}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pt-0 pb-32 px-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight text-center sm:text-left">
            Draft your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-600 animate-gradient">Thought</span>
          </h2>
          
          <div className="flex items-center justify-center sm:justify-start gap-2 bg-slate-100 dark:bg-[#111827]/50 p-1.5 rounded-2xl border border-slate-200/50 dark:border-white/5">
            <button 
              onClick={() => setIsPreview(false)}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                !isPreview 
                  ? "bg-white dark:bg-[#111827] text-purple-600 shadow-sm border border-slate-200/50 dark:border-white/10" 
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              <Edit3 size={16} /> Edit
            </button>
            <button 
              onClick={() => setIsPreview(true)}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                isPreview 
                  ? "bg-white dark:bg-[#111827] text-purple-600 shadow-sm border border-slate-200/50 dark:border-white/10" 
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              <Eye size={16} /> Preview
            </button>
          </div>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-2xl border border-red-100 dark:border-red-900/30"
          >
            <AlertCircle size={20} />
            <p className="text-sm font-medium">{error}</p>
          </motion.div>
        )}

        <div className="relative">
          <button 
            type="button"
            onClick={() => setShowAiTool(!showAiTool)}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-sm font-black transition-all w-full sm:w-auto ${
              showAiTool 
                ? "bg-purple-600 text-white shadow-xl shadow-purple-500/30" 
                : "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/50 hover:bg-purple-100 hover:-translate-y-0.5"
            }`}
          >
            <Sparkles size={16} />
            {showAiTool ? "Close AI Writer" : "Write with AI"}
          </button>

          <AnimatePresence>
            {showAiTool && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 p-6 bg-white dark:bg-[#111827] border border-purple-100 dark:border-white/10 rounded-[32px] shadow-2xl space-y-6 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[60px] pointer-events-none" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                  <div className="md:col-span-1">
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Topic</label>
                    <input 
                      type="text"
                      value={aiTopic}
                      onChange={(e) => setAiTopic(e.target.value)}
                      placeholder="e.g. Future of AI"
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-purple-500 outline-none text-slate-900 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Tone</label>
                    <select 
                      value={aiTone}
                      onChange={(e) => setAiTone(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-purple-500 outline-none font-bold text-slate-700 dark:text-slate-300"
                    >
                      <option value="Lazy Genius">Lazy Genius 😎</option>
                      <option value="Technical">Technical</option>
                      <option value="Simple">Simple</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Level</label>
                    <select 
                      value={aiLevel}
                      onChange={(e) => setAiLevel(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-purple-500 outline-none font-bold text-slate-700 dark:text-slate-300"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end relative z-10">
                  <button
                    type="button"
                    onClick={handleAiGenerate}
                    disabled={isAiLoading}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-2xl font-black shadow-lg shadow-purple-500/20 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-70"
                  >
                    {isAiLoading ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        <span>AI is thinking...</span>
                      </>
                    ) : (
                      <>
                        {content ? <RefreshCcw size={18} /> : <Sparkles size={18} />}
                        <span>{content ? 'Regenerate' : 'Generate with AI ⚡'}</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-6">
          <div className="relative group">
            {image ? (
              <div className="relative w-full h-64 sm:h-[400px] rounded-2xl sm:rounded-[40px] overflow-hidden shadow-2xl group border border-slate-200 dark:border-white/5">
                <img src={image} alt="Cover" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                {/* Desktop hover overlay */}
                <div className="hidden sm:flex absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center justify-center backdrop-blur-sm">
                  <button onClick={() => setImage('')} className="p-4 bg-rose-500/90 text-white rounded-full shadow-2xl hover:bg-rose-600 transition-all hover:scale-110">
                    <X size={24} />
                  </button>
                </div>
                {/* Mobile permanent close button */}
                <button 
                  onClick={() => setImage('')} 
                  className="sm:hidden absolute top-4 right-4 p-2.5 bg-rose-500/90 text-white rounded-full shadow-2xl backdrop-blur-md active:scale-95 transition-all z-20"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <label className={`flex flex-col items-center justify-center w-full h-64 sm:h-[400px] border-2 border-dashed rounded-2xl sm:rounded-[40px] cursor-pointer transition-all duration-300 ${
                uploading ? "bg-purple-50 border-purple-300" : "bg-slate-50/50 dark:bg-[#111827]/50 border-slate-200 dark:border-white/10 hover:border-purple-400"
              }`}>
                {isGeneratingImage ? (
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-purple-600" size={48} />
                    <p className="text-sm font-black text-purple-600 uppercase tracking-widest">Choosing a cover...</p>
                  </div>
                ) : uploading ? (
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-purple-600" size={48} />
                    <p className="text-sm font-black text-purple-600 uppercase tracking-widest">Uploading...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-5">
                    <div className="p-6 bg-white dark:bg-white/5 rounded-full shadow-sm text-slate-400 group-hover:text-purple-600 transition-all">
                      <ImageIcon size={48} />
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-black text-slate-900 dark:text-white">Need a premium cover?</p>
                      <p className="text-xs font-bold text-slate-500 mt-2 tracking-widest">Choose a masterpiece or upload from gallery</p>
                    </div>
                  </div>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading || isGeneratingImage} />
              </label>
            )}

            {!image && !uploading && (
              <div className="flex gap-2 sm:absolute relative mt-4 sm:mt-0 sm:bottom-6 sm:right-6 w-full sm:w-auto">
                <button 
                  onClick={handleGenerateImage}
                  disabled={isGeneratingImage}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-white/90 dark:bg-[#111827]/90 backdrop-blur-md text-slate-600 dark:text-slate-300 rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:-translate-y-1 border border-slate-200 dark:border-white/10 shadow-xl"
                >
                  {isGeneratingImage ? <Loader2 size={16} className="animate-spin" /> : <RefreshCcw size={16} />}
                  <span>Random</span>
                </button>
                <button 
                  onClick={() => setShowSmartCoverPicker(true)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:-translate-y-1 shadow-xl shadow-purple-500/30"
                >
                  <Sparkles size={16} />
                  <span>AI Cover</span>
                </button>
              </div>
            )}

            {image && !uploading && !isGeneratingImage && (
              <div className="flex gap-2 sm:absolute relative mt-4 sm:mt-0 sm:bottom-6 sm:right-6 w-full sm:w-auto">
                <button 
                  onClick={handleGenerateImage}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-white/90 dark:bg-[#111827]/90 backdrop-blur-md text-slate-600 dark:text-slate-300 rounded-2xl shadow-xl font-black text-xs uppercase tracking-widest transition-all hover:-translate-y-1 border border-slate-200 dark:border-white/10"
                >
                  <RefreshCcw size={16} />
                  <span>Random</span>
                </button>
                <button 
                  onClick={() => setShowSmartCoverPicker(true)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-2xl shadow-xl shadow-purple-500/30 font-black text-xs uppercase tracking-widest transition-all hover:-translate-y-1"
                >
                  <Sparkles size={16} />
                  <span>AI Cover</span>
                </button>
              </div>
            )}
          </div>

          <div className="relative group">
            <input 
              type="text" 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give it a catchy title..." 
              className="w-full text-2xl sm:text-5xl lg:text-6xl font-black border-none bg-transparent focus:ring-0 placeholder-slate-300 dark:placeholder-slate-700 text-slate-900 dark:text-white py-2"
            />
            <div className="absolute bottom-0 left-0 h-1 w-0 group-focus-within:w-full bg-gradient-to-r from-purple-600 to-fuchsia-500 transition-all duration-500 rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-b border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-50 dark:bg-white/5 rounded-xl text-slate-400">
                <BookOpen size={20} />
              </div>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-sm text-slate-900 dark:text-white font-bold cursor-pointer"
              >
                <option value="AI Basics">AI Basics</option>
                <option value="Tools">Tools</option>
                <option value="Projects">Projects</option>
                <option value="Tutorials">Tutorials</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-50 dark:bg-white/5 rounded-xl text-slate-400">
                <TagIcon size={20} />
              </div>
              <input 
                type="text" 
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Add tags (separated by commas)" 
                className="flex-grow bg-transparent border-none focus:ring-0 text-sm font-medium text-slate-600 dark:text-slate-400 placeholder-slate-300"
              />
            </div>
          </div>

          <div className="relative min-h-[500px]">
            <AnimatePresence mode="wait">
              {!isPreview ? (
                <motion.textarea 
                  key="editor"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tell your story... (Markdown supported)" 
                  className="w-full min-h-[500px] text-lg sm:text-xl border-none bg-transparent focus:ring-0 resize-none placeholder-slate-300 dark:placeholder-slate-700 text-slate-800 dark:text-slate-300 leading-relaxed font-medium outline-none"
                />
              ) : (
                <motion.div 
                  key="preview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="prose prose-lg prose-slate dark:prose-invert max-w-none pt-4"
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content || "*Nothing to preview yet...*"}
                  </ReactMarkdown>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      <div className="fixed bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1.5 sm:gap-3 bg-white/95 dark:bg-[#111827]/95 backdrop-blur-xl px-2 sm:px-4 py-2 sm:py-3 rounded-full border border-slate-200/50 dark:border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.2)] z-50 w-[94%] sm:w-auto">
        <button type="button" onClick={() => navigate(-1)} className="px-3 sm:px-6 py-2 sm:py-3 rounded-full text-slate-500 font-bold hover:text-slate-900 transition-colors text-xs sm:text-base">Cancel</button>
        <button onClick={() => handleSubmit(null, 'draft')} disabled={loading} className="flex-shrink-0 flex items-center gap-1.5 sm:gap-2 bg-slate-100 dark:bg-white/5 px-3.5 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold transition-all hover:-translate-y-0.5 disabled:opacity-70 text-xs sm:text-base">
          {loading ? <Loader2 className="animate-spin" size={16} /> : <FileText size={14} />}
          <span>Save Draft</span>
        </button>
        <button onClick={(e) => handleSubmit(e, 'published')} disabled={loading} className="flex-shrink-0 flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white px-4 sm:px-8 py-2.5 sm:py-3 rounded-full font-black shadow-lg shadow-purple-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-70 text-xs sm:text-base">
          {loading ? <Loader2 className="animate-spin" size={16} /> : <Send size={14} />}
          <span>Publish Post</span>
        </button>
      </div>

      <AnimatePresence>
        {showSmartCoverPicker && (
          <SmartCoverPicker 
            title={title} 
            onSelect={(url) => { setImage(url); }} 
            onClose={() => setShowSmartCoverPicker(false)} 
            fallbackCovers={ALL_COVERS} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Write;
