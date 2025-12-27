
import React, { useState, useRef, useEffect } from 'react';
import { useMemoryStore } from '../hooks/useMemoryStore';
import gsap from 'gsap';

export const HeartSearch: React.FC = () => {
  const { isHeartSearchOpen, toggleHeartSearch, wisdomCache, addWisdom } = useMemoryStore();
  const [query, setQuery] = useState('');
  const [reflection, setReflection] = useState<{ content: string; source: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isHeartSearchOpen && containerRef.current) {
      gsap.fromTo(containerRef.current, 
        { opacity: 0, scale: 0.95, y: 20 }, 
        { opacity: 1, scale: 1, y: 0, duration: 1.0, ease: 'expo.out' }
      );
    }
  }, [isHeartSearchOpen]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    
const localResponses = [
  "The answer is already forming within you.",
  "Search gently. Clarity arrives when rushed less.",
  "Not everything needs resolution tonight.",
  "The heart understands before words do."
];

const result =
  localResponses[Math.floor(Math.random() * localResponses.length)];    
    // "Training" - If it came from the API, save it for future offline use
    if (result.source === 'api') {
      addWisdom(query, result.content);
    }
    
    setReflection(result);
    setLoading(false);
  };

  if (!isHeartSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-[#060010]/50 backdrop-blur-3xl">
      <div ref={containerRef} className="w-full max-w-xl bg-[#0a031a] border border-white/10 rounded-[3.5rem] p-12 shadow-2xl relative">
        <button onClick={toggleHeartSearch} className="absolute top-8 right-10 text-white/20 hover:text-white transition-all text-3xl font-extralight">&times;</button>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-light tracking-widest text-white uppercase mb-2">Inquire the Stars</h2>
          <div className="flex justify-center gap-2">
            <span className={`text-[8px] uppercase tracking-widest px-2 py-0.5 rounded border ${reflection?.source === 'api' ? 'border-yellow-500/50 text-yellow-500' : 'border-white/10 text-white/20'}`}>
              Cosmic
            </span>
            <span className={`text-[8px] uppercase tracking-widest px-2 py-0.5 rounded border ${reflection?.source !== 'api' ? 'border-blue-500/50 text-blue-500' : 'border-white/10 text-white/20'}`}>
              Local Soul
            </span>
          </div>
        </div>
        
        <form onSubmit={handleSearch} className="space-y-6">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Theme: home, our future, your laugh..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-lg placeholder:text-white/10 outline-none focus:border-[#ffd54f]/40 transition-all font-light"
          />
          <button type="submit" disabled={loading} className="w-full bg-[#ffd54f] text-[#060010] font-bold py-4 rounded-2xl uppercase tracking-[0.4em] text-[10px]">
            {loading ? "Searching..." : "Listen"}
          </button>
        </form>

        <div className="mt-10 min-h-[120px] flex items-center justify-center">
          {reflection && !loading && (
            <div className="text-center">
              <p className="text-lg font-serif italic text-white/80 leading-relaxed animate-in fade-in duration-1000">
                "{reflection.content}"
              </p>
              <p className="mt-4 text-[7px] text-white/10 uppercase tracking-[1em]">
                Source: {reflection.source === 'api' ? 'Gathered from Cosmic Void' : reflection.source === 'cache' ? 'Echo of Previous Session' : 'Eternal Local Soul'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
