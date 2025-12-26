
import React, { useRef, useState, useEffect } from 'react';
import { useMemoryStore } from '../hooks/useMemoryStore';
import { getConflictGuidance } from '../services/geminiService';
import gsap from 'gsap';

export const ConflictNebula: React.FC = () => {
  // Use property aliasing to maintain local variable names while connecting to correctly named store properties
  const { isHarmonicDriftOpen: isConflictNebulaOpen, toggleHarmonicDrift: toggleConflictNebula } = useMemoryStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'c') toggleConflictNebula();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleConflictNebula]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;

    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#ff7aae';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ff7aae';

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current) canvasRef.current.getContext('2d')?.beginPath();
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
      setAiResponse(null);
    }
  };

  const submitToAI = async () => {
    setLoading(true);
    // In a real app, you'd convert the canvas to image and describe it or just use the action
    const advice = await getConflictGuidance("Angry swirls turning into soft heart shapes");
    setAiResponse(advice);
    setLoading(false);
  };

  if (!isConflictNebulaOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/90">
      <div className="max-w-xl w-full flex flex-col items-center">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-[#ff7aae] drop-shadow-[0_0_10px_#ff7aae]">Conflict Nebula</h2>
          <p className="text-white/60">Draw how you feel. The stars will guide us back to calm.</p>
        </div>
        
        <div className="relative group">
          <canvas 
            ref={canvasRef}
            width={400}
            height={400}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="bg-[#0a031a] border-2 border-[#ff7aae]/30 rounded-full cursor-crosshair shadow-[0_0_30px_rgba(255,122,174,0.2)]"
          />
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
              <div className="text-white animate-bounce">Consulting the Oracle...</div>
            </div>
          )}
          {aiResponse && (
            <div className="absolute inset-0 flex items-center justify-center p-12 text-center">
              <p className="text-xl font-medium text-[#ffd166] animate-pulse bg-black/60 backdrop-blur-md p-6 rounded-2xl border border-[#ffd166]/30">
                {aiResponse}
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-4 mt-8">
          <button onClick={clear} className="px-6 py-2 rounded-full border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-all">Clear Canvas</button>
          {!aiResponse && (
            <button onClick={submitToAI} className="px-8 py-2 rounded-full bg-[#ff7aae] text-white font-bold hover:shadow-[0_0_20px_#ff7aae] transition-all">Get Guidance</button>
          )}
          <button onClick={toggleConflictNebula} className="px-6 py-2 rounded-full text-white/40 hover:text-white transition-all">Close</button>
        </div>
      </div>
    </div>
  );
};
