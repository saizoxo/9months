
export type MemoryType = 'photo' | 'voice' | 'text';

export interface Memory {
  id: string;
  month: number;
  type: MemoryType;
  title: string;
  url: string; 
  content?: string;
  date: string;
}

export interface RelationshipGoal {
  id: string;
  title: string;
  targetDate: string;
  urgency: number; // 1-10
}

export interface OfflineWisdom {
  theme: string;
  content: string;
  timestamp: number;
}

export interface CosmicState {
  memories: Memory[];
  goals: RelationshipGoal[];
  wisdomCache: OfflineWisdom[];
  activeMonth: number | null;
  focusedMonth: number | null;
  isViewerOpen: boolean;
  isInnerHearthOpen: boolean; 
  isGoalsOpen: boolean; 
  isLightCatcherOpen: boolean;
  isHeartSearchOpen: boolean;
  tutorialSeen: boolean;
  addMemory: (memory: Memory) => void;
  removeMemory: (id: string) => void;
  addGoal: (goal: RelationshipGoal) => void;
  removeGoal: (id: string) => void;
  addWisdom: (theme: string, content: string) => void;
  setActiveMonth: (month: number | null) => void;
  setFocusedMonth: (month: number | null) => void;
  setIsViewerOpen: (open: boolean) => void;
  toggleInnerHearth: () => void;
  toggleGoals: () => void;
  toggleLightCatcher: () => void;
  toggleHeartSearch: () => void;
  dismissTutorial: () => void;
}
