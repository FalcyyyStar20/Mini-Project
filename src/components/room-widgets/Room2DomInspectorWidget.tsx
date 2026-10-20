import React, { useState } from 'react';
import { Layers, Play, RotateCcw, HelpCircle, Sparkles, Code2 } from 'lucide-react';
import { sound } from '../../utils/sound';

interface Props {
  onSelectToken?: (token: string) => void;
}

export const Room2DomInspectorWidget: React.FC<Props> = () => {
  // Call stack depth step (0 to 6)
  const [callStackDepth, setCallStackDepth] = useState<number>(0);
  const [showRecursionTree, setShowRecursionTree] = useState<boolean>(false);

  const stackFrames = [
    { call: 'main()', desc: 'Invokes printf("%d", solve(6))', frame: 'Base Frame' },
    { call: 'solve(6)', desc: 'n=6 > 1 => returns 6 * solve(5)', frame: 'Frame 1' },
    { call: 'solve(5)', desc: 'n=5 > 1 => returns 5 * solve(4)', frame: 'Frame 2' },
    { call: 'solve(4)', desc: 'n=4 > 1 => returns 4 * solve(3)', frame: 'Frame 3' },
    { call: 'solve(3)', desc: 'n=3 > 1 => returns 3 * solve(2)', frame: 'Frame 4' },
    { call: 'solve(2)', desc: 'n=2 > 1 => returns 2 * solve(1)', frame: 'Frame 5' },
    { call: 'solve(1)', desc: 'Base Case reached (n <= 1) => returns 1', frame: 'Base Return' }
  ];

  const handleNextStep = () => {
    sound.playClick();
    if (callStackDepth < stackFrames.length - 1) {
      setCallStackDepth((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    sound.playClick();
    setCallStackDepth(0);
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-cyan-400/40 bg-white/95 dark:bg-[#061126] shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cyan-500/20 pb-3">
        <div className="flex items-center space-x-2 text-cyan-700 dark:text-cyan-300 font-orbitron font-bold text-xs uppercase tracking-wider">
          <Layers className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <span>Interactive C Call Stack &amp; Recursion Tracer</span>
        </div>
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            setShowRecursionTree(!showRecursionTree);
          }}
          className="text-[11px] font-mono text-cyan-700 hover:text-cyan-800 dark:text-cyan-400 dark:hover:text-cyan-300 flex items-center space-x-1 cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{showRecursionTree ? 'Hide Call Stack Tree' : 'View Call Stack Tree'}</span>
        </button>
      </div>

      {/* Code Snippet Box */}
      <div className="p-4 rounded-xl bg-slate-950 dark:bg-[#02050f] border border-cyan-500/30 font-mono text-xs space-y-3">
        <div className="flex items-center justify-between text-slate-400 text-[11px] border-b border-slate-800 pb-2">
          <span className="flex items-center space-x-1.5 text-cyan-300">
            <Code2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>recursion_factorial.c</span>
          </span>
          <span className="text-[10px] text-emerald-400">GCC_COMPILER // X86_64</span>
        </div>

        <div className="p-3 rounded-lg bg-[#010308] border border-slate-800 text-slate-300 font-mono text-[11px] leading-relaxed overflow-x-auto">
          <div><span className="text-cyan-400">#include</span> &lt;stdio.h&gt;</div>
          <div><span className="text-rose-400 font-bold">int</span> <span className="text-emerald-300 font-bold">solve</span>(<span className="text-rose-400 font-bold">int</span> n) &#123;</div>
          <div className="pl-4"><span className="text-rose-400 font-bold">if</span> (n &lt;= <span className="text-amber-300">1</span>) <span className="text-rose-400 font-bold">return</span> <span className="text-amber-300">1</span>; <span className="text-slate-500">// Base Case</span></div>
          <div className="pl-4"><span className="text-rose-400 font-bold">return</span> n * <span className="text-emerald-300">solve</span>(n - <span className="text-amber-300">1</span>); <span className="text-slate-500">// Recursive Step</span></div>
          <div>&#125;</div>
          <div><span className="text-rose-400 font-bold">int</span> <span className="text-emerald-300 font-bold">main</span>() &#123;</div>
          <div className="pl-4">printf(<span className="text-emerald-200">&quot;%d&quot;</span>, <span className="text-emerald-300">solve</span>(<span className="text-amber-300">6</span>));</div>
          <div className="pl-4"><span className="text-rose-400 font-bold">return</span> <span className="text-amber-300">0</span>;</div>
          <div>&#125;</div>
        </div>
      </div>

      {/* Interactive Step-by-Step Call Stack Visualizer */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#030816] border border-cyan-500/30 space-y-3 font-mono text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          <span className="text-slate-800 dark:text-slate-300 font-bold flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span>Call Stack Push &amp; Pop Simulator (Depth: {callStackDepth}/6):</span>
          </span>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={handleNextStep}
              disabled={callStackDepth >= stackFrames.length - 1}
              className={`px-3 py-1 rounded text-xs font-bold flex items-center space-x-1 cursor-pointer transition ${
                callStackDepth < stackFrames.length - 1
                  ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
              }`}
            >
              <Play className="w-3 h-3 fill-current" />
              <span>STEP FORWARD</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs flex items-center space-x-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>RESET</span>
            </button>
          </div>
        </div>

        {/* Stack visualization */}
        <div className="space-y-1.5 pt-1">
          {stackFrames.slice(0, callStackDepth + 1).map((sf, idx) => (
            <div
              key={idx}
              className={`p-2 rounded-lg border flex items-center justify-between animate-fadeIn text-[11px] ${
                idx === callStackDepth
                  ? 'bg-cyan-100 dark:bg-cyan-950/80 border-cyan-500 dark:border-cyan-400/80 text-cyan-950 dark:text-cyan-200 glow-cyan-sm font-semibold'
                  : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400'
              }`}
            >
              <span className="font-bold text-amber-600 dark:text-amber-300">{sf.call}</span>
              <span className="text-slate-600 dark:text-slate-300 text-right">{sf.desc}</span>
            </div>
          ))}
        </div>

        {callStackDepth >= stackFrames.length - 1 && (
          <div className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-500/50 text-emerald-900 dark:text-emerald-200 text-xs leading-relaxed animate-fadeIn">
            <strong className="text-emerald-950 dark:text-white block uppercase">Call Stack Unwinding:</strong>
            Base case returned 1. Unwinding expression: <code className="text-amber-700 dark:text-amber-300 font-bold">6 × 5 × 4 × 3 × 2 × 1</code>.
            Compute the final integer product and transmit it below!
          </div>
        )}
      </div>

      {/* Call Stack Reference Drawer */}
      {showRecursionTree && (
        <div className="p-4 rounded-xl bg-slate-100 dark:bg-[#02040b] border border-cyan-500/30 font-mono text-xs space-y-2 animate-fadeIn">
          <div className="text-cyan-700 dark:text-cyan-400 font-bold uppercase tracking-wider text-[11px]">
            Academic Principle: Mathematical Induction &amp; Factorial
          </div>
          <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
            A recursive function solves a problem by calling a smaller instance of itself until it reaches the terminating base case (<code className="text-cyan-700 dark:text-cyan-300">n &lt;= 1</code>). For <code className="text-amber-700 dark:text-amber-300">n = 6</code>, it computes factorial: <code className="text-amber-700 dark:text-amber-300">6!</code>.
          </p>
        </div>
      )}
    </div>
  );
};
