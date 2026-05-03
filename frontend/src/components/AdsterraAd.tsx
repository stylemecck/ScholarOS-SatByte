import React, { useEffect, useRef } from 'react';

interface AdsterraAdProps {
  type: 'native' | 'social' | 'popunder' | 'smartlink';
  code: string;
}

const AdsterraAd: React.FC<AdsterraAdProps> = ({ type, code }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!code || !containerRef.current) return;

    // Clear previous ad if any
    containerRef.current.innerHTML = '';

    if (type === 'native') {
      const range = document.createRange();
      const fragment = range.createContextualFragment(code);
      containerRef.current.appendChild(fragment);
    }
  }, [code, type]);

  if (type === 'smartlink') {
    // For smartlink, we just render a link or button if needed, 
    // but usually smartlinks are used as hrefs.
    // However, if the user provides a script for it, we handle it like native.
    return (
        <div ref={containerRef} className="adsterra-smartlink" />
    );
  }

  if (type === 'native') {
    return (
      <div className="w-full flex justify-center py-4">
        <div ref={containerRef} className="adsterra-native-banner min-h-[100px] w-full max-w-[728px] bg-white/5 border border-dashed border-white/10 rounded-2xl overflow-hidden flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">
          Advertisement
        </div>
      </div>
    );
  }

  return null;
};

export default AdsterraAd;
