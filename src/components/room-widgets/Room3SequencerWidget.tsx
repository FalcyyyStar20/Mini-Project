import React, { useState } from 'react';
import { Activity, Zap, TrendingUp, HelpCircle } from 'lucide-react';
import { sound } from '../../utils/sound';

interface Props {
  onSuggestNumber?: (val: string) => void;
}

export const Room3SequencerWidget: React.FC<Props> = () => {
  const [showAnalysis, setShowAnalysis] = useState(false);

  const steps = [
    { num: 2, delta: null, index: 1 },
    { num: 6, delta: '+4', index: 2 },
    { num: 12, delta: '+6', index: 3 },
    { num: 20, delta: '+8', index: 4 },
    { num: 30, delta: '+10', index: 5 },
    { num: '?', delta: '+12', index: 6, isTarget: true }
  ];

  return (
    <div className="glass-panel p-4 rounded-xl border border-cyan-500/30 bg-white/95 dark:bg-[#060c1d] space-y-4">
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
        <div className="flex items-center space-x-2 text-cyan-700 dark:text-cyan-300 font-orbitron font-bold text-xs uppercase tracking-wider">
          <Activity className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <span>Resonance Frequency Grid</span>
        </div>
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            setShowAnalysis(!showAnalysis);
          }}
          className="text-[11px] font-mono text-cyan-700 hover:text-cyan-800 dark:text-cyan-400 dark:hover:text-cyan-300 flex items-center space-x-1 cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{showAnalysis ? 'Hide Pattern Analysis' : 'Analyze Waveform Step'}</span>
        </button>
      </div>

      {/* Sequence Nodes Display */}
      <div className="grid grid-cols-6 gap-2 sm:gap-3 py-2">
        {steps.map((s, idx) => (
          <div
            key={idx}
            className={`flex flex-col items-center justify-center p-2 sm:p-3 rounded-lg border text-center transition-all ${
              s.isTarget
                ? 'bg-amber-100 dark:bg-amber-950/40 border-amber-500 dark:border-amber-400/80 text-amber-900 dark:text-amber-300 glow-amber animate-pulse'
                : 'bg-slate-100 dark:bg-slate-900/80 border-cyan-500/40 text-cyan-900 dark:text-cyan-300'
            }`}
          >
            <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400 uppercase">NODE {s.index}</span>
            <span className="font-orbitron font-black text-lg sm:text-2xl mt-1">
              {s.num}
            </span>
            {showAnalysis && s.delta && (
              <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-bold mt-1 bg-emerald-100 dark:bg-emerald-950/70 px-1 rounded border border-emerald-500/30">
                {s.delta}
              </span>
            )}
          </div>
        ))}
      </div>

      {showAnalysis ? (
        <div className="p-3 rounded-lg bg-slate-100 dark:bg-[#02050f] border border-emerald-500/30 text-xs font-mono text-slate-800 dark:text-slate-300 space-y-2 animate-fadeIn">
          <div className="flex items-center text-emerald-700 dark:text-emerald-400 font-bold space-x-1.5">
            <TrendingUp className="w-4 h-4" />
            <span>Harmonic Sequence Formulation:</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Method 1: Step additions increase by +2 each turn: <br />
            <span className="text-cyan-800 dark:text-cyan-300 font-semibold">2 (+4)= 6 (+6)= 12 (+8)= 20 (+10)= 30 (+12)= <strong>??</strong></span>
          </p>
          <p className="text-[11px] leading-relaxed">
            Method 2: Multiplicative formula <code className="text-emerald-700 dark:text-emerald-300">n × (n + 1)</code>: <br />
            <span className="text-cyan-800 dark:text-cyan-300 font-semibold">1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30, 6×7= <strong>[Calculate Node 6]</strong></span>
          </p>
        </div>
      ) : (
        <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 text-center">
          <Zap className="w-3 h-3 inline mr-1 text-cyan-600 dark:text-cyan-400" />
          Strict numeric evaluation is enforced. Calculate Node 6 to synchronize the power grid.
        </p>
      )}
    </div>
  );
};
