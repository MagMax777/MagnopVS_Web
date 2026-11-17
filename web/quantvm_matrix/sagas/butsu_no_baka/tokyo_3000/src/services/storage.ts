import { StoryState, GameSettings } from '../types/game';

const SAVE_KEY = 'butsu_no_baka_save_v1';
const SETTINGS_KEY = 'butsu_no_baka_settings_v1';

export const initialStoryState: StoryState = {
  attachment: 0,
  liberation: 0,
  ritual_stability: 0,
  clues_found: [],
  story_flags: [],
  currentScene: 'TITLE',
  checkpointScene: 'SCENE_01',
  completedEndings: [],
  unlockedCards: [],
  hiddenObjectsFoundCount: 0,
  discoveredObjectIds: [],
  chosenOptions: {},
};

export const defaultSettings: GameSettings = {
  soundEnabled: true,
  soundVolume: 0.7,
  textSize: 'normal',
  reducedMotion: false,
  highContrast: false,
  viewMode: 'PLAYER',
  readingStyle: 'WEBTOON_VERTICAL',
};

// In-memory fallback if localStorage fails or is private/blocked
let memorySave: StoryState | null = null;
let memorySettings: GameSettings = { ...defaultSettings };

export function saveGameState(state: StoryState): boolean {
  try {
    memorySave = { ...state };
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(SAVE_KEY, JSON.stringify(state));
      return true;
    }
  } catch (err) {
    console.warn('localStorage save failed, using memory state:', err);
  }
  return false;
}

export function loadGameState(): StoryState | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const data = window.localStorage.getItem(SAVE_KEY);
      if (data) {
        const parsed = JSON.parse(data) as StoryState;
        memorySave = parsed;
        return parsed;
      }
    }
  } catch (err) {
    console.warn('localStorage load failed, falling back:', err);
  }
  return memorySave ? { ...memorySave } : null;
}

export function hasSavedGame(): boolean {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const item = window.localStorage.getItem(SAVE_KEY);
      if (item) {
        const parsed = JSON.parse(item) as StoryState;
        // Check if there is actual progress beyond the title
        return parsed && parsed.currentScene !== 'TITLE';
      }
    }
  } catch {
    // Ignore
  }
  return memorySave !== null && memorySave.currentScene !== 'TITLE';
}

export function clearSavedGame(): void {
  memorySave = null;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(SAVE_KEY);
    }
  } catch (err) {
    console.warn('Failed to clear save:', err);
  }
}

export function saveSettings(settings: GameSettings): void {
  memorySettings = { ...settings };
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    }
  } catch {
    // Ignore
  }
}

export function loadSettings(): GameSettings {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const data = window.localStorage.getItem(SETTINGS_KEY);
      if (data) {
        return { ...defaultSettings, ...JSON.parse(data) };
      }
    }
  } catch {
    // Ignore
  }
  return { ...memorySettings };
}
