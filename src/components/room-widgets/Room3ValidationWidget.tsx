import React, { useState } from 'react';
import { ShieldCheck, AlertCircle, CheckCircle2, Terminal, Code2 } from 'lucide-react';
import { sound } from '../../utils/sound';

export const Room3ValidationWidget: React.FC = () => {
  const [testEmail, setTestEmail] = useState('operative@gmail.com');

  // JavaScript control structure validation logic
  const isHtmlValid = Boolean(testEmail && testEmail.includes('@') && testEmail.includes('.'));
  const isLengthValid = testEmail.trim().length >= 6;
  const isGmailDomain = testEmail.trim().toLowerCase().endsWith('@gmail.com');
  const isFullyValid = isHtmlValid && isLengthValid && isGmailDomain;

  return (
    <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 bg-white/95 dark:bg-[#060c1d] space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cyan-500/20 pb-3">
        <div className="flex items-center space-x-2 text-cyan-700 dark:text-cyan-300 font-orbitron font-bold text-xs uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <span>Experiment 3: HTML5, CSS &amp; JavaScript Control Flow Validator</span>
        </div>
        <span className="text-[10px] font-mono text-cyan-700 dark:text-cyan-400 flex items-center space-x-1">
          <Terminal className="w-3.5 h-3.5" />
          <span>ES6 CONTROL STRUCTURES</span>
        </span>
      </div>

      {/* Interactive Form Validator Test Bed */}
      <div className="space-y-3 font-mono text-xs">
        <div className="space-y-1.5">
          <label className="block text-slate-700 dark:text-slate-300 font-semibold text-[11px] uppercase">
            Test Email String in JavaScript Control Filter:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={testEmail}
              onChange={(e) => {
                setTestEmail(e.target.value);
                sound.playKeypress();
              }}
              placeholder="e.g. test@gmail.com or user@yahoo.com"
              className={`flex-1 px-3 py-2.5 rounded-lg border font-mono text-xs transition duration-200 outline-none ${
                isFullyValid
                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 focus:ring-1 focus:ring-emerald-400'
                  : 'border-rose-400 bg-rose-50/50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200 focus:ring-1 focus:ring-rose-400'
              }`}
            />
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setTestEmail('student@gmail.com');
              }}
              className="px-3 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] cursor-pointer"
            >
              Preset Valid
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setTestEmail('hacker@outlook.com');
              }}
              className="px-3 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] cursor-pointer"
            >
              Preset Invalid
            </button>
          </div>
        </div>

        {/* 3-Tier Control Flow Execution Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          {/* Step 1: HTML5 Constraint Check */}
          <div className={`p-3 rounded-xl border ${
            isHtmlValid
              ? 'border-emerald-500/60 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
              : 'border-rose-400/60 bg-rose-50/70 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200'
          }`}>
            <div className="flex items-center space-x-1.5 font-bold text-[11px] mb-1">
              {isHtmlValid ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <AlertCircle className="w-3.5 h-3.5 text-rose-500" />}
              <span>1. HTML5 Pattern Rule</span>
            </div>
            <p className="text-[10px] text-slate-600 dark:text-slate-400">
              type=&quot;email&quot; required RFC format syntax.
            </p>
          </div>

          {/* Step 2: JS Length Control Structure */}
          <div className={`p-3 rounded-xl border ${
            isLengthValid
              ? 'border-emerald-500/60 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
              : 'border-rose-400/60 bg-rose-50/70 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200'
          }`}>
            <div className="flex items-center space-x-1.5 font-bold text-[11px] mb-1">
              {isLengthValid ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <AlertCircle className="w-3.5 h-3.5 text-rose-500" />}
              <span>2. JS Length Condition</span>
            </div>
            <p className="text-[10px] text-slate-600 dark:text-slate-400">
              if (email.length &gt;= 6) // Minimum characters.
            </p>
          </div>

          {/* Step 3: JS endsWith() Control Structure */}
          <div className={`p-3 rounded-xl border ${
            isGmailDomain
              ? 'border-emerald-500/60 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
              : 'border-rose-400/60 bg-rose-50/70 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200'
          }`}>
            <div className="flex items-center space-x-1.5 font-bold text-[11px] mb-1">
              {isGmailDomain ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <AlertCircle className="w-3.5 h-3.5 text-rose-500" />}
              <span>3. endsWith(&apos;@gmail.com&apos;)</span>
            </div>
            <p className="text-[10px] text-slate-600 dark:text-slate-400">
              Strict institutional @gmail.com domain guard.
            </p>
          </div>
        </div>

        {/* Code View of JavaScript Control Structure */}
        <div className="p-3 rounded-lg bg-slate-950 text-slate-300 font-mono text-[11px] leading-relaxed border border-slate-800">
          <div className="text-cyan-400 font-bold flex items-center space-x-1 pb-1 mb-1 border-b border-slate-800">
            <Code2 className="w-3.5 h-3.5" />
            <span>JavaScript Control Structure Implementation:</span>
          </div>
          <div><span className="text-rose-400 font-bold">function</span> <span className="text-emerald-300">validateOperative</span>(email) &#123;</div>
          <div className="pl-4"><span className="text-rose-400 font-bold">if</span> (!email.<span className="text-cyan-300 font-bold">endsWith</span>(<span className="text-amber-300">&apos;@gmail.com&apos;</span>)) &#123;</div>
          <div className="pl-8"><span className="text-rose-400 font-bold">throw new</span> <span className="text-emerald-300">Error</span>(<span className="text-amber-300">&apos;Access Denied: Only @gmail.com authorized&apos;</span>);</div>
          <div className="pl-4">&#125;</div>
          <div className="pl-4"><span className="text-rose-400 font-bold">return</span> <span className="text-emerald-400 font-bold">true</span>;</div>
          <div>&#125;</div>
        </div>
      </div>
    </div>
  );
};
