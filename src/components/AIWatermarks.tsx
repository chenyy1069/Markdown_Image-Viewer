import React from 'react';
import { Bot, Sparkles, Cpu, CpuIcon } from 'lucide-react';

interface AIWatermarksProps {
  visible: boolean;
}

export const AIWatermarks: React.FC<AIWatermarksProps> = ({ visible }) => {
  if (!visible) return null;

  return (
    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-40 mix-blend-multiply dark:mix-blend-screen pointer-events-none z-10 select-none">
      <div className="flex items-center space-x-1.5 bg-white/60 dark:bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
        <Sparkles size={12} className="text-purple-500" />
        <span className="font-mono text-[10px] font-semibold text-gray-600 dark:text-gray-300 tracking-wider">GPT-4</span>
      </div>
      <div className="flex items-center space-x-1.5 bg-white/60 dark:bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
        <Bot size={12} className="text-blue-500" />
        <span className="font-mono text-[10px] font-semibold text-gray-600 dark:text-gray-300 tracking-wider">GEMINI</span>
      </div>
      <div className="flex items-center space-x-1.5 bg-white/60 dark:bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
        <Cpu size={12} className="text-orange-500" />
        <span className="font-mono text-[10px] font-semibold text-gray-600 dark:text-gray-300 tracking-wider">CLAUDE</span>
      </div>
      <div className="flex items-center space-x-1.5 bg-white/60 dark:bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
        <CpuIcon size={12} className="text-black dark:text-white" />
        <span className="font-mono text-[10px] font-semibold text-gray-600 dark:text-gray-300 tracking-wider">GROK</span>
      </div>
    </div>
  );
};
