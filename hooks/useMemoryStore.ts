
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Memory, RelationshipGoal, CosmicState, OfflineWisdom } from '../types';

const DEFAULT_MEMORIES: Memory[] = [
  { id: 'm1-1', month: 1, type: 'text', title: 'The Start', url: '', content: 'The day everything changed..a simple vc.. two souls.. the day i prayed for my smile.. and i got the.. the day i asked God to make me happy.. and i got blessed.. with you jaana.', date: '2025-03-28' },
  { id: 'm9-1', month: 9, type: 'text', title: 'Infinite Growth', url: '', content: 'Nine months of blooming together.', date: '2025-02-01' }
];

export const useMemoryStore = create<CosmicState>()(
  persist(
    (set) => ({
      memories: DEFAULT_MEMORIES,
      goals: [],
      wisdomCache: [],
      activeMonth: null,
      focusedMonth: 1,
      isViewerOpen: false,
      isInnerHearthOpen: false,
      isGoalsOpen: false,
      isLightCatcherOpen: false,
      isHeartSearchOpen: false,
      tutorialSeen: false,
      addMemory: (memory) => set((state) => ({
        memories: [...state.memories, memory],
        focusedMonth: memory.month 
      })),
      removeMemory: (id) => set((state) => ({ memories: state.memories.filter(m => m.id !== id) })),
      addGoal: (goal) => set((state) => ({ goals: [...state.goals, goal] })),
      removeGoal: (id) => set((state) => ({ goals: state.goals.filter(g => g.id !== id) })),
      addWisdom: (theme, content) => set((state) => ({
        wisdomCache: [{ theme: theme.toLowerCase(), content, timestamp: Date.now() }, ...state.wisdomCache].slice(0, 50)
      })),
      setActiveMonth: (month) => set({ 
        activeMonth: month, 
        focusedMonth: month ?? 1, 
        isViewerOpen: !!month, 
        tutorialSeen: true 
      }),
      setFocusedMonth: (month) => set({ focusedMonth: month, tutorialSeen: true }),
      setIsViewerOpen: (open) => set((state) => ({ 
        isViewerOpen: open,
        activeMonth: open ? state.activeMonth : null 
      })),
      toggleInnerHearth: () => set((state) => ({ isInnerHearthOpen: !state.isInnerHearthOpen, tutorialSeen: true })),
      toggleGoals: () => set((state) => ({ isGoalsOpen: !state.isGoalsOpen, tutorialSeen: true })),
      toggleLightCatcher: () => set((state) => ({ isLightCatcherOpen: !state.isLightCatcherOpen, tutorialSeen: true })),
      toggleHeartSearch: () => set((state) => ({ isHeartSearchOpen: !state.isHeartSearchOpen, tutorialSeen: true })),
      dismissTutorial: () => set({ tutorialSeen: true }),
    }),
    {
      name: 'nine-months-to-us-sky-v2',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
