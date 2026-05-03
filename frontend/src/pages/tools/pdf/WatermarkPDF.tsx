import { useState } from 'react';
import ToolBase from '../../../components/ToolBase';
import { ShieldCheck } from 'lucide-react';

const WatermarkPDF = () => {
  const [text, setText] = useState('Student Toolkit Pro');
  const [opacity, setOpacity] = useState(0.3);

  const options = (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Watermark Text</label>
        <input 
          type="text" 
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          placeholder="e.g. CONFIDENTIAL"
        />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Opacity</label>
            <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-1 rounded-md">{(opacity * 100).toFixed(0)}%</span>
        </div>
        <input 
          type="range" 
          min="0.1" 
          max="1" 
          step="0.1"
          value={opacity} 
          onChange={(e) => setOpacity(parseFloat(e.target.value))}
          className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-primary"
        />
      </div>
    </div>
  );

  return (
    <ToolBase
      title="Add Watermark"
      description="Add a professional text watermark to your PDF pages to protect your work from unauthorized use."
      icon={ShieldCheck}
      accept=".pdf"
      multiple={false}
      endpoint="/api/pdf/watermark"
      options={options}
      getExtraData={() => ({ text, opacity })}
      resultFilename="watermarked_document.pdf"
    />
  );
};

export default WatermarkPDF;
