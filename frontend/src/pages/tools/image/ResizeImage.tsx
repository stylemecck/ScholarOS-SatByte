import { useState } from 'react';
import ToolBase from '../../../components/ToolBase';
import { Maximize } from 'lucide-react';

const ResizeImage = () => {
  const [width, setWidth] = useState<string>('');
  const [height, setHeight] = useState<string>('');

  const options = (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Width (px)</label>
        <input 
          type="number" 
          placeholder="Auto"
          value={width}
          onChange={(e) => setWidth(e.target.value)}
          className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all"
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Height (px)</label>
        <input 
          type="number" 
          placeholder="Auto"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all"
        />
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
