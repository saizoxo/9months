
import React from 'react';

export const GitHubSyncInfo: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-2xl p-6">
      <div className="max-w-xl w-full bg-[#1a0b3a] border border-[#ffd54f]/20 rounded-[3rem] p-12 relative shadow-2xl">
        <button onClick={onClose} className="absolute top-8 right-10 text-white/40 hover:text-white transition-colors text-3xl font-extralight">&times;</button>
        
        <h2 className="text-3xl font-light tracking-widest text-[#ffd54f] mb-6 uppercase">Syncing our Stars</h2>
        <p className="text-white/60 mb-8 leading-relaxed font-light italic">
          "Hey Sarib, to make new memories appear automatically, just drop files into your GitHub repository under <code className="bg-black/40 px-2 py-1 rounded text-[#ffd54f]">public/assets/memories/</code> using this naming code:"
        </p>
        
        <div className="bg-black/40 p-8 rounded-[2rem] font-mono text-sm text-[#ffd54f] space-y-4 mb-8 border border-white/5">
          <div className="flex flex-col gap-1">
             <span className="text-[10px] text-white/20 uppercase">A Photo:</span>
             <p>month-1_type-photo_First_Date.jpg</p>
          </div>
          <div className="flex flex-col gap-1">
             <span className="text-[10px] text-white/20 uppercase">A Voice Echo:</span>
             <p>month-3_type-voice_Sweet_Laughs.mp3</p>
          </div>
          <div className="flex flex-col gap-1">
             <span className="text-[10px] text-white/20 uppercase">A Note:</span>
             <p>month-7_type-text_Deep_Night_Talk.txt</p>
          </div>
        </div>
        
        <ul className="text-white/40 text-[11px] space-y-3 font-light list-disc pl-5 uppercase tracking-widest">
          <li>Month: Use 1 up to 12 (the sky will grow!)</li>
          <li>Type: Choose photo, voice, or text</li>
          <li>Spaces: Use underscores instead of spaces</li>
          <li>Push: Commit and push to see the stars align</li>
        </ul>
      </div>
    </div>
  );
};
