
import React, { useRef, useState, useEffect } from 'react';
import { useMemoryStore } from '../hooks/useMemoryStore';
import { getConflictGuidance } from '../services/wisdomService';
import gsap from 'gsap';

export const InnerHearth: React.FC = () => {
  const { isInnerHearthOpen, toggleInnerHearth } = useMemoryStore();
  const [whisper, setWhisper] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isInnerHearthOpen && containerRef.current) {
      gsap.fromTo(containerRef.current, 
        { opacity: 0, scale: 0.95, y: 20 }, 
        { opacity: 1, scale: 1, y: 0, duration: 1.0, ease: 'expo.out' }
      );
    }
  }, [isInnerHearthOpen]);

  const handleHeal = async () => {
    setLoading(true);
    const advice = await getConflictGuidance("Seeking comfort and quiet warmth.");
    setWhisper(advice);
    setLoading(false);
  };

  if (!isInnerHearthOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#060010]/50 backdrop-blur-3xl p-6">
      <div ref={containerRef} className="w-full max-w-lg bg-gradient-to-b from-white/10 to-[#0a031a] border border-white/10 rounded-[3.5rem] p-12 text-center shadow-2xl relative overflow-hidden">
        <button onClick={toggleInnerHearth} className="absolute top-8 right-10 text-white/20 hover:text-white transition-all text-3xl font-extralight">&times;</button>
        
        <div className="mb-10">
          <h2 className="text-3xl font-light tracking-widest text-white uppercase mb-4">The Hearth</h2>
          <p className="text-white/40 text-xs italic font-light">"Come back to the warmth, Love."</p>
        </div>

        <div className="min-h-[140px] flex items-center justify-center mb-10">
          {loading ? (
            <div className="w-8 h-8 border border-white/10 border-t-[#ffd54f] rounded-full animate-spin"></div>
          ) : whisper ? (
            <p className="text-xl font-serif italic text-white/90 leading-relaxed animate-in fade-in duration-1000">
              "{whisper}"
            </p>
          ) : (
            <p className="text-white/20 text-[11px] uppercase tracking-widest font-light">Rest for a moment.</p>
          )}
        </div>

        <button 
          onClick={handleHeal} 
          disabled={loading}
          className="px-12 py-4 rounded-full bg-[#ffd54f] text-[#060010] font-bold text-[10px] uppercase tracking-[0.4em] shadow-lg active:scale-95 transition-all"
        >
          {whisper ? "Listen Again" : "Comfort Me"}
        </button>
      </div>
    </div>
  );
};
