
import React, { useState, useRef, useEffect } from 'react';
import { useMemoryStore } from '../hooks/useMemoryStore';
import { MemoryType } from '../types';
import gsap from 'gsap';

export const LightCatcher: React.FC = () => {
  const { isLightCatcherOpen, toggleLightCatcher, addMemory } = useMemoryStore();
  const [dragActive, setDragActive] = useState(false);
  const [formData, setFormData] = useState<{ title: string; month: number; type: MemoryType }>({ 
    title: '', 
    month: 1, 
    type: 'text' 
  });
  const [uploading, setUploading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLightCatcherOpen && containerRef.current) {
      gsap.fromTo(containerRef.current, 
        { scale: 0.9, opacity: 0, y: 30 },
        { scale: 1, opacity: 1, y: 0, duration: 1.2, ease: 'expo.out' }
      );
    }
  }, [isLightCatcherOpen]);

  const resetForm = () => {
    setFormData({ title: '', month: 1, type: 'text' });
    setRecordedBlob(null);
    setUploading(false);
    setMicError(null);
    setRecording(false);
    chunksRef.current = [];
  };

  const startRecording = async () => {
    setMicError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setRecordedBlob(blob);
        setFormData(prev => ({ ...prev, type: 'voice' }));
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err: any) {
      setMicError("The stars can't hear us right now. Check mic settings.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const handleUpload = async (file: File | Blob) => {
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      addMemory({
        id: Date.now().toString(),
        month: formData.month,
        type: formData.type === 'text' ? 'text' : (file instanceof File && file.type.startsWith('image/') ? 'photo' : 'voice'),
        title: formData.title || 'Captured Moment',
        content,
        url: '',
        date: new Date().toISOString().split('T')[0]
      });
      resetForm();
      toggleLightCatcher();
    };
    reader.readAsDataURL(file);
  };

  const handleTextSubmit = () => {
    if (formData.title) {
      addMemory({
        id: Date.now().toString(),
        month: formData.month,
        type: 'text',
        title: formData.title,
        content: formData.title,
        url: '',
        date: new Date().toISOString().split('T')[0]
      });
      resetForm();
      toggleLightCatcher();
    }
  };

  if (!isLightCatcherOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/70 backdrop-blur-3xl">
      <div ref={containerRef} className="bg-gradient-to-br from-[#1a0b3a] to-[#0a031a] border border-[#ffd54f]/30 rounded-[3rem] w-full max-w-md overflow-hidden relative shadow-2xl">
        <button onClick={() => { toggleLightCatcher(); resetForm(); }} className="absolute top-10 right-10 text-white/30 hover:text-white text-3xl font-extralight transition-colors">&times;</button>
        
        <div className="p-10 md:p-14">
          <div className="flex flex-col items-center mb-10 text-center">
            <h2 className="text-4xl font-extralight text-white tracking-widest uppercase mb-4">Catching Light</h2>
            <p className="text-[#fff8e1]/50 text-[11px] uppercase tracking-[0.3em] font-light italic leading-relaxed">
              Place a new star in our sky.
            </p>
          </div>

          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] text-white/40 uppercase tracking-[0.4em] ml-2 font-bold">What happened?</label>
              <input 
                type="text" 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-5 text-white outline-none focus:border-[#ffd54f]/40 transition-all font-light"
                placeholder="A memory to keep..."
              />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] text-white/40 uppercase tracking-[0.4em] ml-2 font-bold">Month</label>
                <input 
                  type="number" 
                  min="1" max="12"
                  value={formData.month}
                  onChange={e => setFormData({...formData, month: parseInt(e.target.value)})}
                  className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-5 text-white outline-none focus:border-[#ffd54f]/40 transition-all font-light"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] text-white/40 uppercase tracking-[0.4em] ml-2 font-bold">Type</label>
                <div className="flex bg-white/5 rounded-3xl border border-white/10 p-2 h-[68px]">
                  <button onClick={() => setFormData({...formData, type: 'text'})} className={`flex-1 text-[10px] uppercase tracking-widest rounded-2xl transition-all ${formData.type === 'text' ? 'bg-[#ffd54f] text-[#060010] font-bold shadow-lg' : 'text-white/30'}`}>Note</button>
                  <button onClick={() => setFormData({...formData, type: 'photo'})} className={`flex-1 text-[10px] uppercase tracking-widest rounded-2xl transition-all ${formData.type === 'photo' ? 'bg-[#ffd54f] text-[#060010] font-bold shadow-lg' : 'text-white/30'}`}>Asset</button>
                </div>
              </div>
            </div>

            {formData.type === 'text' ? (
              <textarea 
                placeholder="Our story continues here..."
                value={formData.title}
                className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-8 py-6 text-white outline-none focus:border-[#ffd54f]/30 h-40 transition-all font-light italic text-lg leading-relaxed"
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            ) : (
              <div className="space-y-6">
                <div 
                  onDragOver={e => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={e => { e.preventDefault(); handleUpload(e.dataTransfer.files[0]); }}
                  className={`border-2 border-dashed rounded-[2.5rem] h-40 flex flex-col items-center justify-center transition-all ${dragActive ? 'border-[#ffd54f] bg-[#ffd54f]/10' : 'border-white/10 hover:border-white/30'}`}
                >
                  {uploading ? (
                    <div className="text-[#ffd54f] animate-pulse tracking-[0.4em] text-[11px] uppercase font-bold">Ascending...</div>
                  ) : (
                    <>
                      <p className="text-white/30 text-[10px] uppercase tracking-[0.3em]">Drop photo or audio</p>
                      <input type="file" className="hidden" id="fileInput" onChange={e => e.target.files && handleUpload(e.target.files[0])} />
                      <label htmlFor="fileInput" className="mt-5 text-[11px] text-[#ffd54f] cursor-pointer hover:underline uppercase tracking-widest font-bold">Browse Constellation</label>
                    </>
                  )}
                </div>

                <button 
                  onClick={recording ? stopRecording : startRecording}
                  className={`w-full py-5 rounded-3xl flex items-center justify-center gap-4 transition-all ${recording ? 'bg-red-500/30 text-red-400 border border-red-500/50 animate-pulse' : 'bg-white/5 text-[#ffd54f] border border-white/10 hover:bg-white/10'}`}
                >
                  <div className={`w-3 h-3 rounded-full ${recording ? 'bg-red-500 shadow-[0_0_15px_#ef4444]' : 'bg-[#ffd54f]'}`}></div>
                  <span className="text-[11px] font-bold uppercase tracking-widest">{recording ? 'Recording Echo...' : 'Record Voice'}</span>
                </button>
                {micError && <p className="text-red-400/80 text-[10px] uppercase tracking-widest text-center px-6 font-bold">{micError}</p>}
              </div>
            )}
            
            <button 
              onClick={handleTextSubmit}
              className="w-full bg-gradient-to-r from-[#ffd54f] to-[#ffb300] text-[#060010] font-bold py-7 rounded-[2.5rem] shadow-2xl uppercase tracking-[0.6em] text-[11px] mt-4 active:scale-95 transition-transform"
            >
              Light the Path
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
