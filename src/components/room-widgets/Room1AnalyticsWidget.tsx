import React, { useState } from 'react';
import { BarChart3, ShieldCheck, Eye, Users, Clock, ArrowUpRight } from 'lucide-react';
import { sound } from '../../utils/sound';

interface Props {
  onSuggestPlatform?: (name: string) => void;
}

export const Room1AnalyticsWidget: React.FC<Props> = ({ onSuggestPlatform }) => {
  const [selectedTool, setSelectedTool] = useState<'matomo' | 'plausible' | 'countly' | 'awstats' | 'owa'>('matomo');

  const tools = [
    {
      id: 'matomo',
      name: 'Matomo',
      formerName: 'Formerly Piwik',
      badge: '100% Data Ownership',
      desc: 'Leading self-hosted, open-source analytics platform. Fully GDPR/CCPA compliant with server-side telemetry control.',
      scriptSize: '22 KB',
      cookies: 'Optional',
      license: 'GPL v3 (Open Source)'
    },
    {
      id: 'plausible',
      name: 'Plausible',
      formerName: 'Plausible Analytics',
      badge: 'Lightweight & Cookie-Free',
      desc: 'Minimalist open-source analytics with a script under 1 KB. 100% cookie-free with zero personal data collection.',
      scriptSize: '< 1 KB',
      cookies: 'None (No banner needed)',
      license: 'AGPL v3'
    },
    {
      id: 'countly',
      name: 'Countly',
      formerName: 'Countly Analytics',
      badge: 'Enterprise Product Telemetry',
      desc: 'Open-source product analytics for web, desktop, and mobile with event tracking, push notifications, and crash analytics.',
      scriptSize: '18 KB',
      cookies: 'Configurable',
      license: 'Community Edition'
    },
    {
      id: 'awstats',
      name: 'AWStats',
      formerName: 'Advanced Web Statistics',
      badge: 'Server Log File Analyzer',
      desc: 'Classic Perl-based log file analyzer that parses Apache, Nginx, and IIS access logs without client-side JavaScript.',
      scriptSize: '0 KB (Server Log Only)',
      cookies: 'None',
      license: 'GPL v3'
    },
    {
      id: 'owa',
      name: 'Open Web Analytics',
      formerName: 'OWA Framework',
      badge: 'PHP Web Analytics Framework',
      desc: 'WordPress-friendly open-source software with heatmap generation, mouse tracking, and DOM click telemetry.',
      scriptSize: '15 KB',
      cookies: 'Supported',
      license: 'GPL v2'
    }
  ];

  const currentToolData = tools.find((t) => t.id === selectedTool)!;

  return (
    <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 bg-white/95 dark:bg-[#060c1d] space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cyan-500/20 pb-3">
        <div className="flex items-center space-x-2 text-cyan-700 dark:text-cyan-300 font-orbitron font-bold text-xs uppercase tracking-wider">
          <BarChart3 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <span>Experiment 1: Open Source Web Analytics Telemetry Matrix</span>
        </div>
        <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>PRIVACY_VERIFIED // 5 PLATFORMS</span>
        </span>
      </div>

      {/* 5 Open Source Tools Switcher Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 font-mono text-xs">
        {tools.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              sound.playClick();
              setSelectedTool(t.id as any);
              if (onSuggestPlatform) onSuggestPlatform(t.name);
            }}
            className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
              selectedTool === t.id
                ? 'bg-cyan-100 dark:bg-cyan-950/80 border-cyan-500 text-cyan-900 dark:text-cyan-200 font-bold shadow-xs'
                : 'bg-slate-100 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:border-cyan-400/50'
            }`}
          >
            <div className="font-orbitron font-bold text-xs truncate">{t.name}</div>
            <div className="text-[9px] text-slate-500 dark:text-slate-400 truncate">{t.formerName}</div>
          </button>
        ))}
      </div>

      {/* Selected Platform Metrics & Telemetry Card */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#02050f] border border-cyan-500/30 space-y-3 font-mono text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          <div>
            <span className="font-orbitron font-extrabold text-sm text-slate-900 dark:text-white uppercase mr-2">
              {currentToolData.name}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border border-cyan-500/40">
              {currentToolData.badge}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">License: {currentToolData.license}</span>
        </div>

        <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
          {currentToolData.desc}
        </p>

        {/* Live Metrics Grid Simulation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
          <div className="p-2 rounded bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
            <span className="text-[9px] text-slate-500 dark:text-slate-400 block uppercase">Daily Pageviews</span>
            <span className="font-orbitron font-bold text-sm text-cyan-700 dark:text-cyan-300 flex items-center justify-center space-x-1">
              <Eye className="w-3 h-3" />
              <span>18,452</span>
            </span>
          </div>
          <div className="p-2 rounded bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
            <span className="text-[9px] text-slate-500 dark:text-slate-400 block uppercase">Unique Operatives</span>
            <span className="font-orbitron font-bold text-sm text-emerald-700 dark:text-emerald-400 flex items-center justify-center space-x-1">
              <Users className="w-3 h-3" />
              <span>4,120</span>
            </span>
          </div>
          <div className="p-2 rounded bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
            <span className="text-[9px] text-slate-500 dark:text-slate-400 block uppercase">Script Payload</span>
            <span className="font-orbitron font-bold text-sm text-amber-700 dark:text-amber-400 flex items-center justify-center space-x-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>{currentToolData.scriptSize}</span>
            </span>
          </div>
          <div className="p-2 rounded bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
            <span className="text-[9px] text-slate-500 dark:text-slate-400 block uppercase">Cookie Protocol</span>
            <span className="font-orbitron font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center justify-center space-x-1">
              <Clock className="w-3 h-3" />
              <span className="text-[11px] truncate">{currentToolData.cookies}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
