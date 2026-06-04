import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Video, 
  Volume2, 
  VolumeX, 
  Eye, 
  RefreshCw, 
  Tv,
  Camera,
  Play
} from 'lucide-react';
import { Language } from '../types';

interface LiveVideoSectionProps {
  lang: Language;
}

export default function LiveVideoSection({ lang }: LiveVideoSectionProps) {
  const isIndo = lang === Language.ID;

  // Stream States
  const [activeCam, setActiveCam] = useState<'front' | 'floor2' | 'worship'>('front');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [bitrate, setBitrate] = useState(4820);
  const [viewerCount, setViewerCount] = useState(38);
  const [dateTimeStr, setDateTimeStr] = useState('');
  const [isBuffering, setIsBuffering] = useState(false);
  const [videoQuality, setVideoQuality] = useState<'1080p' | '720p' | '480p'>('1080p');

  // Time and Bitrate dynamic ticks
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setDateTimeStr(now.toLocaleTimeString('id-ID') + ' WIB');
      
      // Fluctuating values for high-fidelity
      setBitrate(prev => Math.max(3800, Math.min(5900, prev + Math.floor(Math.random() * 200) - 100)));
      setViewerCount(prev => Math.max(25, Math.min(65, prev + (Math.random() > 0.5 ? 1 : -1))));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSwitchCam = (cam: 'front' | 'floor2' | 'worship') => {
    setIsBuffering(true);
    setActiveCam(cam);
    setTimeout(() => {
      setIsBuffering(false);
    }, 800);
  };

  // Simulated images for cam views
  const camImages = {
    front: 'https://images.unsplash.com/photo-1541829019-259273aed3c1?auto=format&fit=crop&q=80&w=1200', // Solid construction building scene
    floor2: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1200', // Construction interior, rebars
    worship: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=1200' // Church interior/Worship stage
  };

  const camTitles = {
    front: isIndo ? 'Kamera 01 - Area Depan & Fasad Struktur' : '01号摄像头 - 前区与外墙建设',
    floor2: isIndo ? 'Kamera 02 - Lantai 2 Pengecoran Kolom' : '02号摄像头 - 二层立柱浇筑区',
    worship: isIndo ? 'Siaran Langsung - Kebaktian & Doa Interaktif' : '互动直播 - 每周主日崇拜祷告'
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Video size={18} className="text-red-500 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
          </div>
          <h3 className="font-extrabold text-slate-200 uppercase tracking-widest text-xs">
            {isIndo ? 'Pantauan Video Live Proyek' : '工程实时视界与直播'}
          </h3>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide bg-red-500/10 text-red-500 border border-red-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            LIVE
          </span>
          <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
            <Eye size={12} className="text-[#B8860B]" />
            <span>{viewerCount} {isIndo ? 'Jemaat' : '会友'}</span>
          </span>
        </div>
      </div>

      <div className="bg-blue-900/40 backdrop-blur-md rounded-[2.5rem] p-6 border border-blue-400/20 shadow-xl relative overflow-hidden">
        {/* Main Video Stream Container - Widescreen Expanded */}
        <div className="space-y-4 flex flex-col justify-between">
          <div className="relative aspect-video w-full rounded-3xl overflow-hidden bg-black/80 border border-white/5 group shadow-inner">
            {/* The Streaming Screen Frame */}
            {isPlaying ? (
              <div className="absolute inset-0 w-full h-full">
                {/* Image placeholder with scanlines overlay */}
                <img 
                  src={camImages[activeCam]} 
                  alt="Live Streaming Feed" 
                  className="w-full h-full object-cover opacity-80"
                  referrerPolicy="no-referrer"
                />
                
                {/* Cyber CCTV Overlays */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />
                
                {/* Scanlines Effect */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none opacity-45" />

                {/* Front Overlay Details */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none text-white font-mono text-[10px] tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  <div className="space-y-1 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                    <p className="font-extrabold flex items-center gap-1 text-emerald-400">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                      REC [ON]
                    </p>
                    <p className="text-[9px] uppercase font-bold text-slate-300">GMI-IMANUEL_CAM_{activeCam.toUpperCase()}</p>
                  </div>
                  <div className="text-right space-y-1 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                    <p>{dateTimeStr || '00:00:00 WIB'}</p>
                    <p className="text-slate-300">{bitrate} Kbps // {videoQuality}</p>
                  </div>
                </div>

                {/* CCTV grid layout lines */}
                <div className="absolute inset-0 border border-white/10 pointer-events-none flex items-center justify-center">
                  <div className="w-10 h-10 border-l border-t border-white/20 absolute top-1/4 left-1/4" />
                  <div className="w-10 h-10 border-r border-t border-white/20 absolute top-1/4 right-1/4" />
                  <div className="w-10 h-10 border-l border-b border-white/20 absolute bottom-1/4 left-1/4" />
                  <div className="w-10 h-10 border-r border-b border-white/20 absolute bottom-1/4 right-1/4" />
                  <div className="w-8 h-[1px] bg-red-500/20" />
                  <div className="h-8 w-[1px] bg-red-500/20" />
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 p-6 text-center space-y-3">
                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-[#B8860B] shadow-inner">
                  <Play size={24} className="ml-1" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{isIndo ? 'Aliran Video Dijeda' : '视频播放已暂停'}</h4>
                  <p className="text-xs text-slate-400/80 mt-1">{isIndo ? 'Klik tombol play untuk melanjutkan monitoring langsung' : '点击播放按钮继续实时监控'}</p>
                </div>
              </div>
            )}

            {/* Buffering Loading */}
            <AnimatePresence>
              {isBuffering && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-[#020617]/90 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-20 text-white font-mono"
                >
                  <RefreshCw size={28} className="text-[#B8860B] animate-spin" />
                  <span className="text-xs font-bold tracking-widest text-[#B8860B] animate-pulse">CONNECTING TO FEED...</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Video Controls Bar - overlayed at bottom */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 flex justify-between items-center z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-all transform active:scale-90"
                >
                  {isPlaying ? (
                    <span className="w-2.5 h-2.5 bg-white rounded-sm" />
                  ) : (
                    <Play size={12} className="ml-0.5 fill-white" />
                  )}
                </button>

                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-all transform active:scale-90"
                >
                  {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>

                <div className="h-1.5 w-16 bg-white/20 rounded-full overflow-hidden relative hidden sm:block">
                  <div className={`h-full ${isMuted ? 'w-0' : 'w-3/4'} bg-[#B8860B] rounded-full`} />
                </div>
              </div>

              {/* Title Scroll Indicator */}
              <p className="text-[10px] font-bold text-white hidden md:block truncate max-w-[200px]">
                {camTitles[activeCam]}
              </p>

              <div className="flex items-center gap-3">
                {/* Quality options */}
                <div className="flex gap-1 bg-black/40 border border-white/10 p-0.5 rounded-full text-[8px] font-black font-mono">
                  {(['1080p', '720p', '480p'] as const).map(q => (
                    <button 
                      key={q} 
                      onClick={() => setVideoQuality(q)}
                      className={`px-1.5 py-0.5 rounded-full ${videoQuality === q ? 'bg-[#B8860B] text-slate-900 font-extrabold' : 'text-slate-400 hover:text-white'}`}
                    >
                      {q}
                    </button>
                  ))}
                </div>

                <div 
                  onClick={() => {
                    setIsBuffering(true);
                    setTimeout(() => setIsBuffering(false), 900);
                  }}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-all cursor-pointer"
                  title="Refresh frame rate"
                >
                  <RefreshCw size={13} className="hover:rotate-180 transition-transform duration-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Camera Angles Selection Grid - Expanded width */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'front', label: isIndo ? 'Fasad Depan Utama' : '主楼前区', icon: Camera },
              { id: 'floor2', label: isIndo ? 'Kolom Lantai 2' : '二层建筑', icon: Camera },
              { id: 'worship', label: isIndo ? 'Worship Live Stream' : '每周崇拜', icon: Tv }
            ].map(cam => {
              const IconComp = cam.icon;
              return (
                <button
                  key={cam.id}
                  onClick={() => handleSwitchCam(cam.id as any)}
                  className={`py-3.5 px-3 rounded-2xl border text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all text-center ${
                    activeCam === cam.id 
                      ? 'bg-[#B8860B] border-[#B8860B] text-slate-900 shadow-lg shadow-[#B8860B]/10 scale-[1.01]' 
                      : 'bg-[#020617]/40 border-blue-400/10 text-slate-300 hover:bg-blue-400/15'
                  }`}
                >
                  <IconComp size={14} className={activeCam === cam.id ? 'text-slate-900' : 'text-[#B8860B]'} />
                  <span className="text-[10px] md:text-xs truncate">{cam.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
