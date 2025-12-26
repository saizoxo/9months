
import React, { useEffect, useRef, useState } from 'react';
import { useMemoryStore } from '../hooks/useMemoryStore';
import { Howl } from 'howler';
import gsap from 'gsap';

export const MemoryViewer: React.FC = () => {
  const { activeMonth, memories, setActiveMonth, isViewerOpen, setIsViewerOpen } = useMemoryStore();
  const modalRef = useRef<HTMLDivElement>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [fullImage, setFullImage] = useState<string | null>(null);
  const soundRef = useRef<Howl | null>(null);
  const monthMemories = memories.filter(m => m.month === activeMonth);

  useEffect(() => {
    if (isViewerOpen && modalRef.current) {
      gsap.fromTo(modalRef.current, 
        { opacity: 0, scale: 0.98, y: 30 }, 
        { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'expo.out' }
      );
    }
    return () => {
      if (soundRef.current) soundRef.current.stop();
    };
  }, [isViewerOpen]);

  const handleClose = () => {
    if (modalRef.current) {
      gsap.to(modalRef.current, { 
        opacity: 0, scale: 0.98, y: 30, duration: 0.6, 
        onComplete: () => {
          setIsViewerOpen(false);
          setActiveMonth(null);
        }
      });
    }
  };

  const playVoice = (url: string, id: string) => {
    if (soundRef.current) {
      soundRef.current.stop();
      if (playingId === id) {
        setPlayingId(null);
        return;
      }
    }
    const sound = new Howl({ src: [url], onend: () => setPlayingId(null) });
    soundRef.current = sound;
    sound.play();
    setPlayingId(id);
  };

  if (!isViewerOpen || !activeMonth) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#060010]/80 backdrop-blur-2xl">
      <div ref={modalRef} className="bg-gradient-to-b from-white/10 to-[#0a031a] border border-white/10 rounded-[4rem] w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        
        <div className="p-8 md:p-12 flex justify-between items-center border-b border-white/5">
          <div>
            <span className="text-[#ffd54f] text-[9px] font-bold uppercase tracking-[1em] mb-2 block opacity-60">Month</span>
            <h2 className="text-4xl md:text-6xl font-extralight text-white tracking-tighter">
              {activeMonth}
            </h2>
          </div>
          <button onClick={handleClose} className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-white/30 hover:text-white transition-all text-4xl font-extralight">&times;</button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12 custom-scrollbar">
          {monthMemories.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white/20 italic font-light text-xl tracking-widest leading-relaxed">
                "Quiet stars, waiting for our words."
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {monthMemories.map((m) => (
                <div key={m.id} className="bg-white/5 rounded-[3rem] p-8 border border-white/5 hover:border-white/10 transition-all">
                  <div className="mb-6 flex justify-between items-start">
                    <h3 className="text-xl font-light text-white tracking-wide">{m.title}</h3>
                    <span className="text-[9px] text-white/20 uppercase tracking-[0.3em] font-mono">{m.date}</span>
                  </div>
                  
                  {m.type === 'text' && (
                    <p className="text-white/70 font-serif italic text-lg leading-relaxed">
                      "{m.content}"
                    </p>
                  )}
                  
                  {m.type === 'photo' && (
                    <div onClick={() => setFullImage(m.url || m.content!)} className="rounded-[2.5rem] overflow-hidden aspect-video cursor-zoom-in relative group">
                      <img src={m.url || m.content} alt={m.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                    </div>
                  )}
                  
                  {m.type === 'voice' && (
                    <button onClick={() => playVoice(m.url || m.content!, m.id)} className="w-full py-10 bg-white/5 rounded-[2.5rem] flex items-center justify-center gap-4 text-[#ffd54f]">
                      <svg className={`w-8 h-8 ${playingId === m.id ? 'animate-pulse' : ''}`} fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/></svg>
                      <span className="text-[10px] font-bold uppercase tracking-widest">{playingId === m.id ? 'Listening...' : 'Hear Echo'}</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {fullImage && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-6 animate-in fade-in duration-500" onClick={() => setFullImage(null)}>
          <img src={fullImage} className="max-w-full max-h-full object-contain rounded-2xl" />
        </div>
      )}
    </div>
  );
};
