import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Loader2, AlertCircle, Tag as TagIcon, ArrowLeft, Eye, Edit3, BookOpen, Send, FileText, Image as ImageIcon, X, Sparkles, RefreshCcw } from 'lucide-react';
import blogService from '@/services/blogService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import SmartCoverPicker from '@/components/blog/SmartCoverPicker';

// Premium Curated Cover Images
import cover1 from '@/assets/covers/cover1.png';
import cover2 from '@/assets/covers/cover2.png';
import cover3 from '@/assets/covers/cover3.png';
import cover4 from '@/assets/covers/cover4.png';
import cover5 from '@/assets/covers/cover5.png';
import cover6 from '@/assets/covers/cover6.png';
import cover7 from '@/assets/covers/cover7.png';
import cover8 from '@/assets/covers/cover8.png';
import cover9 from '@/assets/covers/cover9.png';
import cover10 from '@/assets/covers/cover10.png';
import cover11 from '@/assets/covers/cover11.png';
import cover12 from '@/assets/covers/cover12.png';
import cover13 from '@/assets/covers/cover13.png';
import cover14 from '@/assets/covers/cover14.png';
import cover15 from '@/assets/covers/cover15.png';
import cover16 from '@/assets/covers/cover16.png';
import cover17 from '@/assets/covers/cover17.png';
import cover18 from '@/assets/covers/cover18.png';
import cover19 from '@/assets/covers/cover19.png';
import cover20 from '@/assets/covers/cover20.png';
import cover21 from '@/assets/covers/cover21.png';

const ALL_COVERS = [
  cover1, cover2, cover3, cover4, cover5, cover6, cover7, cover8, cover9, cover10,
  cover11, cover12, cover13, cover14, cover15, cover16, cover17, cover18, cover19, cover20, cover21
];

