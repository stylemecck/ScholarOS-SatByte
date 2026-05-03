import { useState } from 'react';
import ToolBase from '../../../components/ToolBase';
import { Maximize } from 'lucide-react';

const ResizeImage = () => {
  const [width, setWidth] = useState<string>('');
  const [height, setHeight] = useState<string>('');

  const options = (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Width (px)</label>
          <div className="relative">
            <input 
              type="number" 
              placeholder="Auto"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-muted-foreground/20">PX</div>
          </div>
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Height (px)</label>
          <div className="relative">
            <input 
              type="number" 
              placeholder="Auto"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-muted-foreground/20">PX</div>
          </div>
        </div>
      </div>
      <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl">
        <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">
          <span className="text-primary font-black">Pro Tip:</span> Leave one field empty to maintain the original aspect ratio automatically.
        </p>
      </div>
    </div>
  );

  return (
    <ToolBase
      title="Resize Image"
      description="Change the dimensions of your images by defining custom width and height in pixels."
      icon={Maximize}
      accept="image/*"
      multiple={false}
      endpoint="/api/image/resize"
      options={options}
      getExtraData={() => ({ width, height })}
      resultFilename="resized_image.jpg"
    />
  );
};

export default ResizeImage;
