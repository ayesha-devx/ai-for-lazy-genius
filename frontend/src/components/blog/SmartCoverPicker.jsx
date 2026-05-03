import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, X, RefreshCcw, Sparkles, Check } from 'lucide-react';
import api from '@/services/api';

const ImageItem = ({ url, onSelect, selected, onFallback }) => {
  const [loading, setLoading] = useState(true);

  return (
    <div 
      onClick={() => { onSelect(url); }}
      className={`relative aspect-video rounded-2xl overflow-hidden cursor-pointer border-4 transition-all duration-300 ${
        selected 
          ? "border-purple-600 shadow-xl shadow-purple-500/20 scale-[1.02]" 
          : "border-transparent hover:border-purple-300 dark:hover:border-purple-500/50"
      }`}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-white/5">
          <Loader2 className="animate-spin text-purple-600" size={24} />
        </div>
      )}
      <img 
        src={url} 
        alt="AI Generated Cover" 
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          if (onFallback) onFallback();
        }}
        className={`w-full h-full object-cover transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
        referrerPolicy="no-referrer"
      />
      {selected && (
        <div className="absolute top-4 right-4 bg-purple-600 text-white p-1.5 rounded-full shadow-lg">
          <Check size={16} strokeWidth={3} />
        </div>
      )}
    </div>
  );
};

const SmartCoverPicker = ({ title, onSelect, onClose, fallbackCovers }) => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const generateImages = () => {
    setSelectedImage(null);
    setImages([null, null, null, null]); // Show placeholders
    
    const safeTitle = (title || "Modern AI Technology").replace(/[^a-zA-Z0-9 ]/g, '');
    const basePrompt = `${safeTitle} modern minimal tech blog cover futuristic UI dark theme`;
    
    // Force localhost API in development since the user's .env points to Render
    const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const baseUrl = isDev ? 'http://localhost:5000/api' : api.defaults.baseURL;
    
    // Stagger by 2500ms to safely bypass Pollinations rate limits
    Array.from({ length: 4 }).forEach((_, i) => {
      setTimeout(() => {
        const seed = Math.floor(Math.random() * 1000000);
        const url = `${baseUrl}/ai/pollinations?prompt=${encodeURIComponent(basePrompt)}&seed=${seed}`;
        setImages(prev => {
          const newImages = [...prev];
          newImages[i] = url;
          return newImages;
        });
      }, i * 2500);
    });
  };

  useEffect(() => {
    generateImages();
  }, [title]);

  const handleFallback = (index) => {
    setImages(prev => {
      const newImages = [...prev];
      newImages[index] = fallbackCovers[Math.floor(Math.random() * fallbackCovers.length)];
      return newImages;
    });
  };

  const handleConfirm = () => {
    if (selectedImage) {
      onSelect(selectedImage);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between sticky top-0 bg-white dark:bg-[#111827] z-10">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="text-purple-600 flex-shrink-0" size={20} />
              AI Cover Generator
            </h3>
            <p className="text-sm text-slate-500 font-medium mt-1">Generating custom covers based on your title</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors flex-shrink-0">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <div className="p-4 sm:p-6 flex-1 overflow-y-auto bg-slate-50 dark:bg-[#0f172a]/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {images.map((url, i) => (
              url ? (
                <ImageItem 
                  key={`${url}-${i}`}
                  url={url}
                  selected={selectedImage === url}
                  onSelect={setSelectedImage}
                  onFallback={() => handleFallback(i)}
                />
              ) : (
                <div key={`skeleton-${i}`} className="relative aspect-video rounded-2xl overflow-hidden border-4 border-transparent bg-slate-100 dark:bg-[#111827]/50 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="animate-spin text-purple-600/50" size={24} />
                    <span className="text-xs font-bold text-slate-400">Summoning AI...</span>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>

        <div className="p-4 sm:p-6 border-t border-slate-100 dark:border-white/5 bg-white dark:bg-[#111827] flex flex-col sm:flex-row items-stretch sm:items-center justify-between sticky bottom-0 z-10 gap-3 sm:gap-0">
          <button 
            onClick={generateImages}
            className="flex items-center justify-center gap-2 px-5 py-3 sm:py-2.5 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors w-full sm:w-auto order-2 sm:order-1"
          >
            <RefreshCcw size={16} />
            Regenerate
          </button>
          
          <button 
            onClick={handleConfirm}
            disabled={!selectedImage}
            className="flex items-center justify-center gap-2 px-6 py-3 sm:py-2.5 rounded-xl text-sm font-black text-white bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:-translate-y-0.5 transition-all shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:hover:translate-y-0 w-full sm:w-auto order-1 sm:order-2"
          >
            Set as Thumbnail
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SmartCoverPicker;
