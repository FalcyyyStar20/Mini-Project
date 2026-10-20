import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Lock, Shield, Timer, Zap, Radio } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { sound } from '../utils/sound';

interface HeaderTelemetryProps {
  currentRoomId?: number;
}

export const HeaderTelemetry: React.FC<HeaderTelemetryProps> = ({ currentRoomId }) => {
  const navigate = useNavigate();
  const { agentName, isRegistered, completedRooms, formattedTime, isRoomUnlocked } = useGame();

  const totalRooms = 6;
  const rooms = [
    { id: 1, name: 'Gatekeeper', tag: 'Riddle' },
    { id: 2, name: 'Recursion', tag: 'C Program' },
    { id: 3, name: 'Sequencer', tag: 'Math' },
    { id: 4, name: 'Loop', tag: 'Syntax' },
    { id: 5, name: 'Filesystem', tag: 'Binary Ext' },
    { id: 6, name: 'Master Lock', tag: 'Crypto PIN' },
  ];

  const handleRoomClick = (roomId: number) => {
    if (!isRoomUnlocked(roomId)) {
      sound.playError();
      return;
    }
    sound.playClick();
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="w-full mb-6 space-y-4">
      {/* Operative Welcome & Session Telemetry Banner */}
      {isRegistered && (
        <div className="glass-panel p-3.5 sm:p-4 rounded-xl border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_0_20px_rgba(56,189,248,0.15)] bg-gradient-to-r from-slate-100 via-cyan-50 to-slate-100 dark:from-slate-950 dark:via-[#071329] dark:to-slate-950">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shadow-[0_0_12px_rgba(56,189,248,0.3)]">
                <Shield className="w-5 h-5" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-950 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono text-cyan-700 dark:text-cyan-400 tracking-wider uppercase font-semibold">
                  Student Assessment Active
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 flex items-center space-x-1">
                  <Zap className="w-3 h-3 text-amber-500 dark:text-amber-400" />
                  <span>Evaluation: In Progress</span>
                </span>
              </div>
              <h2 className="text-sm sm:text-base md:text-lg font-orbitron font-bold text-slate-900 dark:text-white tracking-wide text-glow-cyan flex flex-wrap items-center">
                <span className="text-amber-500 dark:text-amber-400 mr-1.5">⚡</span>
                Welcome,{' '}
                <span className="text-cyan-700 dark:text-cyan-300 mx-1.5 underline decoration-cyan-400/40">
                  {agentName || 'Student'}
                </span>
                ! Complete all 6 rooms for evaluation sign-off.
              </h2>
            </div>
          </div>

          {/* Live Session Timer (Top-Right of every room) */}
          <div className="flex items-center space-x-3 self-end sm:self-center">
            <div className="px-4 py-2 rounded-lg bg-white dark:bg-[#050b18] border border-cyan-500/40 shadow-[0_0_15px_rgba(56,189,248,0.2)] flex items-center space-x-2.5">
              <Timer className="w-4 h-4 text-cyan-600 dark:text-cyan-400 animate-spin text-glow-cyan" style={{ animationDuration: '4s' }} />
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center">
                  <Radio className="w-2.5 h-2.5 mr-1 text-emerald-500 dark:text-emerald-400 animate-pulse" />
                  Live Session Clock
                </span>
                <span className="font-mono text-lg sm:text-xl font-black text-cyan-700 dark:text-cyan-300 tracking-wider">
                  {formattedTime}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Visual 6-Room Progress Bar */}
      <div className="glass-panel p-3 sm:p-4 rounded-xl border border-cyan-500/20 bg-white/80 dark:bg-slate-950/70">
        <div className="flex items-center justify-between mb-2.5 px-1">
          <span className="font-mono text-xs uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center">
            <span className="w-2 h-2 rounded-full bg-cyan-500 dark:bg-cyan-400 mr-2 animate-ping" />
            Infiltration Pathway Telemetry ({completedRooms.length} of {totalRooms} Breached)
          </span>
          <span className="font-mono text-xs text-cyan-700 dark:text-cyan-400 font-bold">
            {Math.round((completedRooms.length / totalRooms) * 100)}% UNLOCKED
          </span>
        </div>

        {/* 6-room step bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {rooms.map((room) => {
            const isCompleted = completedRooms.includes(room.id);
            const isActive = currentRoomId === room.id;
            const isUnlocked = isRoomUnlocked(room.id);

            let borderStyle = 'border-slate-300 dark:border-slate-800 text-slate-400 dark:text-slate-600 bg-slate-100 dark:bg-slate-900/40 opacity-50 cursor-not-allowed';
            let badgeBg = 'bg-slate-200 dark:bg-slate-800 text-slate-500';

            if (isCompleted) {
              borderStyle = 'border-emerald-500/60 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 glow-emerald-sm cursor-pointer hover:border-emerald-400';
              badgeBg = 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40';
            } else if (isActive) {
              borderStyle = 'border-cyan-500 text-cyan-800 dark:text-cyan-200 bg-cyan-100/70 dark:bg-cyan-950/40 glow-cyan animate-pulse cursor-default';
              badgeBg = 'bg-cyan-500/30 text-cyan-800 dark:text-cyan-300 border border-cyan-400/60';
            } else if (isUnlocked) {
              borderStyle = 'border-cyan-500/40 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 cursor-pointer hover:border-cyan-400/80';
              badgeBg = 'bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-400';
            }

            return (
              <button
                key={room.id}
                onClick={() => handleRoomClick(room.id)}
                disabled={!isUnlocked}
                className={`p-2.5 rounded-lg border text-left transition-all duration-300 relative overflow-hidden group ${borderStyle}`}
              >
                {/* Active pulsating beacon */}
                {isActive && (
                  <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none overflow-hidden">
                    <div className="absolute transform rotate-45 bg-cyan-400 text-[8px] font-bold py-0.5 right-[-35px] top-[18px] w-[120px]" />
                  </div>
                )}

                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${badgeBg}`}>
                    R_0{room.id}
                  </span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                  ) : isUnlocked ? (
                    <span className="w-2 h-2 rounded-full bg-cyan-500 dark:bg-cyan-400 shrink-0" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0" />
                  )}
                </div>

                <div className="font-orbitron font-semibold text-xs tracking-tight truncate">
                  {room.name}
                </div>
                <div className="font-mono text-[9px] text-slate-500 dark:text-slate-400 tracking-wider truncate">
                  {room.tag}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
