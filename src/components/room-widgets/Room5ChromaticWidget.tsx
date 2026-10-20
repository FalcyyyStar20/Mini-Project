import React, { useState } from 'react';
import { Folder, FileCode, HardDrive, HelpCircle, Binary } from 'lucide-react';
import { sound } from '../../utils/sound';

interface Props {
  onSelectColor?: (val: string) => void;
}

export const Room5ChromaticWidget: React.FC<Props> = () => {
  const [selectedFile, setSelectedFile] = useState<string>('app');
  const [showArchInfo, setShowArchInfo] = useState<boolean>(false);

  const fileExamples = [
    { name: 'document.txt', type: 'Plaintext Document', ext: '.txt', magic: 'ASCII text' },
    { name: 'kernel_driver.dll', type: 'Dynamic Link Library', ext: '.dll', magic: 'PE32+ Library' },
    { name: 'backup_script.bat', type: 'Batch Command Script', ext: '.bat', magic: 'DOS Batch' },
    { name: 'secure_binary.___', type: 'Windows Executable Binary', ext: '.___', magic: 'PE / MZ Header', highlight: true }
  ];

  return (
    <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 bg-white/95 dark:bg-[#060c1d] space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cyan-500/20 pb-3">
        <div className="flex items-center space-x-2 text-cyan-700 dark:text-cyan-300 font-orbitron font-bold text-xs uppercase tracking-wider">
          <Folder className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <span>Windows File System &amp; Binary Architecture Explorer</span>
        </div>
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            setShowArchInfo(!showArchInfo);
          }}
          className="text-[11px] font-mono text-cyan-700 hover:text-cyan-800 dark:text-cyan-400 dark:hover:text-cyan-300 flex items-center space-x-1 cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{showArchInfo ? 'Hide OS Architecture' : 'View OS Architecture'}</span>
        </button>
      </div>

      {/* Explorer Directory Mock */}
      <div className="space-y-3 font-mono text-xs">
        <div className="text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider flex items-center space-x-1.5">
          <HardDrive className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          <span>Directory Path: C:\Windows\System32\Programs\</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {fileExamples.map((file, idx) => (
            <div
              key={idx}
              onClick={() => {
                sound.playClick();
                setSelectedFile(file.name);
              }}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                file.highlight
                  ? 'bg-amber-100 dark:bg-amber-950/40 border-amber-500 dark:border-amber-500/60 text-amber-900 dark:text-amber-200 glow-amber-sm'
                  : selectedFile === file.name
                  ? 'bg-cyan-100 dark:bg-cyan-950/60 border-cyan-500 dark:border-cyan-400 text-cyan-950 dark:text-cyan-200'
                  : 'bg-slate-100 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <FileCode className={`w-4 h-4 ${file.highlight ? 'text-amber-600 dark:text-amber-400' : 'text-cyan-600 dark:text-cyan-400'}`} />
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 text-xs">{file.name}</div>
                  <div className="text-[10px] text-slate-500">{file.type}</div>
                </div>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                file.highlight
                  ? 'bg-amber-200 dark:bg-amber-900/80 text-amber-900 dark:text-amber-300 border border-amber-500/50'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400'
              }`}>
                {file.ext}
              </span>
            </div>
          ))}
        </div>

        {/* Binary Header Inspector */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#02050f] border border-cyan-500/30 flex items-start space-x-3 text-[11px]">
          <Binary className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="text-emerald-700 dark:text-emerald-400 font-bold block uppercase tracking-wider">
              Executable Binary Structure (PE / MZ Standard):
            </span>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              In Windows systems, native compiled programs begin with the <code className="text-cyan-700 dark:text-cyan-300 font-bold">MZ</code> magic header bytes. The operating system shell identifies and executes these binaries via a standard 3-letter file extension.
            </p>
          </div>
        </div>
      </div>

      {/* OS Architecture Info Drawer */}
      {showArchInfo && (
        <div className="p-4 rounded-xl bg-slate-100 dark:bg-[#02040b] border border-cyan-500/30 font-mono text-xs space-y-2 animate-fadeIn">
          <div className="text-cyan-700 dark:text-cyan-400 font-bold uppercase tracking-wider text-[11px]">
            Academic Subject: Operating Systems File Formats
          </div>
          <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
            Windows distinguishes binary executables from scripts or text files through file associations and the Portable Executable (PE) specification. What 3-letter extension represents these executable binaries? Type your answer below!
          </p>
        </div>
      )}
    </div>
  );
};
