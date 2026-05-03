import ToolBase from '../../../components/ToolBase';
import { FilePlus } from 'lucide-react';

const MergePDF = () => {
  return (
    <ToolBase
      title="Merge PDF"
      description="Combine multiple PDF files into a single document in seconds. Best for merging notes or reports."
      icon={FilePlus}
      accept=".pdf"
      multiple={true}
      endpoint="/api/pdf/merge"
      resultFilename="merged_document.pdf"
    />
  );
};

export default MergePDF;
