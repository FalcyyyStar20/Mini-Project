import React, { useState } from 'react';
import { Play, CheckCircle2, XCircle, Code, Cpu } from 'lucide-react';
import { sound } from '../../utils/sound';

interface Props {
  currentInput: string;
  onOperatorChange: (op: string) => void;
}

export const Room4CodeLoopWidget: React.FC<Props> = ({ currentInput, onOperatorChange }) => {
  const [executionLog, setExecutionLog] = useState<string[] | null>(null);

  const testExecution = () => {
    sound.playClick();
    if (currentInput.trim() === '++') {
      sound.playSuccess();
      setExecutionLog([
        '[COMPILER] Lexical parse: Valid post-increment operator (++)',
        '[RUNTIME] Iteration 0: i=0 < 5 -> unlock() triggered',
        '[RUNTIME] Iteration 1: i=1 < 5 -> unlock() triggered',
        '[RUNTIME] Iteration 2: i=2 < 5 -> unlock() triggered',
        '[RUNTIME] Iteration 3: i=3 < 5 -> unlock() triggered',
        '[RUNTIME] Iteration 4: i=4 < 5 -> unlock() triggered',
        '[STATUS] Loop executed 5 iterations cleanly. Loop condition satisfied!'
      ]);
    } else {
      sound.playError();
      setExecutionLog([
        `[COMPILER_ERR] Invalid or non-conforming operator token "${currentInput || '(empty)'}"`,
        '[ERR] Unrecognized loop advancement operator.',
        '[HINT] Requires standard 2-character loop counter increment operator.'
      ]);
    }
  };

  return (
    <div className="glass-panel p-4 rounded-xl border border-cyan-500/30 bg-white/95 dark:bg-[#040816] space-y-4">
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
        <div className="flex items-center space-x-2 text-cyan-700 dark:text-cyan-300 font-orbitron font-bold text-xs uppercase tracking-wider">
          <Code className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <span>Interactive Execution Sandbox</span>
        </div>
        <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
          <Cpu className="w-3 h-3" />
          <span>JIT_V8_ENGINE</span>
        </span>
      </div>

      {/* Code Editor Mock */}
      <div className="bg-slate-950 dark:bg-[#02040b] rounded-lg border border-slate-800 p-4 font-mono text-xs sm:text-sm text-slate-200 overflow-x-auto shadow-inner">
        <div className="flex space-x-3">
          {/* Line Numbers */}
          <div className="text-slate-600 select-none text-right pr-2 border-r border-slate-800 space-y-1">
            <div>01</div>
            <div>02</div>
            <div>03</div>
            <div>04</div>
          </div>

          {/* Code Text */}
          <div className="space-y-1 leading-relaxed">
            <div>
              <span className="text-rose-400 font-semibold">for</span> (
              <span className="text-cyan-400">let</span> i ={' '}
              <span className="text-amber-300">0</span>; i &lt;{' '}
              <span className="text-amber-300">5</span>; i
              <span className="inline-block mx-1">
                <input
                  type="text"
                  maxLength={4}
                  value={currentInput}
                  onChange={(e) => onOperatorChange(e.target.value)}
                  placeholder="__"
                  className="w-12 py-0.5 px-1 text-center bg-cyan-950/80 border-b-2 border-cyan-400 text-cyan-300 font-bold focus:outline-none focus:border-emerald-400 text-glow-cyan"
                />
              </span>
              ) &#123;
            </div>
            <div className="pl-6">
              <span className="text-emerald-400 font-semibold">unlock</span>();
            </div>
            <div>&#125;</div>
          </div>
        </div>
      </div>

      {/* Run sandbox button */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={testExecution}
          className="px-4 py-2 rounded-lg bg-cyan-100 dark:bg-cyan-950/80 hover:bg-cyan-200 dark:hover:bg-cyan-900 border border-cyan-500/50 text-cyan-900 dark:text-cyan-300 font-mono text-xs flex items-center space-x-2 transition cursor-pointer shadow-[0_0_10px_rgba(56,189,248,0.25)] font-semibold"
        >
          <Play className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 fill-emerald-600 dark:fill-emerald-400" />
          <span>Test Run In Sandbox</span>
        </button>

        <span className="text-[11px] font-mono text-slate-500">
          Target: 2-character increment operator
        </span>
      </div>

      {/* Sandbox Execution Log */}
      {executionLog && (
        <div className="p-3 rounded-lg bg-slate-900 dark:bg-[#01040a] border border-cyan-500/20 font-mono text-[11px] space-y-1 animate-fadeIn">
          {executionLog.map((line, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-1.5 ${
                line.includes('ERR')
                  ? 'text-rose-400'
                  : line.includes('STATUS') || line.includes('Valid')
                  ? 'text-emerald-400 font-semibold'
                  : 'text-slate-300 dark:text-slate-400'
              }`}
            >
              {line.includes('ERR') ? (
                <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-500" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-cyan-400" />
              )}
              <span>{line}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