const EditBlog = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('AI Basics');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [status, setStatus] = useState('published');
  const [image, setImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [showSmartCoverPicker, setShowSmartCoverPicker] = useState(false);
  const [coverIndex, setCoverIndex] = useState(0);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const blog = await blogService.getBlogById(id);
        setTitle(blog.title);
        setContent(blog.content);
        setTags(blog.tags?.join(', ') || '');
        setCategory(blog.category || 'AI Basics');
        setStatus(blog.status || 'published');
        setImage(blog.image || '');
      } catch (err) {
        setError('Failed to load the blog post.');
      } finally {
        setFetching(false);
      }
    };
    fetchBlog();
  }, [id]);

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

  const handleSubmit = async (e, newStatus) => {
    if (e) e.preventDefault();
    if (!title || !content) {
      setError('Please provide both a title and content.');
      return;
    }

    setLoading(true);
    setError('');

    const targetStatus = newStatus || status;

    try {
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
      
      await blogService.updateBlog(id, {
        title,
        content,
        tags: tagsArray,
        category,
        status: targetStatus,
        image
      });

      if (targetStatus === 'published') {
        navigate(`/blog/${id}`);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update blog.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        <p className="text-gray-500 font-bold animate-pulse">Loading story...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 pb-32">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Refine your <span className="text-indigo-600">Thought</span>
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-zinc-800 p-1.5 rounded-2xl">
              <button onClick={() => setIsPreview(false)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${!isPreview ? "bg-white dark:bg-zinc-700 text-indigo-600 shadow-sm" : "text-gray-500"}`}><Edit3 size={16} /> Edit</button>
              <button onClick={() => setIsPreview(true)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${isPreview ? "bg-white dark:bg-zinc-700 text-indigo-600 shadow-sm" : "text-gray-500"}`}><Eye size={16} /> Preview</button>
            </div>
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors"><ArrowLeft size={16} /> Back</button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/20 text-red-600 p-4 rounded-2xl border border-red-100"><AlertCircle size={20} /><p className="text-sm font-medium">{error}</p></div>
        )}

        <div className="space-y-6">
          <div className="relative group">
            {image ? (
              <div className="relative w-full h-64 sm:h-96 rounded-[32px] overflow-hidden shadow-2xl group">
                <img src={image} alt="Cover" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                {/* Desktop hover overlay */}
                <div className="hidden sm:flex absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center">
                  <button onClick={() => setImage('')} className="p-3 bg-red-600 text-white rounded-full shadow-xl hover:bg-red-700 transition-all active:scale-90">
                    <X size={24} />
                  </button>
                </div>
                {/* Mobile permanent close button */}
                <button 
                  onClick={() => setImage('')} 
                  className="sm:hidden absolute top-4 right-4 p-2 bg-red-600/90 text-white rounded-full shadow-xl backdrop-blur-md active:scale-95 transition-all z-20"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className={`flex flex-col items-center justify-center w-full h-64 sm:h-96 border-2 border-dashed rounded-[32px] cursor-pointer transition-all ${uploading ? "bg-gray-50 border-indigo-300" : "bg-gray-50/50 border-gray-200 hover:border-indigo-400"}`}>
                {isGeneratingImage || uploading ? (
                  <div className="flex flex-col items-center gap-4"><Loader2 className="animate-spin text-indigo-600" size={48} /><p className="text-sm font-black text-indigo-600 uppercase tracking-widest">{uploading ? 'Uploading...' : 'Choosing Cover...'}</p></div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-6 bg-white dark:bg-zinc-800 rounded-full shadow-lg text-gray-400 group-hover:text-indigo-600 transition-colors"><ImageIcon size={48} /></div>
                    <div className="text-center"><p className="text-lg font-black text-gray-900 dark:text-white">Choose a cover masterpiece</p><p className="text-xs font-medium text-gray-500 mt-1 uppercase tracking-widest">Click to upload from gallery</p></div>
                  </div>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading || isGeneratingImage} />
              </label>
            )}

            {!image && !uploading && (
              <div className="flex gap-2 absolute bottom-6 right-6">
                <button onClick={handleGenerateImage} disabled={isGeneratingImage} className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-zinc-800 text-indigo-600 rounded-2xl shadow-xl font-black text-xs uppercase tracking-widest transition-all hover:scale-105 border border-indigo-50">{isGeneratingImage ? <Loader2 size={16} className="animate-spin" /> : <RefreshCcw size={16} />}<span>Random</span></button>
                <button onClick={() => setShowSmartCoverPicker(true)} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-2xl shadow-xl font-black text-xs uppercase tracking-widest transition-all hover:scale-105 border border-indigo-50"><Sparkles size={16} /><span>AI Cover</span></button>
              </div>
            )}
            {image && !uploading && !isGeneratingImage && (
              <div className="flex gap-2 absolute bottom-6 right-6">
                <button onClick={handleGenerateImage} className="flex items-center gap-2 px-6 py-3 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md text-indigo-600 rounded-2xl shadow-xl font-black text-xs uppercase tracking-widest transition-all hover:scale-105 border border-indigo-50"><RefreshCcw size={16} /><span>Random</span></button>
                <button onClick={() => setShowSmartCoverPicker(true)} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-2xl shadow-xl font-black text-xs uppercase tracking-widest transition-all hover:scale-105 border border-indigo-50"><Sparkles size={16} /><span>AI Cover</span></button>
              </div>
            )}
          </div>

          <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Give it a catchy title..." className="w-full text-4xl sm:text-5xl font-black border-none bg-transparent focus:ring-0 placeholder-gray-300 text-gray-900 dark:text-white" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3"><BookOpen className="text-gray-400" size={20} /><select value={category} onChange={(e) => setCategory(e.target.value)} className="bg-transparent border-none focus:ring-0 text-sm text-gray-900 dark:text-white font-bold cursor-pointer"><option value="AI Basics">AI Basics</option><option value="Tools">Tools</option><option value="Projects">Projects</option><option value="Tutorials">Tutorials</option></select></div>
            <div className="flex items-center gap-3"><TagIcon className="text-gray-400" size={20} /><input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Add tags (separated by commas)" className="flex-grow bg-transparent border-none focus:ring-0 text-sm text-gray-600 dark:text-gray-400 placeholder-gray-300" /></div>
          </div>

          <div className="relative min-h-[400px]">
            <AnimatePresence mode="wait">
              {!isPreview ? (
                <motion.textarea key="editor" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} required value={content} onChange={(e) => setContent(e.target.value)} placeholder="Tell your story..." className="w-full min-h-[400px] text-xl border-none bg-transparent focus:ring-0 resize-none placeholder-gray-300 text-gray-800 dark:text-zinc-300 leading-relaxed outline-none" />
              ) : (
                <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="prose prose-lg dark:prose-invert max-w-none pt-4"><ReactMarkdown remarkPlugins={[remarkGfm]}>{content || "*Nothing to preview yet...*"}</ReactMarkdown></motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md px-6 py-3 rounded-full border border-gray-100 dark:border-zinc-800 shadow-2xl z-50">
            <button type="button" onClick={() => navigate(-1)} className="px-6 py-2 rounded-full text-gray-500 font-bold hover:text-gray-900 transition-colors">Cancel</button>
            
            {status === 'draft' ? (
              <>
                <button onClick={(e) => handleSubmit(e, 'draft')} disabled={loading} className="flex items-center gap-2 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 px-6 py-2.5 rounded-full font-bold hover:bg-gray-200 transition-all active:scale-95">
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <FileText size={20} />}
                  Update Draft
                </button>
                <button onClick={(e) => handleSubmit(e, 'published')} disabled={loading} className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-2.5 rounded-full font-bold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-all active:scale-95">
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                  Publish Now
                </button>
              </>
            ) : (
              <button onClick={(e) => handleSubmit(e)} disabled={loading} className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-2.5 rounded-full font-bold shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all active:scale-95">
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                {loading ? 'Saving Changes...' : 'Save Changes'}
              </button>
            )}
          </div>
        </div>
      </motion.div>
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

export default EditBlog;
