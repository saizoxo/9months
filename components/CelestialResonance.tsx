
import React, { useRef, useState, useEffect } from 'react';
import { useMemoryStore } from '../hooks/useMemoryStore';
import { getConflictGuidance } from '../services/geminiService';
import gsap from 'gsap';

export const CelestialResonance: React.FC = () => {
  const { isHarmonicDriftOpen, toggleHarmonicDrift } = useMemoryStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [whisper, setWhisper] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isHarmonicDriftOpen && containerRef.current) {
      gsap.fromTo(containerRef.current, 
        { opacity: 0, y: 50, scale: 0.9 }, 
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'expo.out' }
      );
    }
  }, [isHarmonicDriftOpen]);

  const startDrawing = (e: any) => {
    setIsDrawing(true);
    draw(e);
  };

  const draw = (e: any) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.strokeStyle = `rgba(255, 122, 174, 0.4)`;
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#ff7aae';

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleConsult = async () => {
    setLoading(true);
    const advice = await getConflictGuidance("Swirling emotions seeking clarity");
    setWhisper(advice);
    setLoading(false);
  };

  if (!isHarmonicDriftOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#060010]/80 backdrop-blur-3xl p-6">
      <div ref={containerRef} className="w-full max-w-2xl bg-gradient-to-br from-[#1a0b3a] to-[#0a031a] border border-[#ff7aae]/30 rounded-[3rem] p-10 shadow-[0_0_100px_rgba(255,122,174,0.1)] relative">
        <button onClick={toggleHarmonicDrift} className="absolute top-8 right-10 text-white/30 hover:text-white transition-colors text-3xl">&times;</button>
        
        <div className="text-center mb-10">
          <h2 className="text-4xl font-light tracking-tighter text-white mb-2">Celestial Resonance</h2>
          <p className="text-[#ff7aae]/60 font-medium">Trace your heavy thoughts into the void to find light.</p>
        </div>

        <div className="relative flex justify-center mb-10">
          <canvas 
            ref={canvasRef}
            width={500}
            height={300}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={() => setIsDrawing(false)}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={() => setIsDrawing(false)}
            className="w-full h-[300px] bg-black/40 rounded-3xl border border-white/5 cursor-crosshair"
          />
          {whisper && (
            <div className="absolute inset-0 flex items-center justify-center p-8 text-center bg-[#060010]/60 backdrop-blur-lg rounded-3xl">
              <p className="text-2xl font-serif italic text-[#ffd166] leading-relaxed animate-in fade-in zoom-in duration-1000">
                "{whisper}"
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-center gap-6">
          <button onClick={() => {
            canvasRef.current?.getContext('2d')?.clearRect(0,0,500,300);
            setWhisper(null);
          }} className="px-8 py-3 rounded-full bg-white/5 text-white/60 hover:text-white transition-all">Reset Nebula</button>
          
          {!whisper && (
            <button 
              onClick={handleConsult} 
              disabled={loading}
              className="px-10 py-3 rounded-full bg-[#ff7aae] text-white font-bold hover:shadow-[0_0_30px_#ff7aae] transition-all disabled:opacity-50"
            >
              {loading ? "Aligning Stars..." : "Listen to the Whisper"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
