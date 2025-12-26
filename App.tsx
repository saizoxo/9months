
import React from 'react';
import { CosmicUniverse } from './components/CosmicUniverse';
import { UIOverlay } from './components/UIOverlay';
import { MemoryViewer } from './components/MemoryViewer';
import { LightCatcher } from './components/LightCatcher';
import { InnerHearth } from './components/InnerHearth';
import { Goals } from './components/FutureTelescope';
import { HeartSearch } from './components/HeartSearch';

const App: React.FC = () => {
  return (
    <div className="relative w-screen h-screen overflow-hidden selection:bg-[#ffd54f]/20 bg-[#060010] text-white">
      {/* 3D Scene Layer */}
      <CosmicUniverse />
      
      {/* HUD Layer */}
      <UIOverlay />
      
      {/* Interaction Overlays */}
      <MemoryViewer />
      <LightCatcher />
      <InnerHearth />
      <Goals />
      <HeartSearch />

      {/* Atmospheric Post-Processing Simulations */}
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-t from-[#060010] via-transparent to-transparent opacity-90 z-10"></div>
      <div className="fixed inset-0 pointer-events-none shadow-[inset_0_0_250px_rgba(0,0,0,0.9)] z-10"></div>
      
      {/* Hidden detail */}
      <div className="fixed bottom-8 left-8 text-[8px] md:text-[9px] text-white/5 uppercase tracking-[1.5em] font-light pointer-events-none select-none z-10">
        Star of Sarib & Shreya
      </div>
    </div>
  );
};

export default App;
