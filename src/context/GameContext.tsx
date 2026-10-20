import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { sound } from '../utils/sound';

interface OperativeData {
  agentName: string;
  email: string;
  isRegistered: boolean;
  completedRooms: number[];
  startTime: number | null;
  elapsedSeconds: number;
  isTimerRunning: boolean;
}

interface GameContextType {
  agentName: string;
  email: string;
  isRegistered: boolean;
  completedRooms: number[];
  elapsedSeconds: number;
  formattedTime: string;
  isTimerRunning: boolean;
  soundEnabled: boolean;
  theme: 'dark' | 'light';
  registerOperative: (callsign: string, email: string) => void;
  markRoomCompleted: (roomId: number) => void;
  toggleSound: () => boolean;
  toggleTheme: () => void;
  resetGame: () => void;
  stopTimer: () => void;
  isRoomUnlocked: (roomId: number) => boolean;
}

const LOCAL_STORAGE_KEY = 'CYBER_ESCAPE_OPERATIVE_STATE';
const THEME_STORAGE_KEY = 'CYBER_ESCAPE_THEME';

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from LocalStorage if available
  const [operative, setOperative] = useState<OperativeData>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          agentName: parsed.agentName || '',
          email: parsed.email || '',
          isRegistered: Boolean(parsed.isRegistered),
          completedRooms: Array.isArray(parsed.completedRooms) ? parsed.completedRooms : [],
          startTime: parsed.startTime || null,
          elapsedSeconds: typeof parsed.elapsedSeconds === 'number' ? parsed.elapsedSeconds : 0,
          isTimerRunning: Boolean(parsed.isTimerRunning && parsed.completedRooms?.length < 6)
        };
      }
    } catch {
      // fallback
    }
    return {
      agentName: '',
      email: '',
      isRegistered: false,
      completedRooms: [],
      startTime: null,
      elapsedSeconds: 0,
      isTimerRunning: false
    };
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Theme state: dark or light
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    } catch {
      // fallback
    }
    return 'dark';
  });

  // Apply theme to HTML root element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    sound.playClick();
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(operative));
    } catch {
      // ignore
    }
  }, [operative]);

  // Live telemetry timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (operative.isTimerRunning && operative.isRegistered) {
      interval = setInterval(() => {
        setOperative((prev) => {
          if (!prev.isTimerRunning) return prev;
          return {
            ...prev,
            elapsedSeconds: prev.elapsedSeconds + 1
          };
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [operative.isTimerRunning, operative.isRegistered]);

  const registerOperative = useCallback((callsign: string, email: string) => {
    sound.playClick();
    setOperative({
      agentName: callsign.trim(),
      email: email.trim(),
      isRegistered: true,
      completedRooms: [],
      startTime: Date.now(),
      elapsedSeconds: 0,
      isTimerRunning: true
    });
  }, []);

  const markRoomCompleted = useCallback((roomId: number) => {
    setOperative((prev) => {
      if (prev.completedRooms.includes(roomId)) return prev;
      const nextCompleted = [...prev.completedRooms, roomId];
      const allCompleted = nextCompleted.length >= 6;
      return {
        ...prev,
        completedRooms: nextCompleted,
        isTimerRunning: !allCompleted
      };
    });
  }, []);

  const toggleSound = useCallback(() => {
    let nextState = false;
    setSoundEnabled((prev) => {
      nextState = !prev;
      sound.enabled = nextState;
      if (nextState) sound.playClick();
      return nextState;
    });
    return nextState;
  }, []);

  const stopTimer = useCallback(() => {
    setOperative((prev) => {
      if (!prev.isTimerRunning) return prev;
      return {
        ...prev,
        isTimerRunning: false
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    sound.playClick();
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setOperative({
      agentName: '',
      email: '',
      isRegistered: false,
      completedRooms: [],
      startTime: null,
      elapsedSeconds: 0,
      isTimerRunning: false
    });
  }, []);

  const isRoomUnlocked = useCallback((roomId: number): boolean => {
    if (roomId === 1) return true;
    // Room N is unlocked if Room N - 1 is completed
    return operative.completedRooms.includes(roomId - 1);
  }, [operative.completedRooms]);

  const formattedTime = useMemo(() => {
    const mins = Math.floor(operative.elapsedSeconds / 60);
    const secs = operative.elapsedSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, [operative.elapsedSeconds]);

  return (
    <GameContext.Provider
      value={{
        agentName: operative.agentName,
        email: operative.email,
        isRegistered: operative.isRegistered,
        completedRooms: operative.completedRooms,
        elapsedSeconds: operative.elapsedSeconds,
        formattedTime,
        isTimerRunning: operative.isTimerRunning,
        soundEnabled,
        theme,
        registerOperative,
        markRoomCompleted,
        toggleSound,
        toggleTheme,
        resetGame,
        stopTimer,
        isRoomUnlocked
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
