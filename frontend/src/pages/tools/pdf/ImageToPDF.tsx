import ToolBase from '../../../components/ToolBase';
import { FilePlus } from 'lucide-react';

const ImageToPDF = () => {
  return (
    <ToolBase
      title="Image to PDF"
      description="Convert multiple JPG or PNG images into a single, professional-looking PDF document instantly."
      icon={FilePlus}
      accept="image/jpeg,image/png"
      multiple={true}
      endpoint="/api/pdf/image-to-pdf"
      resultFilename="converted_images.pdf"
    />
  );
};

export default ImageToPDF;
