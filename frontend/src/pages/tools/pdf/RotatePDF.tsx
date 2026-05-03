import { useState } from 'react';
import ToolBase from '../../../components/ToolBase';
import { RefreshCw } from 'lucide-react';

const RotatePDF = () => {
  const [rotation, setRotation] = useState(90);

  const options = (
    <div className="space-y-4">
      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Rotation Angle</label>
      <div className="grid grid-cols-3 gap-2">
        {[90, 180, 270].map(angle => (
          <button
            key={angle}
            onClick={() => setRotation(angle)}
            className={`py-3 rounded-xl text-xs font-black transition-all ${
              rotation === angle ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-white/5 text-muted-foreground hover:bg-white/10'
            }`}
          >
            {angle}°
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <ToolBase
      title="Rotate PDF"
      description="Rotate all pages in your PDF document. Perfect for fixing scanned documents or horizontal layouts."
      icon={RefreshCw}
      accept=".pdf"
      multiple={false}
      endpoint="/api/pdf/rotate"
      options={options}
      getExtraData={() => ({ rotation })}
      resultFilename="rotated_document.pdf"
    />
  );
};

export default RotatePDF;
