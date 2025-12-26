
import React, { useState, useRef, useEffect } from 'react';
import { useMemoryStore } from '../hooks/useMemoryStore';
import gsap from 'gsap';

export const AuthModal: React.FC = () => {
  const { isAuthOpen, toggleAuth, setRole } = useMemoryStore();
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthOpen && containerRef.current) {
      gsap.fromTo(containerRef.current, 
        { scale: 0.9, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 0.8, ease: 'expo.out' }
      );
    }
  }, [isAuthOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === 'SaribsShreya') {
      setRole('shreya');
      toggleAuth();
      setCode('');
    } else if (code === 'adminacc') {
      setRole('admin');
      toggleAuth();
      setCode('');
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  if (!isAuthOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-3xl">
      <div ref={containerRef} className="bg-gradient-to-br from-[#fff8e1]/20 to-transparent border border-white/20 rounded-[3rem] p-12 w-full max-w-sm shadow-2xl relative">
        <button onClick={toggleAuth} className="absolute top-8 right-10 text-white/40 hover:text-white transition-colors text-2xl">&times;</button>
        
        <h2 className="text-2xl font-extralight tracking-widest text-white mb-8 text-center uppercase">Identify your Light</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <input 
            type="password"
            autoFocus
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter the secret code..."
            className={`w-full bg-white/5 border ${error ? 'border-red-500' : 'border-white/10'} rounded-2xl px-6 py-4 text-white text-center outline-none focus:border-[#ffd54f]/50 transition-all font-light`}
          />
          <button className="w-full bg-[#ffd54f] text-[#060010] font-bold py-4 rounded-2xl hover:shadow-[0_0_30px_rgba(255,213,79,0.3)] transition-all uppercase tracking-widest text-xs">
            Unlock Journey
          </button>
        </form>
      </div>
    </div>
  );
};
