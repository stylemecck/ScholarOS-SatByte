import { useState } from 'react';
import ToolBase from '../../../components/ToolBase';
import { Image as ImageIcon } from 'lucide-react';

const CompressImage = () => {
  const [quality, setQuality] = useState(80);
  const [targetSize, setTargetSize] = useState<string>('');

  const options = (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Quality Level</label>
          <span className="text-xs font-black text-primary bg-primary/10 px-3 py-1 rounded-full">{quality}%</span>
        </div>
        <input 
          type="range" 
          min="1" 
          max="100" 
          value={quality} 
          onChange={(e) => setQuality(parseInt(e.target.value))}
          className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-primary"
        />
      </div>

      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Target Size (KB) - Optional</label>
        <div className="relative">
            <input 
            type="number" 
            placeholder="e.g. 200"
            value={targetSize}
            onChange={(e) => setTargetSize(e.target.value)}
            className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-muted-foreground/40">KB</div>
        </div>
        <p className="text-[10px] text-muted-foreground leading-relaxed italic opacity-60">
          Note: We will attempt to reach this size by auto-adjusting quality.
        </p>
      </div>
    </div>
  );

  return (
    <ToolBase
      title="Compress Image"
      description="Reduce image file size while maintaining the best visual quality for web and social media."
      icon={ImageIcon}
      accept="image/*"
      multiple={false}
      endpoint="/api/image/compress"
      options={options}
      getExtraData={() => ({ quality, targetSize })}
      resultFilename="compressed_image.jpg"
    />
  );
};

export default CompressImage;
