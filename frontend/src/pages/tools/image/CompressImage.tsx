import { useState } from 'react';
import ToolBase from '../../../components/ToolBase';
import { Image as ImageIcon } from 'lucide-react';

const CompressImage = () => {
  const [quality, setQuality] = useState(70);

  const options = (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="text-sm font-bold">Quality</label>
        <span className="text-xs font-black text-primary bg-primary/10 px-2 py-1 rounded-md">{quality}%</span>
      </div>
      <input 
        type="range" 
        min="10" 
        max="100" 
        value={quality} 
        onChange={(e) => setQuality(parseInt(e.target.value))}
        className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-primary"
      />
      <p className="text-[10px] text-muted-foreground italic">
        Lower quality results in smaller file sizes but reduced clarity.
      </p>
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
      getExtraData={() => ({ quality })}
      resultFilename="compressed_image.jpg"
    />
  );
};

export default CompressImage;
