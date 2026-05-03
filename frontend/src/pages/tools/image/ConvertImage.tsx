import { useState } from 'react';
import ToolBase from '../../../components/ToolBase';
import { RefreshCw } from 'lucide-react';

const ConvertImage = () => {
  const [targetFormat, setTargetFormat] = useState('png');

  const formats = ['png', 'jpg', 'webp'];

  const options = (
    <div className="space-y-4">
      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Target Format</label>
      <div className="flex gap-2">
        {formats.map(fmt => (
          <button
            key={fmt}
            onClick={() => setTargetFormat(fmt)}
            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              targetFormat === fmt ? 'bg-primary text-primary-foreground' : 'bg-white/5 text-muted-foreground hover:bg-white/10'
            }`}
          >
            {fmt}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <ToolBase
      title="Convert Image"
      description="Quickly convert your images between popular formats like JPG, PNG, and WebP."
      icon={RefreshCw}
      accept="image/*"
      multiple={false}
      endpoint="/api/image/convert"
      options={options}
      getExtraData={() => ({ targetFormat })}
      resultFilename={`converted_image.${targetFormat}`}
    />
  );
};

export default ConvertImage;
