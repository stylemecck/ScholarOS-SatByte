import React, { useEffect, useRef } from 'react';
import { useAuth } from '../context/useAuth';

interface AdsterraAdProps {
  type: 'native' | 'social' | 'popunder' | 'smartlink';
  code: string;
}

const AdsterraAd: React.FC<AdsterraAdProps> = ({ type, code }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!code || !containerRef.current || user?.role === 'admin') return;

    // Clear previous ad if any
    containerRef.current.innerHTML = '';

    if (type === 'native') {
      const range = document.createRange();
      const fragment = range.createContextualFragment(code);
      containerRef.current.appendChild(fragment);
    }
  }, [code, type, user]);

  if (user?.role === 'admin') return null;

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
      <div className="w-full flex flex-col items-center gap-3 py-6 px-4 bg-muted/20 border border-dashed border-border/40 rounded-3xl relative overflow-hidden my-4 shadow-sm">
        <div className="flex items-center justify-between w-full opacity-60 text-[8px] font-black uppercase tracking-[0.25em] text-muted-foreground px-2">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" /> Sponsored Delivery
          </span>
          <span className="text-[7px] border border-border/40 px-1.5 py-0.5 rounded font-black tracking-widest bg-foreground/[0.02]">ADSTERRA</span>
        </div>
        <div 
          ref={containerRef} 
          className="adsterra-native-banner w-full flex items-center justify-center min-h-[90px] bg-foreground/[0.02] rounded-2xl p-3 border border-border/20" 
        />
      </div>
    );
  }

  return null;
};

export default AdsterraAd;
