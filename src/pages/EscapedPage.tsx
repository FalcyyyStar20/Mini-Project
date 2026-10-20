import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  RotateCcw,
  Users,
  Flame,
  AlertCircle,
  Trash2,
  GraduationCap,
  Award
} from 'lucide-react';
import { WindowFrame } from '../components/WindowFrame';
import { useGame } from '../context/GameContext';
import { sound } from '../utils/sound';

interface LeaderboardRecord {
  id: string;
  agentName: string;
  email: string;
  completionTimeSeconds: number;
  formattedTime: string;
  roomsCompleted: number;
  completedAt: string;
  clearanceLevel: string;
}

export const EscapedPage: React.FC = () => {
  const navigate = useNavigate();
  const { agentName, email, elapsedSeconds, formattedTime, isRegistered, resetGame, stopTimer } = useGame();

  const [leaderboard, setLeaderboard] = useState<LeaderboardRecord[]>([]);
  const [playerRank, setPlayerRank] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Freeze score in component state so it never re-renders or changes
  const [frozenTime] = useState<string>(formattedTime || '01:00');
  const [frozenSeconds] = useState<number>(elapsedSeconds || 60);

  const hasMountedRef = useRef(false);
  const hasSubmittedRef = useRef(false);

  useEffect(() => {
    if (!isRegistered) {
      navigate('/');
      return;
    }

    // 1. Immediately halt live session clock so screen never flickers
    stopTimer();

    // 2. Fire celebratory confetti once only
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#10b981', '#fbbf24']
      });
      sound.playVictory();
    }

    // 3. Submit telemetry only once per session
    if (!hasSubmittedRef.current) {
      hasSubmittedRef.current = true;
      const sessionKey = `ESCAPED_SUBMITTED_${agentName}_${email}`;
      if (!sessionStorage.getItem(sessionKey)) {
        sessionStorage.setItem(sessionKey, 'true');
        submitOperativeScore();
      } else {
        fetchLeaderboardOnly();
      }
    }
  }, [isRegistered, navigate, stopTimer, agentName, email]);

  const submitOperativeScore = async () => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const postResponse = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentName,
          email,
          completionTimeSeconds: frozenSeconds,
          roomsCompleted: 6
        })
      });

      if (postResponse.ok) {
        const postData = await postResponse.json();
        if (postData.rank) setPlayerRank(postData.rank);
        if (postData.leaderboard) setLeaderboard(postData.leaderboard);
      } else {
        fetchLeaderboardOnly();
      }
    } catch {
      fetchLeaderboardOnly();
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchLeaderboardOnly = async () => {
    try {
      const getResponse = await fetch('/api/leaderboard');
      if (getResponse.ok) {
        const data = await getResponse.json();
        if (Array.isArray(data.leaderboard)) {
          setLeaderboard(data.leaderboard);
          const foundRank = data.leaderboard.findIndex(
            (r: LeaderboardRecord) =>
              r.agentName.toLowerCase() === agentName.toLowerCase()
          );
          if (foundRank !== -1) setPlayerRank(foundRank + 1);
        }
      }
    } catch {
      setServerError('Notice: Backend leaderboard operating in offline local state.');
    }
  };

  const handleClearLeaderboard = async () => {
    if (!window.confirm('Purge all local student examination records from leaderboard.json?')) return;
    sound.playClick();
    try {
      const res = await fetch('/api/leaderboard', { method: 'DELETE' });
      if (res.ok) {
        setLeaderboard([]);
        setPlayerRank(null);
        sessionStorage.clear();
      }
    } catch {
      // ignore
    }
  };

  const handlePlayAgain = () => {
    sound.playClick();
    sessionStorage.clear();
    resetGame();
    navigate('/');
  };

  const maskEmail = (mail: string) => {
    if (!mail) return 'student@gmail.com';
    const parts = mail.split('@');
    if (parts.length !== 2) return mail;
    const name = parts[0];
    const masked = name.length > 2 ? `${name.substring(0, 2)}***` : name;
    return `${masked}@${parts[1]}`;
  };

  return (
    <WindowFrame
      title="IT_ENG_MINI_PROJECT // EVALUATION_PORTAL"
      subtitle="ACADEMIC EVALUATION & PRACTICAL SIGN-OFF COMPLETE"
    >
      <div className="max-w-4xl mx-auto w-full py-4 space-y-6">
        {/* Academic Victory Banner */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-500/50 text-emerald-800 dark:text-emerald-300 text-xs font-mono glow-emerald-sm">
            <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-bold tracking-wider">PROJECT EVALUATION SIGN-OFF VERIFIED</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-cyan-600 to-amber-600 dark:from-emerald-400 dark:via-cyan-300 dark:to-amber-300 tracking-wider text-glow-emerald">
            PRACTICAL ASSESSMENT PASSED
          </h1>
          <p className="font-mono text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto">
            All 6 laboratory chambers bypassed successfully. Full mastery demonstrated across Hardware, DBMS SQL Security, Discrete Mathematics, OOP Syntax, IPv4 Subnetting, and Master Cryptography.
          </p>
        </div>

        {/* Student Project Certificate Card */}
        <div className="glass-panel-emerald p-6 sm:p-8 rounded-2xl border border-emerald-500/50 bg-white/95 dark:bg-[#051810]/90 shadow-2xl relative overflow-hidden glow-emerald">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-emerald-500/30 pb-6 mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950 border-2 border-emerald-400 flex items-center justify-center text-emerald-600 dark:text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <Award className="w-8 h-8 text-amber-500 dark:text-amber-400" />
              </div>
              <div>
                <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider block">
                  Student Examination Record
                </span>
                <h3 className="font-orbitron font-extrabold text-2xl text-slate-900 dark:text-white">
                  {agentName || 'Student Operative'}
                </h3>
                <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  {email || 'student@gmail.com'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {playerRank && (
                <div className="px-4 py-2 rounded-xl bg-amber-100 dark:bg-amber-950/80 border border-amber-500/60 text-amber-900 dark:text-amber-300 font-mono text-center glow-amber">
                  <span className="text-[10px] block uppercase text-amber-700 dark:text-amber-400 font-bold">Class Rank</span>
                  <span className="font-orbitron text-xl font-black">#{playerRank}</span>
                </div>
              )}
              <div className="px-4 py-2 rounded-xl bg-cyan-100 dark:bg-cyan-950/80 border border-cyan-500/60 text-cyan-900 dark:text-cyan-300 font-mono text-center glow-cyan-sm">
                <span className="text-[10px] block uppercase text-cyan-700 dark:text-cyan-400 font-bold">Total Time</span>
                <span className="font-orbitron text-xl font-black">{frozenTime}</span>
              </div>
            </div>
          </div>

          {/* Academic Evaluation Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-[#030e09] border border-emerald-500/30">
              <span className="text-slate-500 dark:text-slate-400 block text-[10px]">ROOMS SOLVED</span>
              <span className="text-emerald-800 dark:text-emerald-300 font-bold text-sm">6 OF 6 (100%)</span>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-[#030e09] border border-emerald-500/30">
              <span className="text-slate-500 dark:text-slate-400 block text-[10px]">EVALUATION RESULT</span>
              <span className="text-amber-800 dark:text-amber-300 font-bold text-sm">GRADE: A+ (EXCELLENT)</span>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-[#030e09] border border-emerald-500/30">
              <span className="text-slate-500 dark:text-slate-400 block text-[10px]">COURSE CURRICULUM</span>
              <span className="text-cyan-800 dark:text-cyan-300 font-bold text-sm">IT_ENG_302 MINI_PROJECT</span>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-[#030e09] border border-emerald-500/30">
              <span className="text-slate-500 dark:text-slate-400 block text-[10px]">PROFESSOR LOG</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold text-sm">LOCAL_FS_VERIFIED</span>
            </div>
          </div>
        </div>

        {/* Live Leaderboard Card (Local Only) */}
        <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 bg-white/95 dark:bg-[#050b18]/90 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cyan-500/20 pb-4">
            <div className="flex items-center space-x-2.5">
              <Users className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              <div>
                <h4 className="font-orbitron font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider text-glow-cyan">
                  Student Examination Leaderboard
                </h4>
                <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  Backed by Node.js Express server &amp; local <code className="text-cyan-600 dark:text-cyan-400">leaderboard.json</code> file for professor evaluation
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-emerald-800 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full flex items-center space-x-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                <span>Fastest Time</span>
              </span>
              <button
                type="button"
                onClick={handleClearLeaderboard}
                className="px-2.5 py-1 rounded-lg bg-rose-100 dark:bg-rose-950/60 hover:bg-rose-200 dark:hover:bg-rose-900 border border-rose-500/40 text-rose-800 dark:text-rose-300 font-mono text-xs flex items-center space-x-1 transition cursor-pointer"
                title="Purge all local records"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>
          </div>

          {serverError && (
            <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-950/60 border border-amber-500/40 text-amber-900 dark:text-amber-300 text-xs font-mono flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Leaderboard Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">Rank</th>
                  <th className="py-2.5 px-3">Student Full Name</th>
                  <th className="py-2.5 px-3 hidden sm:table-cell">Student Email</th>
                  <th className="py-2.5 px-3">Evaluation Time</th>
                  <th className="py-2.5 px-3 hidden md:table-cell">Evaluation Grade</th>
                  <th className="py-2.5 px-3 text-right">Sign-Off</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                {leaderboard.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-400 dark:text-slate-500 italic">
                      {isSubmitting ? 'Recording practical evaluation score...' : 'No local student examination records logged yet.'}
                    </td>
                  </tr>
                ) : (
                  leaderboard.map((entry, idx) => {
                    const isCurrentPlayer = entry.agentName.toLowerCase() === agentName.toLowerCase();
                    const rank = idx + 1;

                    return (
                      <tr
                        key={entry.id || idx}
                        className={`transition-colors ${
                          isCurrentPlayer
                            ? 'bg-cyan-100/80 dark:bg-cyan-950/60 text-cyan-950 dark:text-cyan-200 font-bold border-l-2 border-cyan-500'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-900/40 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {/* Rank */}
                        <td className="py-3 px-3">
                          {rank === 1 ? (
                            <span className="inline-flex items-center space-x-1 text-amber-500 dark:text-amber-400 font-bold">
                              <span>👑</span> #1
                            </span>
                          ) : rank === 2 ? (
                            <span className="text-slate-700 dark:text-slate-300 font-bold">🥈 #2</span>
                          ) : rank === 3 ? (
                            <span className="text-amber-700 dark:text-amber-600 font-bold">🥉 #3</span>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-500">#{rank}</span>
                          )}
                        </td>

                        {/* Student Name */}
                        <td className="py-3 px-3 font-semibold">
                          <span className={isCurrentPlayer ? 'text-cyan-800 dark:text-cyan-300 font-orbitron' : 'text-slate-800 dark:text-slate-200'}>
                            {entry.agentName}
                          </span>
                          {isCurrentPlayer && (
                            <span className="ml-2 px-1.5 py-0.5 rounded text-[9px] bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 border border-cyan-400/40">
                              YOU
                            </span>
                          )}
                        </td>

                        {/* Masked Email */}
                        <td className="py-3 px-3 text-slate-500 hidden sm:table-cell">
                          {maskEmail(entry.email)}
                        </td>

                        {/* Time */}
                        <td className="py-3 px-3 text-cyan-700 dark:text-cyan-400 font-bold">
                          {entry.formattedTime}
                        </td>

                        {/* Clearance */}
                        <td className="py-3 px-3 text-slate-600 dark:text-slate-400 hidden md:table-cell">
                          {entry.clearanceLevel || 'Grade: A+'}
                        </td>

                        {/* Status */}
                        <td className="py-3 px-3 text-right">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-400 border border-emerald-500/40 font-bold">
                            SIGNED OFF
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            type="button"
            onClick={handlePlayAgain}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-orbitron font-extrabold text-sm uppercase tracking-wider transition shadow-[0_0_25px_rgba(56,189,248,0.4)] flex items-center justify-center space-x-2 cursor-pointer group"
          >
            <RotateCcw className="w-4 h-4 group-hover:-rotate-90 transition-transform" />
            <span>RE-TAKE PRACTICAL ASSESSMENT</span>
          </button>
        </div>
      </div>
    </WindowFrame>
  );
};
