import ToolBase from '../../../components/ToolBase';
import { FileMinus } from 'lucide-react';

const CompressPDF = () => {
  return (
    <ToolBase
      title="Compress PDF"
      description="Reduce the file size of your PDF while maintaining the best possible quality for sharing."
      icon={FileMinus}
      accept=".pdf"
      multiple={false}
      endpoint="/api/pdf/compress"
      resultFilename="compressed_document.pdf"
    />
  );
};

export default CompressPDF;
