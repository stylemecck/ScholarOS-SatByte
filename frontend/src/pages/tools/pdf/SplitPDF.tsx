import ToolBase from '../../../components/ToolBase';
import { Scissors } from 'lucide-react';

const SplitPDF = () => {
  return (
    <ToolBase
      title="Split PDF"
      description="Extract all pages from a PDF document or split it into individual files zipped for your convenience."
      icon={Scissors}
      accept=".pdf"
      multiple={false}
      endpoint="/api/pdf/split"
      resultFilename="split_pages.zip"
    />
  );
};

export default SplitPDF;
