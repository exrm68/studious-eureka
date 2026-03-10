import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, AlertCircle, Loader } from 'lucide-react';

// ── তোমার Railway Stream Server URL ──
const STREAM_SERVER_URL = 'https://ubiquitous-spork-production.up.railway.app';

interface VideoPlayerProps {
  code: string;
  title: string;
  thumbnail?: string;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ code, title, thumbnail, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'playing' | 'paused' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const controlsTimer = useRef<any>(null);

  const streamUrl = `${STREAM_SERVER_URL}/stream/${code}`;

  const showControls = useCallback(() => {
    setControlsVisible(true);
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => {
      setControlsVisible(false);
    }, 3000);
  }, []);

  useEffect(() => {
    return () => { if (controlsTimer.current) clearTimeout(controlsTimer.current); };
  }, []);

  // Back button — Telegram WebApp back button support
  useEffect(() => {
    if (window.Telegram?.WebApp?.BackButton) {
      window.Telegram.WebApp.BackButton.show();
      window.Telegram.WebApp.BackButton.onClick(onClose);
      return () => {
        window.Telegram.WebApp.BackButton.hide();
        window.Telegram.WebApp.BackButton.offClick(onClose);
      };
    }
  }, [onClose]);

  const handlePlayPause = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setStatus('playing'); }
    else { v.pause(); setStatus('paused'); }
    showControls();
  };

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    setProgress((v.currentTime / v.duration) * 100);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    v.currentTime = (parseFloat(e.target.value) / 100) * v.duration;
    showControls();
  };

  const handleLoaded = () => {
    const v = videoRef.current;
    if (v) setDuration(v.duration);
    setStatus('paused');
  };

  const handleError = () => {
    setStatus('error');
    setErrorMsg('Video load করা যাচ্ছে না। একটু পরে আবার চেষ্টা করুন।');
  };

  const handleRetry = () => {
    setStatus('loading');
    setErrorMsg('');
    if (videoRef.current) {
      videoRef.current.load();
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
    showControls();
  };

  const handleFullscreen = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.requestFullscreen) v.requestFullscreen();
    else if ((v as any).webkitRequestFullscreen) (v as any).webkitRequestFullscreen();
  };

  const formatTime = (sec: number) => {
    if (!sec || isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const currentTime = videoRef.current?.currentTime || 0;
  const isPlaying = status === 'playing';

  return (
    <motion.div
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ type: 'spring', damping: 28, stiffness: 300 }}
      className="fixed inset-0 z-[500] bg-black flex flex-col"
      style={{ touchAction: 'none' }}
    >
      {/* ── Header ── */}
      <div
        className="flex items-center justify-between px-4 py-3 flex-shrink-0 z-10"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.85), transparent)' }}
      >
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center active:scale-90 transition-all"
        >
          <X size={18} className="text-white" />
        </button>
        <p className="text-white text-sm font-bold truncate max-w-[65%] text-center leading-tight">{title}</p>
        <div className="w-9" />
      </div>

      {/* ── Video Area ── */}
      <div
        className="flex-1 relative flex items-center justify-center overflow-hidden"
        onClick={status !== 'error' && status !== 'loading' ? handlePlayPause : undefined}
        onTouchStart={showControls}
      >
        {/* Blurred thumbnail background while loading */}
        {(status === 'loading') && thumbnail && (
          <img
            src={thumbnail}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'blur(12px) brightness(0.3)', transform: 'scale(1.1)' }}
          />
        )}

        {/* Loading */}
        {status === 'loading' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 gap-3">
            <Loader size={44} className="text-white animate-spin" />
            <p className="text-white/70 text-sm font-medium">Video load হচ্ছে...</p>
          </div>
        )}

        {/* Error */}
        {status === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 gap-5 px-8">
            <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertCircle size={40} className="text-red-400" />
            </div>
            <p className="text-white text-center text-sm font-bold leading-relaxed">{errorMsg}</p>
            <button
              onClick={handleRetry}
              className="px-8 py-3 rounded-2xl bg-white/10 border border-white/20 text-white text-sm font-bold flex items-center gap-2 active:scale-95 transition-all"
            >
              <RotateCcw size={16} /> আবার চেষ্টা করুন
            </button>
          </div>
        )}

        {/* Video */}
        <video
          ref={videoRef}
          src={streamUrl}
          className="w-full h-full object-contain"
          playsInline
          preload="metadata"
          onLoadedMetadata={handleLoaded}
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setStatus('playing')}
          onPause={() => { if (status !== 'loading') setStatus('paused'); }}
          onError={handleError}
          onWaiting={() => setStatus('loading')}
          onCanPlay={() => { if (status === 'loading') setStatus('paused'); }}
          style={{ display: status === 'error' ? 'none' : 'block' }}
        />

        {/* Paused overlay */}
        <AnimatePresence>
          {status === 'paused' && controlsVisible && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
            >
              <div className="w-20 h-20 rounded-full bg-black/60 flex items-center justify-center">
                <Play size={32} className="text-white ml-1" fill="white" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Controls ── */}
      <AnimatePresence>
        {(controlsVisible || status === 'paused') && status !== 'error' && status !== 'loading' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex-shrink-0 px-5 pb-8 pt-4 z-10"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' }}
          >
            {/* Progress bar */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-white/60 text-xs font-mono w-10 text-right">{formatTime(currentTime)}</span>
              <input
                type="range" min={0} max={100} value={progress}
                onChange={handleSeek}
                onClick={e => e.stopPropagation()}
                className="flex-1 h-1 cursor-pointer rounded-full"
                style={{ accentColor: '#FFD700' }}
              />
              <span className="text-white/60 text-xs font-mono w-10">{formatTime(duration)}</span>
            </div>

            {/* Buttons row */}
            <div className="flex items-center justify-between px-2">
              <button
                onClick={e => { e.stopPropagation(); toggleMute(); }}
                className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center active:scale-90 transition-all"
              >
                {isMuted
                  ? <VolumeX size={20} className="text-white" />
                  : <Volume2 size={20} className="text-white" />}
              </button>

              <button
                onClick={e => { e.stopPropagation(); handlePlayPause(); }}
                className="w-16 h-16 rounded-full flex items-center justify-center active:scale-90 transition-all shadow-lg"
                style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)', boxShadow: '0 0 24px rgba(255,200,0,0.4)' }}
              >
                {isPlaying
                  ? <Pause size={26} className="text-black" fill="black" />
                  : <Play size={26} className="text-black ml-1" fill="black" />}
              </button>

              <button
                onClick={e => { e.stopPropagation(); handleFullscreen(); }}
                className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center active:scale-90 transition-all"
              >
                <Maximize size={20} className="text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default VideoPlayer;
