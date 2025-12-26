
import React, { useState, useRef, useEffect } from 'react';
import { useMemoryStore } from '../hooks/useMemoryStore';
import gsap from 'gsap';

export const Goals: React.FC = () => {
  const { isGoalsOpen, toggleGoals, goals, addGoal, role } = useMemoryStore();
  const [newGoal, setNewGoal] = useState({ title: '', targetDate: '', urgency: 5 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isGoalsOpen && containerRef.current) {
      gsap.fromTo(containerRef.current, 
        { opacity: 0, scale: 0.9, y: 30 }, 
        { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'expo.out' }
      );
    }
  }, [isGoalsOpen]);

  const isContributor = role === 'shreya' || role === 'admin';

  if (!isGoalsOpen) return null;

  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center p-8 bg-black/40 backdrop-blur-3xl">
      <div ref={containerRef} className="bg-gradient-to-br from-[#fff8e1]/10 to-transparent border border-white/10 rounded-[3rem] w-full max-w-xl p-10 md:p-14 shadow-2xl relative overflow-hidden">
        
        <button onClick={toggleGoals} className="absolute top-10 right-10 text-white/30 hover:text-white transition-colors text-4xl font-extralight">&times;</button>
        
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-extralight text-white tracking-widest uppercase mb-4">Our Dreams</h2>
          <p className="text-white/40 text-[10px] md:text-xs tracking-[0.3em] uppercase italic px-6 leading-relaxed font-light">
            {role === 'shreya' ? 
              "Where should we fly to next, Jaana?" : 
              "The stars we've yet to reach."}
          </p>
        </div>

        <div className="space-y-8">
          <div className="max-h-[300px] overflow-y-auto space-y-4 custom-scrollbar pr-2">
            {goals.length === 0 ? (
              <div className="text-center py-16 border border-white/5 rounded-[2.5rem] bg-white/5">
                <p className="text-white/10 italic text-sm tracking-widest leading-relaxed font-light">
                  "No dreams added yet... <br/> let's imagine something together."
                </p>
              </div>
            ) : (
              goals.map((g) => (
                <div key={g.id} className="flex items-center gap-6 bg-white/5 p-6 rounded-[2rem] border border-white/5 hover:border-[#ffd54f]/10 transition-all">
                  <div className="w-3 h-3 rounded-full bg-[#ffd54f] shadow-[0_0_15px_rgba(255,213,79,0.5)]"></div>
                  <div className="flex-1">
                    <div className="text-white/90 font-light text-base md:text-lg tracking-wide">{g.title}</div>
                    <div className="text-[9px] text-[#ffd54f]/40 uppercase tracking-[0.3em] mt-1 font-bold">{g.targetDate}</div>
                  </div>
                  <div className="flex gap-1.5">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className={`w-1.5 h-4 rounded-full ${i < (g.urgency / 3.3) ? 'bg-[#ffd54f]' : 'bg-white/5'}`}></div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {isContributor && (
            <div className="pt-8 border-t border-white/10">
              <h3 className="text-[9px] font-bold text-white/30 uppercase tracking-[0.5em] mb-6 text-center">Place a New Star</h3>
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="What is our next big dream?"
                  value={newGoal.title}
                  onChange={e => setNewGoal({...newGoal, title: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/5 outline-none focus:border-[#ffd54f]/40 transition-all font-light"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="date"
                    value={newGoal.targetDate}
                    onChange={e => setNewGoal({...newGoal, targetDate: e.target.value})}
                    className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-[#ffd54f]/40 transition-all [color-scheme:dark] font-light"
                  />
                  <select 
                    value={newGoal.urgency}
                    onChange={e => setNewGoal({...newGoal, urgency: parseInt(e.target.value)})}
                    className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white/40 outline-none focus:border-[#ffd54f]/40 transition-all font-light"
                  >
                    <option value="1">A Wish</option>
                    <option value="5">A Promise</option>
                    <option value="10">A Sacred Goal</option>
                  </select>
                </div>
                <button 
                  onClick={() => {
                    if (!newGoal.title) return;
                    addGoal({ ...newGoal, id: Date.now().toString() });
                    setNewGoal({ title: '', targetDate: '', urgency: 5 });
                  }}
                  className="w-full bg-[#ffd54f] text-[#060010] font-bold py-4 rounded-2xl hover:shadow-[0_0_30px_rgba(255,213,79,0.3)] transition-all uppercase tracking-[0.4em] text-[10px] active:scale-95"
                >
                  Light the Path
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
