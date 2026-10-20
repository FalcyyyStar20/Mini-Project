import React, { useState } from 'react';
import { Maximize2, Minimize2, RotateCcw, Volume2, VolumeX, ShieldAlert, Terminal, Sun, Moon } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { sound } from '../utils/sound';

interface WindowFrameProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  activeRoomId?: number;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({
  title,
  subtitle,
  children,
  activeRoomId
}) => {
  const { soundEnabled, toggleSound, resetGame, theme, toggleTheme } = useGame();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [minimizedNotice, setMinimizedNotice] = useState<string | null>(null);

  // Red Dot: Reset / Abort Prompt
  const handleRedDotClick = () => {
    sound.playError();
    setShowResetModal(true);
  };

  // Yellow Dot: Quick diagnostics & Sound Toggle
  const handleYellowDotClick = () => {
    sound.playClick();
    const isNowOn = toggleSound();
    setMinimizedNotice(`AUDIO_BUS // ${isNowOn ? 'TRANSMITTING' : 'MUTED'}`);
    setTimeout(() => setMinimizedNotice(null), 2500);
  };

  // Green Dot: Fullscreen Toggle
  const handleGreenDotClick = async () => {
    sound.playClick();
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch {
      // Fallback
      setIsFullscreen(!isFullscreen);
    }
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto my-6 px-2 sm:px-4">
      {/* Outer Glow Halo */}
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-emerald-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 -z-10" />

      {/* Main Terminal Window Frame */}
      <div className="glass-panel rounded-xl overflow-hidden shadow-2xl border border-cyan-500/30 flex flex-col bg-white/95 dark:bg-[#070d1d]/90 relative transition-colors duration-200">
        {/* Subtle Scanline overlay */}
        <div className="scanline-overlay absolute inset-0 z-10 pointer-events-none opacity-20 dark:opacity-30" />

        {/* Retro-Futuristic Terminal Window Titlebar */}
        <header className="relative z-20 flex items-center justify-between px-4 py-3 bg-slate-100/90 dark:bg-[#0a1226]/95 border-b border-cyan-500/20 dark:border-cyan-500/30 select-none transition-colors duration-200">
          {/* macOS-style interactive window dots */}
          <div className="flex items-center space-x-2.5">
            <button
              onClick={handleRedDotClick}
              title="Reset Assessment Simulation (Red Dot)"
              aria-label="Abort Simulation"
              className="w-3.5 h-3.5 rounded-full bg-rose-500 hover:bg-rose-400 border border-rose-400/60 shadow-[0_0_8px_rgba(244,63,94,0.6)] cursor-pointer transition-transform hover:scale-110 flex items-center justify-center group"
            >
              <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold text-rose-950 leading-none">×</span>
            </button>
            <button
              onClick={handleYellowDotClick}
              title="Toggle Audio Synth Bus (Yellow Dot)"
              aria-label="Toggle Audio"
              className="w-3.5 h-3.5 rounded-full bg-amber-400 hover:bg-amber-300 border border-amber-300/60 shadow-[0_0_8px_rgba(251,191,36,0.6)] cursor-pointer transition-transform hover:scale-110 flex items-center justify-center group"
            >
              <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold text-amber-950 leading-none">-</span>
            </button>
            <button
              onClick={handleGreenDotClick}
              title="Toggle Viewport Fullscreen (Green Dot)"
              aria-label="Toggle Fullscreen"
              className="w-3.5 h-3.5 rounded-full bg-emerald-400 hover:bg-emerald-300 border border-emerald-300/60 shadow-[0_0_8px_rgba(52,211,153,0.6)] cursor-pointer transition-transform hover:scale-110 flex items-center justify-center group"
            >
              <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold text-emerald-950 leading-none">+</span>
            </button>

            <span className="ml-2 text-[10px] font-mono tracking-widest text-slate-500 hidden sm:inline-block">
              [IT_ENG_OS_V4.9]
            </span>
          </div>

          {/* Blinking System Header Title */}
          <div className="flex items-center space-x-2 text-center">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-ping" />
            <div className="flex flex-col items-center">
              <span className="font-mono text-xs sm:text-sm font-bold tracking-wider text-cyan-700 dark:text-cyan-300 text-glow-cyan uppercase flex items-center">
                <Terminal className="w-3.5 h-3.5 mr-1.5 text-cyan-600 dark:text-cyan-400 inline" />
                {title}
                <span className="inline-block w-2 h-3.5 ml-1 bg-cyan-600 dark:bg-cyan-400 animate-blink" />
              </span>
              {subtitle && (
                <span className="text-[10px] text-slate-600 dark:text-slate-400 font-mono tracking-wider">
                  {subtitle}
                </span>
              )}
            </div>
          </div>

          {/* Utility Quick Controls */}
          <div className="flex items-center space-x-2 text-xs font-mono">
            {minimizedNotice && (
              <span className="text-[10px] text-amber-600 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/70 border border-amber-500/40 px-2 py-0.5 rounded animate-pulse hidden md:inline">
                {minimizedNotice}
              </span>
            )}

            {/* Theme Toggle Button (Dark / Light Mode) */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded border border-cyan-500/40 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 shadow-xs transition-colors cursor-pointer flex items-center space-x-1"
              title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden lg:inline text-[10px] text-slate-300">LIGHT</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-cyan-700" />
                  <span className="hidden lg:inline text-[10px] text-slate-600">DARK</span>
                </>
              )}
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className={`p-1.5 rounded border transition-colors cursor-pointer ${
                soundEnabled
                  ? 'border-cyan-500/40 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 shadow-[0_0_8px_rgba(56,189,248,0.3)]'
                  : 'border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
              title={soundEnabled ? 'Mute Cyber Audio' : 'Enable Cyber Audio'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={handleGreenDotClick}
              className="p-1.5 rounded border border-cyan-500/40 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 shadow-xs transition-colors hidden sm:inline-flex cursor-pointer"
              title="Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </header>

        {/* Window Body */}
        <main className="relative z-20 p-4 sm:p-6 md:p-8 flex-1 flex flex-col justify-between">
          {children}
        </main>

        {/* Window Footer Status Line */}
        <footer className="relative z-20 px-4 py-2 bg-slate-100/95 dark:bg-[#050914] border-t border-cyan-500/20 text-[11px] font-mono flex flex-wrap items-center justify-between text-slate-600 dark:text-slate-400 gap-2 transition-colors duration-200">
          <div className="flex items-center space-x-3">
            <span className="flex items-center text-emerald-600 dark:text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 mr-1.5" />
              STATUS: EVALUATION_ACTIVE
            </span>
            <span className="hidden sm:inline text-slate-400 dark:text-slate-600">|</span>
            <span className="text-slate-600 dark:text-slate-400 hidden sm:inline">
              NODE: {activeRoomId ? `CHAMBER_0${activeRoomId}` : 'EXAMINATION_PORTAL'}
            </span>
          </div>
          <div className="text-slate-500 dark:text-slate-400">
            SECURITY: ZERO_TRUST // THEME: {theme.toUpperCase()}
          </div>
        </footer>
      </div>

      {/* Confirmation Modal when clicking Red Dot */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="glass-panel p-6 rounded-xl border-rose-500/60 max-w-md w-full shadow-2xl glow-rose">
            <div className="flex items-center space-x-3 text-rose-500 dark:text-rose-400 mb-3 font-orbitron font-bold text-lg">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
              <span>TERMINAL ABORT SEQUENCE</span>
            </div>
            <p className="text-sm font-mono text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
              WARNING: Executing core reset will erase student session telemetry and purge unlocked room credentials from local memory. Do you wish to abort?
            </p>
            <div className="flex items-center justify-end space-x-3 font-mono text-xs">
              <button
                onClick={() => {
                  sound.playClick();
                  setShowResetModal(false);
                }}
                className="px-4 py-2 rounded border border-slate-400 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
              >
                CANCEL_OVERRIDE
              </button>
              <button
                onClick={() => {
                  setShowResetModal(false);
                  resetGame();
                  window.location.href = '/';
                }}
                className="px-4 py-2 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold transition shadow-[0_0_15px_rgba(244,63,94,0.6)] flex items-center space-x-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>CONFIRM_RESET</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
