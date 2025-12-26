
import React, { useState, useRef, useEffect } from 'react';
import { useMemoryStore } from '../hooks/useMemoryStore';
import { MemoryType } from '../types';
import gsap from 'gsap';

export const BlackHoleUploader: React.FC = () => {
  const { isBlackHoleOpen, toggleBlackHole, addMemory } = useMemoryStore();
  const [dragActive, setDragActive] = useState(false);
  // Fix: Explicitly type the formData state using MemoryType to avoid 'text' as const inference which caused type mismatch errors
  const [formData, setFormData] = useState<{ title: string; month: number; type: MemoryType }>({ 
    title: '', 
    month: 1, 
    type: 'text' 
  });
  const [uploading, setUploading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isBlackHoleOpen && containerRef.current) {
      gsap.fromTo(containerRef.current, 
        { scale: 0.5, opacity: 0, rotationY: 90 },
        { scale: 1, opacity: 1, rotationY: 0, duration: 0.8, ease: 'expo.out' }
      );
    }
  }, [isBlackHoleOpen]);

  const handleUpload = async (file: File) => {
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      // Add missing 'url' property to satisfy the Memory type
      addMemory({
        id: Date.now().toString(),
        month: formData.month,
        type: file.type.startsWith('image/') ? 'photo' : 'voice',
        title: formData.title || 'New Discovery',
        content,
        url: '',
        date: new Date().toISOString().split('T')[0]
      });
      setUploading(false);
      toggleBlackHole();
    };
    reader.readAsDataURL(file);
  };

  if (!isBlackHoleOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
      <div ref={containerRef} className="bg-[#0a031a] border-2 border-[#c77dff]/50 rounded-[3rem] w-full max-w-md overflow-hidden relative shadow-[0_0_50px_rgba(199,125,255,0.3)]">
        <div className="p-8">
          <button onClick={toggleBlackHole} className="absolute top-6 right-8 text-white/50 hover:text-white text-2xl">&times;</button>
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 rounded-full bg-black border-4 border-[#c77dff] animate-pulse shadow-[0_0_30px_#c77dff] flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-white/10 blur-md"></div>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">The Memory Void</h2>
            <p className="text-white/40 text-sm text-center px-4">Feed the black hole with your shared moments.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-white/40 uppercase mb-1 block">Memory Title</label>
              <input 
                type="text" 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-[#c77dff]"
                placeholder="Our laughing fit..."
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-white/40 uppercase mb-1 block">Month (1-9)</label>
                <input 
                  type="number" 
                  min="1" max="9"
                  value={formData.month}
                  onChange={e => setFormData({...formData, month: parseInt(e.target.value)})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-[#c77dff]"
                />
              </div>
              <div>
                <label className="text-xs text-white/40 uppercase mb-1 block">Input Type</label>
                <div className="flex bg-white/5 rounded-xl border border-white/10 p-1">
                  {/* Fix: Buttons now correctly update the typed state with 'text' or 'photo' */}
                  <button onClick={() => setFormData({...formData, type: 'text'})} className={`flex-1 text-xs py-1.5 rounded-lg transition-all ${formData.type === 'text' ? 'bg-[#c77dff] text-white' : 'text-white/40'}`}>Text</button>
                  <button onClick={() => setFormData({...formData, type: 'photo'})} className={`flex-1 text-xs py-1.5 rounded-lg transition-all ${formData.type === 'photo' ? 'bg-[#c77dff] text-white' : 'text-white/40'}`}>Asset</button>
                </div>
              </div>
            </div>

            {formData.type === 'text' ? (
              <textarea 
                placeholder="Write your note here..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-[#c77dff] h-24"
                onChange={e => setFormData({...formData, title: e.target.value})} // Reusing title or we could add another field
              />
            ) : (
              <div 
                onDragOver={e => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={e => { e.preventDefault(); handleUpload(e.dataTransfer.files[0]); }}
                className={`border-2 border-dashed rounded-2xl h-32 flex flex-col items-center justify-center transition-all ${dragActive ? 'border-[#c77dff] bg-[#c77dff]/10' : 'border-white/10 hover:border-white/30'}`}
              >
                {uploading ? <div className="text-white">Transmitting...</div> : (
                  <>
                    <p className="text-white/40 text-sm">Drop photo or voice file here</p>
                    <input type="file" className="hidden" id="fileInput" onChange={e => e.target.files && handleUpload(e.target.files[0])} />
                    <label htmlFor="fileInput" className="mt-2 text-xs text-[#c77dff] cursor-pointer hover:underline">or click to browse</label>
                  </>
                )}
              </div>
            )}
            
            {formData.type === 'text' && (
              <button 
                onClick={() => {
                  // Add missing 'url' property to satisfy the Memory type
                  addMemory({
                    id: Date.now().toString(),
                    month: formData.month,
                    type: 'text',
                    title: formData.title,
                    content: formData.title, // In text mode title is content for simple demo
                    url: '',
                    date: new Date().toISOString().split('T')[0]
                  });
                  toggleBlackHole();
                }}
                className="w-full bg-[#c77dff] hover:bg-[#b060ff] text-white font-bold py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(199,125,255,0.4)]"
              >
                CAST INTO SPACE
              </button>
            )}
          </div>
          
          <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-[10px] text-white/30 leading-tight">
              <strong className="text-white/50 block mb-1 uppercase tracking-tighter">Pro Tip:</strong>
              Memories are stored in your localized cosmic dust (Browser Storage). To preserve them across time and space, commit new files to your GitHub repository folder.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
