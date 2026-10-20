import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, Shield, ArrowRight, AlertTriangle, KeyRound, Cpu, UserCheck, GraduationCap, BookOpen } from 'lucide-react';
import { WindowFrame } from '../components/WindowFrame';
import { useGame } from '../context/GameContext';
import { sound } from '../utils/sound';

export const Lobby: React.FC = () => {
  const navigate = useNavigate();
  const { registerOperative, isRegistered, agentName, email: existingEmail, completedRooms } = useGame();

  const [callsign, setCallsign] = useState(agentName || '');
  const [email, setEmail] = useState(existingEmail || '');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Strict Gmail regex: must end explicitly with @gmail.com (case-insensitive)
  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanCallsign = callsign.trim();
    const cleanEmail = email.trim();

    // Callsign validation (minimum 2 characters)
    if (cleanCallsign.length < 2) {
      sound.playError();
      setErrorMessage('Validation Error: Student Full Name / Callsign must be at least 2 characters long.');
      return;
    }

    // Strict Email Validation: Explicitly ends with @gmail.com
    if (!cleanEmail) {
      sound.playError();
      setErrorMessage('Validation Error: Institutional protocol requires a valid @gmail.com student email address.');
      return;
    }

    if (!gmailRegex.test(cleanEmail)) {
      sound.playError();
      setErrorMessage('Validation Error: Institutional protocol requires a valid @gmail.com student email address.');
      return;
    }

    // Valid registration
    setIsSubmitting(true);
    sound.playSuccess();

    setTimeout(() => {
      registerOperative(cleanCallsign, cleanEmail);
      setIsSubmitting(false);
      navigate('/room/1');
    }, 600);
  };

  const handleContinueMission = () => {
    sound.playClick();
    const nextRoom = completedRooms.length < 6 ? completedRooms.length + 1 : 6;
    navigate(`/room/${nextRoom}`);
  };

  return (
    <WindowFrame
      title="IT_ENG_MINI_PROJECT // EVALUATION_PORTAL"
      subtitle="ACADEMIC PRACTICAL ASSESSMENT & ESCAPE LAB"
    >
      <div className="max-w-3xl mx-auto w-full py-4 space-y-8">
        {/* Academic Header Banner */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-100/80 dark:bg-cyan-950/70 border border-cyan-500/40 text-cyan-800 dark:text-cyan-300 text-xs font-mono mb-2 shadow-[0_0_12px_rgba(56,189,248,0.3)]">
            <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>COURSE: IT_ENG_302 // MINI-PROJECT EVALUATION</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-orbitron font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-teal-500 to-emerald-600 dark:from-cyan-400 dark:via-teal-300 dark:to-emerald-400 tracking-wider text-glow-cyan">
            CYBER ESCAPE: 6 ROOMS
          </h1>
          <p className="font-mono text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
            Interactive IT Engineering Mini-Project Practical Test. Students must navigate 6 real-world technical escape challenges spanning Hardware, Database SQL Security, Discrete Mathematics, OOP Loops, IPv4 Subnetting, and Master Cryptographic PINs.
          </p>
        </div>

        {/* Existing Active Student Session Banner */}
        {isRegistered && (
          <div className="glass-panel-emerald p-4 rounded-xl border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 glow-emerald-sm">
            <div className="flex items-center space-x-3 text-emerald-300">
              <UserCheck className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <p className="font-orbitron font-bold text-sm">
                  Active Student Assessment Found
                </p>
                <p className="font-mono text-xs text-emerald-200/80">
                  Student: <span className="font-bold text-white">{agentName}</span> | Completed: {completedRooms.length} of 6 Rooms
                </p>
              </div>
            </div>
            <button
              onClick={handleContinueMission}
              className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-orbitron font-bold text-xs tracking-wider uppercase transition shadow-[0_0_15px_rgba(16,185,129,0.5)] flex items-center space-x-2 shrink-0 cursor-pointer"
            >
              <span>Resume Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tactical Registration Form Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-cyan-500/30 shadow-2xl relative overflow-hidden bg-white/95 dark:bg-slate-950/80">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4 mb-6">
            <div className="flex items-center space-x-2.5 text-cyan-600 dark:text-cyan-400">
              <Terminal className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              <span className="font-orbitron font-bold text-sm uppercase tracking-wider text-glow-cyan">
                Student Examination Registration
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase flex items-center space-x-1">
              <BookOpen className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>PROFESSOR REVIEW READY</span>
            </span>
          </div>

          {/* Strict Validation Error Notice */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-rose-100 dark:bg-rose-950/80 border border-rose-500/70 text-rose-800 dark:text-rose-300 text-xs font-mono flex items-start space-x-3 glow-rose animate-bounce" style={{ animationIterationCount: 2 }}>
              <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold uppercase tracking-wider block text-rose-700 dark:text-rose-400 text-glow-rose">
                  REGISTRATION BLOCKED
                </span>
                <p className="text-rose-900 dark:text-rose-200">{errorMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Field 1: Student Full Name / Callsign */}
            <div className="space-y-2">
              <label
                htmlFor="callsign"
                className="block font-mono text-xs text-cyan-700 dark:text-cyan-300 uppercase tracking-wider font-semibold flex items-center justify-between"
              >
                <span>Student Full Name / Callsign (Min. 2 Chars)</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">ID: REQUIRED</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cyan-600/70 dark:text-cyan-500/70">
                  <Shield className="w-4 h-4" />
                </div>
                <input
                  id="callsign"
                  type="text"
                  value={callsign}
                  onChange={(e) => {
                    setCallsign(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  onKeyDown={() => sound.playKeypress()}
                  placeholder="e.g., Alex Chen, John Doe, Cipher"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#050a18] border border-cyan-500/30 focus:border-cyan-500 dark:focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 rounded-lg text-slate-900 dark:text-slate-100 font-mono text-sm placeholder:text-slate-400 dark:placeholder:text-slate-600 transition duration-200 shadow-inner"
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Field 2: Strict Gmail Address */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block font-mono text-xs text-cyan-700 dark:text-cyan-300 uppercase tracking-wider font-semibold flex items-center justify-between"
              >
                <span>Student Email (@gmail.com only)</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-normal">DOMAIN: STRICT GMAIL</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cyan-600/70 dark:text-cyan-500/70">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  onKeyDown={() => sound.playKeypress()}
                  placeholder="student@gmail.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#050a18] border border-cyan-500/30 focus:border-cyan-500 dark:focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 rounded-lg text-slate-900 dark:text-slate-100 font-mono text-sm placeholder:text-slate-400 dark:placeholder:text-slate-600 transition duration-200 shadow-inner"
                  autoComplete="off"
                />
              </div>
              <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                Institutional protocol requires a valid <span className="text-cyan-700 dark:text-cyan-300 font-semibold">@gmail.com</span> student account for academic score certification.
              </p>
            </div>

            {/* Launch Assessment Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-orbitron font-extrabold text-sm sm:text-base tracking-widest uppercase transition-all duration-300 shadow-[0_0_25px_rgba(56,189,248,0.4)] hover:shadow-[0_0_35px_rgba(16,185,129,0.6)] cursor-pointer flex items-center justify-center space-x-2 group"
              >
                {isSubmitting ? (
                  <>
                    <Cpu className="w-5 h-5 animate-spin" />
                    <span>AUTHENTICATING STUDENT CREDENTIALS...</span>
                  </>
                ) : (
                  <>
                    <span>START EVALUATION ASSESSMENT</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Academic Syllabus Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-lg bg-white/80 dark:bg-slate-950/60 border border-cyan-500/20 text-slate-700 dark:text-slate-300 flex items-start space-x-3 shadow-xs">
            <span className="text-cyan-600 dark:text-cyan-400 font-bold text-sm">R1-R2</span>
            <div>
              <p className="text-cyan-800 dark:text-cyan-300 font-semibold">Hardware &amp; C Recursion</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">I/O architecture &amp; recursive stack trace.</p>
            </div>
          </div>
          <div className="p-3.5 rounded-lg bg-white/80 dark:bg-slate-950/60 border border-emerald-500/20 text-slate-700 dark:text-slate-300 flex items-start space-x-3 shadow-xs">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">R3-R4</span>
            <div>
              <p className="text-emerald-800 dark:text-emerald-300 font-semibold">Discrete Math &amp; Loops</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Harmonic sequences and compiled syntax loops.</p>
            </div>
          </div>
          <div className="p-3.5 rounded-lg bg-white/80 dark:bg-slate-950/60 border border-amber-500/20 text-slate-700 dark:text-slate-300 flex items-start space-x-3 shadow-xs">
            <span className="text-amber-600 dark:text-amber-400 font-bold text-sm">R5-R6</span>
            <div>
              <p className="text-amber-800 dark:text-amber-300 font-semibold">OS Binary &amp; Cryptography</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Windows executable extensions and master PINs.</p>
            </div>
          </div>
        </div>
      </div>
    </WindowFrame>
  );
};
