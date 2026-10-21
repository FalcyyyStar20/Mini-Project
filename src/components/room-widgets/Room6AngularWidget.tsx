import React, { useState } from 'react';
import { Layers, RefreshCw, Zap } from 'lucide-react';
import { sound } from '../../utils/sound';

export const Room6AngularWidget: React.FC = () => {
  const [modelValue, setModelValue] = useState('Cyber Infiltrator');

  return (
    <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 bg-white/95 dark:bg-[#060c1d] space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cyan-500/20 pb-3">
        <div className="flex items-center space-x-2 text-cyan-700 dark:text-cyan-300 font-orbitron font-bold text-xs uppercase tracking-wider">
          <Layers className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <span>Experiment 6: AngularJS MVVM Two-Way Binding &amp; Expressions Sandbox</span>
        </div>
        <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>2-WAY DATA BINDING // $SCOPE</span>
        </span>
      </div>

      {/* AngularJS Template Mock (<div ng-app ng-controller>) */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#02050f] border border-cyan-500/30 font-mono text-xs space-y-3">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px] border-b border-slate-200 dark:border-slate-800 pb-2">
          <span>&lt;div <strong className="text-cyan-600 dark:text-cyan-400">ng-app</strong>=&quot;EscapeLabApp&quot; <strong className="text-cyan-600 dark:text-cyan-400">ng-controller</strong>=&quot;Room6Ctrl&quot;&gt;</span>
          <span className="text-amber-600 dark:text-amber-400">ANGULARJS_1.X_SYNTAX</span>
        </div>

        {/* Input field with ng-model */}
        <div className="space-y-1.5">
          <label className="block text-slate-700 dark:text-slate-300 font-semibold text-[11px] uppercase">
            &lt;input type=&quot;text&quot; <span className="text-emerald-600 dark:text-emerald-400 font-bold">ng-model</span>=&quot;operativeTitle&quot; /&gt;
          </label>
          <div className="relative">
            <input
              type="text"
              value={modelValue}
              onChange={(e) => {
                setModelValue(e.target.value);
                sound.playKeypress();
              }}
              placeholder="Type to see real-time two-way data binding in expressions..."
              className="w-full px-3 py-2.5 rounded-lg border border-cyan-500/40 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-mono text-xs focus:ring-1 focus:ring-cyan-400 outline-none shadow-inner"
            />
          </div>
          <span className="text-[10px] text-slate-500">
            Directive: <code className="text-cyan-600 dark:text-cyan-400 font-bold">ng-model</code> updates $scope.operativeTitle synchronously.
          </span>
        </div>

        {/* Live Dynamic Expression Evaluation ({{ ... }}) */}
        <div className="p-3.5 rounded-lg bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="text-[10px] text-cyan-700 dark:text-cyan-400 font-bold uppercase tracking-wider flex items-center space-x-1">
            <Zap className="w-3 h-3 text-amber-500" />
            <span>Real-Time Evaluated Template Expressions &#123;&#123; ... &#125;&#125;:</span>
          </div>

          <div className="space-y-1 text-slate-800 dark:text-slate-200 text-xs">
            <div className="flex items-center space-x-2">
              <span className="text-slate-500 text-[10px]">&#123;&#123; operativeTitle &#125;&#125; =&gt;</span>
              <span className="font-bold text-cyan-700 dark:text-cyan-300">{modelValue || '(empty)'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-slate-500 text-[10px]">&#123;&#123; operativeTitle | uppercase &#125;&#125; =&gt;</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase">{modelValue || '(empty)'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-slate-500 text-[10px]">&#123;&#123; 7 * 6 &#125;&#125; =&gt;</span>
              <span className="font-bold text-amber-600 dark:text-amber-300">42 (Evaluated Expression)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
