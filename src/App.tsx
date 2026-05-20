import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import * as htmlToImage from 'html-to-image';
import { Toolbar } from './components/Toolbar';
import { StandardWatermark } from './components/StandardWatermark';
import { Language, i18n } from './lib/i18n';
import { Monitor, Smartphone, LayoutTemplate } from 'lucide-react';

type FontStyle = 'casual' | 'handwritten' | 'formal';
type PreviewColor = 'light' | 'dark';
type LayoutWidth = 'auto' | 'mobile' | 'desktop';

const containerWidthMap = {
  'auto': 'w-full max-w-4xl',
  'mobile': 'w-[375px] mx-auto',
  'desktop': 'w-[800px] mx-auto'
};

export default function App() {
  const [markdown, setMarkdown] = useState(i18n.en.defaultMarkdown);
  const [lang, setLang] = useState<Language>('en');
  
  // App States
  const [siteMode, setSiteMode] = useState<'light'|'dark'>('light');
  const [fontStyle, setFontStyle] = useState<FontStyle>('casual');
  const [previewColor, setPreviewColor] = useState<PreviewColor>('light');
  const [layoutWidth, setLayoutWidth] = useState<LayoutWidth>('auto');
  
  const [isExporting, setIsExporting] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  
  const previewRef = useRef<HTMLDivElement>(null);
  const t = i18n[lang];

  useEffect(() => {
    if (markdown === i18n.en.defaultMarkdown && lang === 'zh') {
      setMarkdown(i18n.zh.defaultMarkdown);
    } else if (markdown === i18n.zh.defaultMarkdown && lang === 'en') {
      setMarkdown(i18n.en.defaultMarkdown);
    }
  }, [lang]);

  useEffect(() => {
    if (siteMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [siteMode]);

  const handleExport = useCallback(async (format: 'png' | 'jpeg') => {
    if (!previewRef.current) return;
    setIsExporting(true);
    
    try {
      const element = previewRef.current;
      
      const config = {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: previewColor === 'dark' ? '#0d1117' : '#ffffff',
        useCORS: true,
        allowTaint: true,
        style: {
          padding: '0',
          margin: '0',
          borderRadius: '0',
          boxShadow: 'none',
          height: 'auto',
          minHeight: '100%',
          transform: 'none'
        },
      };

      let dataUrl;
      if (format === 'png') {
        dataUrl = await htmlToImage.toPng(element, config);
      } else {
        dataUrl = await htmlToImage.toJpeg(element, config);
      }
      
      const link = document.createElement('a');
      link.download = `markdown-export-${new Date().getTime()}.${format}`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export image', err);
      alert('Failed to export image. See console for details.');
    } finally {
      setIsExporting(false);
    }
  }, [previewColor]);

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && (file.name.endsWith('.md') || file.name.endsWith('.txt'))) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setMarkdown(event.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(markdown);
  };

  return (
    <div 
      className="w-full h-full min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 font-sans p-4 sm:p-6 flex flex-col gap-4 overflow-hidden absolute inset-0 text-left transition-colors duration-200"
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <Toolbar
        lang={lang}
        setLang={setLang}
        siteMode={siteMode}
        setSiteMode={setSiteMode}
        onExportPNG={() => handleExport('png')}
        isExporting={isExporting}
      />

      <main className="flex-1 flex flex-col lg:grid lg:grid-cols-12 gap-4 lg:min-h-0 overflow-y-auto lg:overflow-hidden relative pb-12 lg:pb-0">
        
        {/* Editor Card */}
        <div className={`lg:col-span-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl flex-col shadow-sm shrink-0 lg:shrink max-h-none lg:max-h-full min-h-[50vh] lg:min-h-0 transition-colors ${showMobilePreview ? 'hidden lg:flex' : 'flex'}`}>
          <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between shrink-0 rounded-t-3xl">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t.editor}</span>
            <div className="flex gap-2 items-center">
              <label className="cursor-pointer text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition">
                {t.uploadMd}
                <input type="file" accept=".md,.txt" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    if (ev.target?.result) setMarkdown(ev.target.result as string);
                  };
                  reader.readAsText(file);
                  e.target.value = '';
                }} />
              </label>
              <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
              <button onClick={copyToClipboard} className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition">
                {t.copyMd}
              </button>
            </div>
          </div>
          <textarea
            className="flex-1 w-full p-6 resize-none focus:outline-none bg-transparent text-slate-600 dark:text-slate-300 font-mono text-sm leading-relaxed overflow-auto"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            spellCheck={false}
            placeholder={t.dragDrop}
          />
          <div className="lg:hidden p-4 border-t border-slate-100 dark:border-slate-700 shrink-0">
            <button onClick={() => setShowMobilePreview(true)} className="w-full bg-blue-600 text-white hover:bg-blue-700 py-3 rounded-xl font-bold transition-colors">
              Preview Result
            </button>
          </div>
        </div>

        {/* Preview Container */}
        <div className={`lg:col-span-7 flex-col gap-4 min-h-0 ${showMobilePreview ? 'flex absolute lg:static inset-0 z-50 bg-slate-50 dark:bg-slate-900 lg:bg-transparent overflow-y-auto lg:overflow-hidden pb-20 lg:pb-0' : 'hidden lg:flex'}`}>
          
          {/* Mobile Preview Header */}
          {showMobilePreview && (
            <div className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shrink-0 sticky top-0 z-10 shadow-sm">
              <button onClick={() => setShowMobilePreview(false)} className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-bold text-sm transition-colors py-2 px-1">
                ← Back
              </button>
              <button onClick={() => handleExport('png')} className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                {isExporting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : null}
                Export
              </button>
            </div>
          )}

          {/* Rendered View */}
          <div className={`flex-1 bg-white dark:bg-slate-800 border-0 lg:border border-slate-200 dark:border-slate-700 rounded-none lg:rounded-3xl shadow-none lg:shadow-sm relative overflow-hidden flex flex-col transition-colors ${showMobilePreview ? 'min-h-[60vh] shrink-0' : ''}`}>
            <div className="flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar relative bg-slate-100/50 dark:bg-slate-900/50 lg:bg-transparent lg:dark:bg-transparent">
               <div className="p-4 sm:p-4 lg:p-8 min-h-full flex justify-center items-start">
                 <div 
                   ref={previewRef} 
                   className={`shrink-0 border-0 lg:border dark:border-slate-700/50 lg:shadow-md ${containerWidthMap[layoutWidth]} min-h-full font-${fontStyle} color-${previewColor} overflow-hidden bg-white dark:bg-[#0d1117] transition-colors`}
                 >
                    <div className="markdown-body p-6 sm:p-8 lg:p-12 w-full min-h-full flex flex-col">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeKatex, rehypeHighlight]}
                      >
                        {markdown}
                      </ReactMarkdown>
                      <div className="mt-auto pt-8">
                        <StandardWatermark />
                      </div>
                    </div>
                 </div>
               </div>
            </div>
          </div>

          {/* Control Strip (Bento Style) - Desktop Only */}
          <div className="hidden lg:grid h-24 grid-cols-1 sm:grid-cols-3 gap-4 shrink-0">
            {/* Fonts */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex flex-col justify-center shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase mb-2">Font Typography</span>
              <div className="flex gap-2 w-full">
                 <button onClick={() => setFontStyle('casual')} className={`flex-1 py-1 rounded-md text-xs font-semibold transition-all ${fontStyle === 'casual' ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-600' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}>Casual</button>
                 <button onClick={() => setFontStyle('handwritten')} className={`flex-1 py-1 rounded-md text-xs font-semibold transition-all ${fontStyle === 'handwritten' ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-600' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}>Hand</button>
                 <button onClick={() => setFontStyle('formal')} className={`flex-1 py-1 rounded-md text-xs font-semibold transition-all ${fontStyle === 'formal' ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-600' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}>Formal</button>
              </div>
            </div>
            
            {/* Dimensions */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex flex-col justify-center shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase mb-2">Export Layout Width</span>
              <div className="flex gap-2">
                 <button onClick={() => setLayoutWidth('auto')} className={`flex-1 flex flex-col items-center justify-center p-1.5 rounded transition-all text-xs font-semibold ${layoutWidth === 'auto' ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`} title="Auto width"><LayoutTemplate size={16} className="mb-1" /><span>Auto</span></button>
                 <button onClick={() => setLayoutWidth('mobile')} className={`flex-1 flex flex-col items-center justify-center p-1.5 rounded transition-all text-xs font-semibold ${layoutWidth === 'mobile' ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`} title="Mobile width"><Smartphone size={16} className="mb-1" /><span>Phone</span></button>
                 <button onClick={() => setLayoutWidth('desktop')} className={`flex-1 flex flex-col items-center justify-center p-1.5 rounded transition-all text-xs font-semibold ${layoutWidth === 'desktop' ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`} title="Desktop width"><Monitor size={16} className="mb-1" /><span>PC</span></button>
              </div>
            </div>

            {/* Preview Color */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex flex-col justify-center shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase mb-2">Preview Contrast</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setPreviewColor('light')} className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${previewColor === 'light' ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-600' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}>White Paper</button>
                <button onClick={() => setPreviewColor('dark')} className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${previewColor === 'dark' ? 'bg-gray-900 text-white shadow-sm ring-1 ring-gray-900' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}>Dark Canvas</button>
              </div>
            </div>
          </div>
        </div>

        {/* Control Strip (Bento Style) - Mobile Only */}
        <div className={`lg:hidden h-auto grid-cols-1 sm:grid-cols-3 gap-4 shrink-0 transition-opacity ${showMobilePreview ? 'hidden' : 'grid'}`}>
          {/* Fonts */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex flex-col justify-center shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase mb-2">Font Typography</span>
            <div className="flex gap-2 w-full">
               <button onClick={() => setFontStyle('casual')} className={`flex-1 py-2 rounded-md text-xs font-semibold transition-all ${fontStyle === 'casual' ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-600' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}>Casual</button>
               <button onClick={() => setFontStyle('handwritten')} className={`flex-1 py-2 rounded-md text-xs font-semibold transition-all ${fontStyle === 'handwritten' ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-600' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}>Hand</button>
               <button onClick={() => setFontStyle('formal')} className={`flex-1 py-2 rounded-md text-xs font-semibold transition-all ${fontStyle === 'formal' ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-600' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}>Formal</button>
            </div>
          </div>
          
          {/* Dimensions */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex flex-col justify-center shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase mb-2">Export Layout Width</span>
            <div className="flex gap-2">
               <button onClick={() => setLayoutWidth('auto')} className={`flex-1 flex flex-col items-center justify-center p-2 rounded transition-all text-xs font-semibold ${layoutWidth === 'auto' ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`} title="Auto width"><LayoutTemplate size={20} className="mb-1" /><span>Auto</span></button>
               <button onClick={() => setLayoutWidth('mobile')} className={`flex-1 flex flex-col items-center justify-center p-2 rounded transition-all text-xs font-semibold ${layoutWidth === 'mobile' ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`} title="Mobile width"><Smartphone size={20} className="mb-1" /><span>Phone</span></button>
               <button onClick={() => setLayoutWidth('desktop')} className={`flex-1 flex flex-col items-center justify-center p-2 rounded transition-all text-xs font-semibold ${layoutWidth === 'desktop' ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`} title="Desktop width"><Monitor size={20} className="mb-1" /><span>PC</span></button>
            </div>
          </div>

          {/* Preview Color */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex flex-col justify-center shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase mb-2">Preview Contrast</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setPreviewColor('light')} className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${previewColor === 'light' ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-600' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}>White Paper</button>
              <button onClick={() => setPreviewColor('dark')} className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${previewColor === 'dark' ? 'bg-gray-900 text-white shadow-sm ring-1 ring-gray-900' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}>Dark Canvas</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
