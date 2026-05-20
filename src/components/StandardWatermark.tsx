import React from 'react';

export const StandardWatermark: React.FC = () => {
  return (
    <div className="mt-12 pt-6 border-t border-inherit opacity-70 text-center flex flex-col items-center justify-center font-casual">
      <p className="text-sm tracking-wide mb-1">
        Online Markdown Viewer · Created by ChenYY 🌀
      </p>
      <p className="text-xs opacity-70">
        More tools: <a href="https://navigation.chenyy.cc" target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-500">navigation.chenyy.cc</a>
      </p>
    </div>
  );
};
