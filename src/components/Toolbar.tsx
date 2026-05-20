import React from 'react';
import { Download, Monitor, Sun, Moon } from 'lucide-react';
import { Language, i18n } from '../lib/i18n';

interface ToolbarProps {
  lang: Language;
  setLang: (l: Language) => void;
  siteMode: 'light' | 'dark';
  setSiteMode: (mode: 'light' | 'dark') => void;
  onExportPNG: () => void;
  isExporting: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  lang,
  setLang,
  siteMode,
  setSiteMode,
  onExportPNG,
  isExporting
}) => {
  const t = i18n[lang];

  return (
    <header className="grid grid-cols-1 md:grid-cols-12 gap-4 md:h-16 shrink-0">
      <div className="md:col-span-4 flex items-center px-2 py-3 md:py-0 relative overflow-hidden shrink-0">
        <span className="font-extrabold tracking-tight text-lg sm:text-xl z-10 truncate leading-none bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent py-1">Markdown Viewer by ChenYY</span>
        <span className="text-base sm:text-lg ml-1 leading-none shrink-0">🌀</span>
      </div>
      
      <div className="md:col-span-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-between px-4 sm:px-6 py-3 md:py-0 shadow-sm overflow-x-auto transition-colors">
        <div className="flex items-center gap-4 whitespace-nowrap">
          <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-lg shrink-0">
            <button 
              onClick={() => setLang('en')}
              className={`px-3 py-1 rounded-md text-sm font-semibold transition-shadow ${lang === 'en' ? 'bg-white dark:bg-slate-600 shadow-sm dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
            >
              EN
            </button>
            <button 
              onClick={() => setLang('zh')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-shadow ${lang === 'zh' ? 'bg-white dark:bg-slate-600 shadow-sm dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
            >
              简
            </button>
          </div>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 shrink-0"></div>
          
          <button 
            onClick={() => setSiteMode(siteMode === 'light' ? 'dark' : 'light')}
            className="flex items-center gap-2 cursor-pointer shrink-0 outline-none text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
            title="Toggle Dark Mode"
          >
            {siteMode === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </div>

      <button 
        onClick={onExportPNG}
        disabled={isExporting}
        className="md:col-span-3 bg-blue-600 hover:bg-blue-700 transition-colors rounded-2xl flex items-center justify-center p-4 md:p-0 shadow-lg shadow-blue-200/50 dark:shadow-none cursor-pointer disabled:opacity-80 group active:scale-[0.98] duration-200 shrink-0"
      >
        {isExporting ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        ) : (
          <>
            <span className="text-white font-bold">{t.exportPng}</span>
            <Download className="w-5 h-5 ml-2 text-white/90 group-hover:translate-y-0.5 transition-transform" />
          </>
        )}
      </button>
    </header>
  );
};

