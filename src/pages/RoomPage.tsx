import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Terminal,
  Send,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Shield,
  Sparkles,
  Lock
} from 'lucide-react';
import { WindowFrame } from '../components/WindowFrame';
import { HeaderTelemetry } from '../components/HeaderTelemetry';
import { useGame } from '../context/GameContext';
import { getPuzzleById, type PuzzleValidationResult } from '../models/Puzzle';
import { sound } from '../utils/sound';

// Room-specific interactive widgets
import { Room1KeyboardWidget } from '../components/room-widgets/Room1KeyboardWidget';
import { Room2DomInspectorWidget } from '../components/room-widgets/Room2DomInspectorWidget';
import { Room3SequencerWidget } from '../components/room-widgets/Room3SequencerWidget';
import { Room4CodeLoopWidget } from '../components/room-widgets/Room4CodeLoopWidget';
import { Room5ChromaticWidget } from '../components/room-widgets/Room5ChromaticWidget';
import { Room6KeypadWidget } from '../components/room-widgets/Room6KeypadWidget';

export const RoomPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const roomId = Number(id) || 1;

  const { isRegistered, completedRooms, markRoomCompleted, isRoomUnlocked } = useGame();

  const [inputAnswer, setInputAnswer] = useState('');
  const [feedback, setFeedback] = useState<PuzzleValidationResult | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [isRoomSolved, setIsRoomSolved] = useState(false);
  // Track wrong attempts per room for the 3-attempt hint lockout mechanic
  const [roomAttempts, setRoomAttempts] = useState<{ [id: number]: number }>({});

  const wrongAttempts = roomAttempts[roomId] || 0;
  const isHintUnlocked = wrongAttempts >= 3;
  const triesNeeded = Math.max(0, 3 - wrongAttempts);

  // Retrieve polymorphic puzzle instance
  const puzzle = getPuzzleById(roomId);

  // 1. Route authentication & progression guard
  useEffect(() => {
    if (!isRegistered) {
      navigate('/');
      return;
    }

    if (!isRoomUnlocked(roomId)) {
      // Navigate to highest unlocked room
      const highestUnlocked = completedRooms.length < 6 ? completedRooms.length + 1 : 6;
      navigate(`/room/${highestUnlocked}`);
    }
  }, [roomId, isRegistered, isRoomUnlocked, navigate, completedRooms.length]);

  // 2. Reset room input ONLY when navigating to a new room
  useEffect(() => {
    setInputAnswer('');
    setFeedback(null);
    setShowHint(false);
  }, [roomId]);

  // 3. Sync solved state
  useEffect(() => {
    setIsRoomSolved(completedRooms.includes(roomId));
  }, [completedRooms, roomId]);

  // Handle form submission
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!puzzle) return;

    // Polymorphic OOP validation call
    const result = puzzle.validate(inputAnswer);
    setFeedback(result);

    if (result.isValid) {
      sound.playSuccess();
      setIsRoomSolved(true);
      markRoomCompleted(roomId);
    } else {
      sound.playError();
      // Increment wrong attempts for this specific room
      setRoomAttempts((prev) => ({
        ...prev,
        [roomId]: (prev[roomId] || 0) + 1
      }));
    }
  };

  const handleNextRoom = () => {
    sound.playClick();
    if (roomId === 6) {
      navigate('/escaped');
    } else {
      navigate(`/room/${roomId + 1}`);
    }
  };

  if (!puzzle) {
    return (
      <WindowFrame title="SYS_ERROR // 404_SECTOR_NOT_FOUND">
        <div className="text-center py-12 space-y-4 font-mono">
          <p className="text-rose-400 font-bold">CRITICAL FAULT: Infiltration sector {roomId} does not exist.</p>
          <button
            onClick={() => navigate('/room/1')}
            className="px-4 py-2 rounded bg-cyan-600 text-white font-mono text-xs"
          >
            RETURN TO SECTOR 1
          </button>
        </div>
      </WindowFrame>
    );
  }

  return (
    <WindowFrame title={puzzle.roomCode} subtitle={puzzle.securityLevel} activeRoomId={roomId}>
      {/* Telemetry Bar & Persistent Welcome Banner */}
      <HeaderTelemetry currentRoomId={roomId} />

      <div className="space-y-6">
        {/* Room Header Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/20 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-cyan-700 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-950/70 px-2 py-0.5 rounded border border-cyan-500/30">
                SECTOR 0{puzzle.id} // 06
              </span>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                CLASS: <span className="text-slate-800 dark:text-slate-200 font-semibold">{puzzle.classification}</span>
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-orbitron font-extrabold text-slate-900 dark:text-white tracking-wide text-glow-cyan">
              {puzzle.name}
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            {!isHintUnlocked ? (
              <div
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700/80 text-slate-500 dark:text-slate-500 font-mono text-xs flex items-center space-x-1.5 cursor-not-allowed select-none"
                title="Hint unlocks after 3 incorrect answer attempts"
              >
                <Lock className="w-3.5 h-3.5 text-amber-500/70" />
                <span>🔒 HINT LOCKED ({triesNeeded} more wrong {triesNeeded === 1 ? 'try' : 'tries'} needed)</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setShowHint(!showHint);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/80 hover:bg-amber-200 dark:hover:bg-amber-900 border border-amber-500/80 text-amber-900 dark:text-amber-300 font-mono text-xs flex items-center space-x-1.5 transition cursor-pointer shadow-[0_0_12px_rgba(251,191,36,0.35)] animate-pulse"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>{showHint ? 'Hide Academic Hint' : '🔓 UNLOCK ACADEMIC HINT'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Collapsible Academic Hint */}
        {showHint && isHintUnlocked && (
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-500/60 text-amber-900 dark:text-amber-200 font-mono text-xs space-y-1.5 glow-amber animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              <span className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                <span>Academic Guidance Hint (Unlocked after 3 attempts):</span>
              </span>
              <span className="text-[10px] text-cyan-800 dark:text-cyan-300 bg-cyan-100 dark:bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/40">
                SUBJECT: {puzzle.academicSubject}
              </span>
            </div>
            <p className="leading-relaxed pl-6 text-slate-800 dark:text-slate-100">{puzzle.hint}</p>
          </div>
        )}

        {/* Puzzle Objective / Question Card */}
        <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-cyan-500/30 bg-white/95 dark:bg-[#050b18]/90 space-y-4 shadow-xl">
          <div className="flex items-center justify-between text-xs font-mono text-cyan-700 dark:text-cyan-400 border-b border-cyan-500/20 pb-2">
            <span className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span className="font-bold uppercase tracking-wider">Security Barrier Challenge</span>
            </span>
            <span className="text-[10px] text-slate-500">AUTH_CHALLENGE_{puzzle.id}</span>
          </div>

          {/* Question Text */}
          <div className="text-base sm:text-lg font-mono text-slate-800 dark:text-slate-100 whitespace-pre-line leading-relaxed">
            {puzzle.question}
          </div>
        </div>

        {/* Specialized Interactive Room Widget */}
        <div className="w-full">
          {roomId === 1 && (
            <Room1KeyboardWidget
              onVirtualKeyPress={(char) => {
                sound.playKeypress();
                setInputAnswer((prev) => prev + char);
              }}
            />
          )}

          {roomId === 2 && (
            <Room2DomInspectorWidget
              onSelectToken={(token) => {
                setInputAnswer(token);
              }}
            />
          )}

          {roomId === 3 && (
            <Room3SequencerWidget
              onSuggestNumber={(num) => {
                setInputAnswer(num);
              }}
            />
          )}

          {roomId === 4 && (
            <Room4CodeLoopWidget
              currentInput={inputAnswer}
              onOperatorChange={(op) => setInputAnswer(op)}
            />
          )}

          {roomId === 5 && (
            <Room5ChromaticWidget
              onSelectColor={(colorName) => {
                setInputAnswer(colorName);
              }}
            />
          )}

          {roomId === 6 && (
            <Room6KeypadWidget
              currentPin={inputAnswer}
              onPinChange={(pin) => setInputAnswer(pin)}
              onSubmitPin={() => handleSubmit()}
            />
          )}
        </div>

        {/* Validation Feedback Banner */}
        {feedback && (
          <div
            className={`p-4 rounded-xl border font-mono text-xs flex items-start space-x-3 animate-fadeIn ${
              feedback.isValid
                ? 'bg-emerald-950/80 border-emerald-500/80 text-emerald-200 glow-emerald'
                : 'bg-rose-950/80 border-rose-500/80 text-rose-200 glow-rose'
            }`}
          >
            {feedback.isValid ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <span className="font-bold uppercase tracking-wider block text-sm">
                {feedback.isValid ? 'ACCESS GRANTED // BYPASS PROTOCOL COMPLETE' : 'ACCESS DENIED // VERIFICATION REJECTED'}
              </span>
              <p className="text-xs sm:text-sm">{feedback.message}</p>
            </div>
          </div>
        )}

        {/* Interactive Command Input Form */}
        {!isRoomSolved ? (
          <form onSubmit={handleSubmit} className="glass-panel p-4 rounded-xl border border-cyan-500/30 bg-white/95 dark:bg-[#040815] space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-cyan-700 dark:text-cyan-400">
              <span className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span className="font-bold uppercase">Terminal Input Line</span>
              </span>
              <span className="text-[10px] text-slate-500">STDIN: READY</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-cyan-700 dark:text-cyan-400 font-mono text-xs">
                  root@sys:~#
                </div>
                <input
                  type="text"
                  value={inputAnswer}
                  onChange={(e) => {
                    setInputAnswer(e.target.value);
                    if (feedback && !feedback.isValid) setFeedback(null);
                  }}
                  onKeyDown={() => sound.playKeypress()}
                  placeholder="Enter response or decryption key..."
                  className="w-full pl-28 pr-4 py-3 bg-slate-50 dark:bg-[#02050e] border border-cyan-500/40 focus:border-cyan-500 dark:focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 rounded-lg text-slate-900 dark:text-white font-mono text-sm placeholder:text-slate-400 dark:placeholder:text-slate-600 shadow-inner"
                  autoComplete="off"
                />
              </div>

              <button
                type="submit"
                className="py-3 px-6 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-orbitron font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition shadow-[0_0_15px_rgba(56,189,248,0.4)] cursor-pointer shrink-0"
              >
                <span>TRANSMIT</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        ) : (
          /* Chamber Solved Notification & Next Navigation */
          <div className="glass-panel-emerald p-6 rounded-2xl border border-emerald-500/50 bg-emerald-50/90 dark:bg-[#04160e]/80 flex flex-col sm:flex-row items-center justify-between gap-4 glow-emerald">
            <div className="flex items-center space-x-3 text-emerald-800 dark:text-emerald-300">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 border border-emerald-400/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-orbitron font-black text-base sm:text-lg text-emerald-950 dark:text-white tracking-wide text-glow-emerald">
                  SECTOR 0{puzzle.id} BREACH AUTHORIZED!
                </h4>
                <p className="font-mono text-xs text-emerald-700 dark:text-emerald-300/80">
                  Telemetry logs updated. Cryptographic gate cleared.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleNextRoom}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-orbitron font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(16,185,129,0.6)] flex items-center justify-center space-x-2 cursor-pointer group"
            >
              <span>{roomId === 6 ? 'ENTER ESCAPED CHAMBER' : `PROCEED TO SECTOR 0${roomId + 1}`}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </WindowFrame>
  );
};
