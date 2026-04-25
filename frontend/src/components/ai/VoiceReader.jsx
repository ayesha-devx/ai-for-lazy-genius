import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  VolumeX, 
  Settings, 
  ChevronRight, 
  Mic, 
  MicOff,
  FastForward,
  Rewind
} from 'lucide-react';
import { cn } from '@/utils/cn';

/**
 * VoiceReader Component
 * A premium Text-to-Speech (TTS) engine for "Lazy Mode" reading.
 * Features sentence highlighting, auto-scroll, and speed control.
 */
const VoiceReader = ({ content = "" }) => {
  const [isSupported, setIsSupported] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [rate, setRate] = useState(1);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(-1);
  const [showSettings, setShowSettings] = useState(false);

  const synth = window.speechSynthesis;
  const sentences = useRef([]);
  const utteranceRef = useRef(null);
  const isPlayingRef = useRef(false);
  const isPausedRef = useRef(false);

  // Initialize voices and content
  useEffect(() => {
    if (!window.speechSynthesis) {
      setIsSupported(false);
      return;
    }

    const loadVoices = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
      // Default to a premium-sounding English voice if available
      const defaultVoice = availableVoices.find(v => v.name.includes('Google') && v.lang.startsWith('en')) 
                          || availableVoices.find(v => v.lang.startsWith('en'))
                          || availableVoices[0];
      setSelectedVoice(defaultVoice);
    };

    loadVoices();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }

    // Prepare sentences from content
    // Strip HTML if necessary, though we assume 'content' is clean or markdown-rendered text
    // For best results, we split by common sentence enders
    const cleanText = content.replace(/<[^>]*>?/gm, '').trim();
    sentences.current = cleanText.match(/[^.!?]+[.!?]+/g) || [cleanText];

    return () => {
      synth.cancel();
    };
  }, [content, synth]);

  const stopSpeech = useCallback(() => {
    synth.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    isPlayingRef.current = false;
    isPausedRef.current = false;
    setCurrentSentenceIndex(-1);
  }, [synth]);

  const speakSentence = useCallback((index) => {
    if (index >= sentences.current.length) {
      stopSpeech();
      return;
    }

    setCurrentSentenceIndex(index);
    const utterance = new SpeechSynthesisUtterance(sentences.current[index]);
    
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.rate = rate;
    utterance.pitch = 1;

    utterance.onend = () => {
      if (isPlayingRef.current && !isPausedRef.current) {
        speakSentence(index + 1);
      }
    };

    utterance.onerror = (event) => {
      console.error('SpeechSynthesisUtterance error', event);
      stopSpeech();
    };

    utteranceRef.current = utterance;
    synth.speak(utterance);

    // Auto-scroll logic: find the highlighted element and scroll to it
    setTimeout(() => {
      const activeEl = document.getElementById(`sentence-${index}`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  }, [isPlaying, isPaused, rate, selectedVoice, synth, stopSpeech]);

  const handlePlay = () => {
    if (isPaused) {
      synth.resume();
      setIsPaused(false);
      setIsPlaying(true);
      isPausedRef.current = false;
      isPlayingRef.current = true;
    } else {
      stopSpeech();
      setIsPlaying(true);
      isPlayingRef.current = true;
      speakSentence(0);
    }
  };

  const handlePause = () => {
    synth.pause();
    setIsPaused(true);
    setIsPlaying(false);
    isPausedRef.current = true;
    isPlayingRef.current = false;
  };

  const handleStop = () => {
    stopSpeech();
  };

  if (!isSupported) {
    return (
      <div className="p-4 rounded-2xl bg-red-50 text-red-600 text-xs font-bold border border-red-100">
        Voice mode not supported in this browser.
      </div>
    );
  }

  return (
    <div className="my-8">
      {/* Voice Controls Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "relative overflow-hidden rounded-[32px] border p-6 transition-all duration-500 shadow-2xl",
          isPlaying ? "bg-indigo-600 border-indigo-500 shadow-indigo-500/20" : "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
        )}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          
          {/* Status & Animation */}
          <div className="flex items-center gap-4">
            <div className={cn(
              "p-4 rounded-2xl transition-all duration-500 shadow-lg",
              isPlaying ? "bg-white/20 text-white" : "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600"
            )}>
              {isPlaying ? <Mic className="animate-pulse" /> : <MicOff />}
            </div>
            <div>
              <h4 className={cn("text-lg font-black tracking-tight", isPlaying ? "text-white" : "text-zinc-900 dark:text-white")}>
                {isPlaying ? "Lazy Mode Active" : isPaused ? "Paused" : "Lazy Mode (Voice)"}
              </h4>
              <p className={cn("text-xs font-bold uppercase tracking-widest", isPlaying ? "text-indigo-100" : "text-zinc-400")}>
                {isPlaying ? `Reading sentence ${currentSentenceIndex + 1}/${sentences.current.length}` : "Sit back and listen"}
              </p>
            </div>
          </div>

          {/* Main Controls */}
          <div className="flex items-center gap-3">
            {!isPlaying || isPaused ? (
              <ControlButton 
                icon={Play} 
                label={isPaused ? "Resume" : "Play"} 
                onClick={handlePlay} 
                active={isPlaying}
                dark={isPlaying}
              />
            ) : (
              <ControlButton 
                icon={Pause} 
                label="Pause" 
                onClick={handlePause} 
                active={isPlaying}
                dark={isPlaying}
              />
            )}
            
            <ControlButton 
              icon={Square} 
              label="Stop" 
              onClick={handleStop} 
              active={isPlaying}
              dark={isPlaying}
              disabled={!isPlaying && !isPaused}
            />

            <div className="h-8 w-[1px] bg-zinc-200 dark:bg-zinc-800 mx-2" />

            <button 
              onClick={() => setShowSettings(!showSettings)}
              className={cn(
                "p-3 rounded-xl transition-all",
                showSettings ? "bg-indigo-500 text-white" : isPlaying ? "text-white hover:bg-white/10" : "text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              )}
            >
              <Settings size={20} />
            </button>
          </div>
        </div>

        {/* Waveform Animation */}
        <AnimatePresence>
          {isPlaying && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 24 }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center justify-center gap-1 mt-6"
            >
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ height: [8, 24, 12, 20, 8] }}
                  transition={{ repeat: Infinity, duration: 0.5 + Math.random(), ease: "easeInOut" }}
                  className="w-1 rounded-full bg-white/40"
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-zinc-100 dark:border-white/10 space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Voice Selection */}
                <div className="space-y-3">
                  <label className={cn("text-[10px] font-black uppercase tracking-[0.2em]", isPlaying ? "text-indigo-100" : "text-zinc-400")}>
                    Select Voice
                  </label>
                  <select 
                    value={selectedVoice?.name || ''} 
                    onChange={(e) => setSelectedVoice(voices.find(v => v.name === e.target.value))}
                    className="w-full p-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 border-none text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    {voices.map(voice => (
                      <option key={voice.name} value={voice.name}>{voice.name} ({voice.lang})</option>
                    ))}
                  </select>
                </div>

                {/* Speed Control */}
                <div className="space-y-3">
                  <label className={cn("text-[10px] font-black uppercase tracking-[0.2em]", isPlaying ? "text-indigo-100" : "text-zinc-400")}>
                    Playback Speed
                  </label>
                  <div className="flex items-center gap-2">
                    {[0.75, 1, 1.25, 1.5].map(s => (
                      <button
                        key={s}
                        onClick={() => setRate(s)}
                        className={cn(
                          "flex-1 py-2 rounded-xl text-xs font-black transition-all",
                          rate === s 
                            ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" 
                            : isPlaying ? "bg-white/10 text-white hover:bg-white/20" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-200"
                        )}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Hidden Text for Highlighting Overlay */}
      <div className="hidden">
        {sentences.current.map((s, i) => (
          <span key={i} id={`sentence-${i}`}>{s}</span>
        ))}
      </div>

      {/* Premium Reading Bar Overlay */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-3xl"
          >
            <div className="bg-zinc-950/90 backdrop-blur-xl border border-white/10 p-6 rounded-[32px] shadow-2xl flex items-center gap-6">
              <div className="flex-shrink-0 p-3 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/40">
                <Mic size={24} className="animate-pulse" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Now Reading</p>
                <p className="text-white font-bold leading-relaxed line-clamp-2 italic">
                  {sentences.current[currentSentenceIndex]}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={handlePause}
                  className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
                >
                  <Pause size={20} fill="currentColor" />
                </button>
                <button 
                  onClick={handleStop}
                  className="p-3 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
                >
                  <Square size={20} fill="currentColor" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ControlButton = ({ icon: Icon, label, onClick, active, dark, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={cn(
      "flex items-center gap-2 px-4 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all",
      disabled ? "opacity-30 cursor-not-allowed" : "",
      dark 
        ? "bg-white text-indigo-600 hover:bg-indigo-50" 
        : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-500/20"
    )}
  >
    <Icon size={16} fill={active ? "currentColor" : "none"} />
    <span className="hidden sm:inline">{label}</span>
  </button>
);

export default VoiceReader;
