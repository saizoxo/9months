
import React from 'react';
import { useMemoryStore } from '../hooks/useMemoryStore';

export const UIOverlay: React.FC = () => {
  const { 
    toggleLightCatcher, 
    toggleInnerHearth, 
    toggleGoals, 
    toggleHeartSearch,
    focusedMonth,
    setFocusedMonth,
    tutorialSeen,
    dismissTutorial,
    isViewerOpen,
    setIsViewerOpen
  } = useMemoryStore();

  const handleReset = () => {
    setFocusedMonth(null);
    setIsViewerOpen(false);
  };

  return (
    <>
      {/* Branding - Top Left */}
      <div className="fixed top-12 left-12 z-40 pointer-events-none select-none">
        <h1 className="text-xl md:text-2xl font-extralight tracking-[0.8em] text-white/95 uppercase">
          Nine Months
        </h1>
        <p className="text-[#ffd54f]/60 text-[8px] md:text-[9px] tracking-[1.4em] font-light uppercase mt-3">
          Shreya & Sarib
        </p>
      </div>

      {/* Reset Control - Top Right */}
      <div className="fixed top-12 right-12 z-40">
        <button 
          onClick={handleReset}
          className="px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-3xl text-white/40 hover:text-white hover:bg-white/10 transition-all text-[9px] tracking-[0.6em] uppercase font-light shadow-xl active:scale-95 hover:border-[#ffd54f]/30"
        >
          Reset View
        </button>
      </div>

      {/* Refined Mini HUD - Bottom Right */}
      <div className="fixed bottom-12 right-12 flex items-center gap-4 z-40 p-4 bg-[#0a031a]/95 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 shadow-[0_20px_80px_rgba(0,0,0,0.9)] transition-all duration-700 hover:border-[#ffd54f]/20 group">
        <div className="flex items-center gap-2 px-1">
          <button 
            onClick={toggleGoals} 
            title="Dreams"
            className="p-3 text-white/30 hover:text-[#ffd54f] transition-all hover:scale-110 active:scale-90"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.8} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
            </svg>
          </button>

          <button 
            onClick={toggleHeartSearch} 
            title="Search Heart"
            className="p-3 text-white/30 hover:text-[#ffd54f] transition-all hover:scale-110 active:scale-90"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        <div className="w-[1px] h-8 bg-white/10 group-hover:bg-[#ffd54f]/20 transition-colors"></div>

        <button 
          onClick={toggleInnerHearth} 
          title="Connect"
          className="p-5 bg-white/5 rounded-full text-white/40 hover:text-[#ffd54f] transition-all shadow-inner group/heart border border-white/5 hover:border-[#ffd54f]/40 active:scale-90"
        >
          <svg className="w-6 h-6 group-hover/heart:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        <div className="w-[1px] h-8 bg-white/10 group-hover:bg-[#ffd54f]/20 transition-colors"></div>

        <button 
          onClick={toggleLightCatcher} 
          title="Add Memory"
          className="p-3 text-white/30 hover:text-[#ffd54f] transition-all hover:scale-110 active:scale-90 group/add"
        >
          <svg className="w-5 h-5 group-hover/add:rotate-90 transition-transform duration-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>
    </>
  );
};
