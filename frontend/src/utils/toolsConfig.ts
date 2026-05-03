import { 
  Calculator, 
  Percent, 
  Calendar, 
  TrendingUp, 
  Target, 
  Layout, 
  FileText, 
  Type, 
  FileSearch,
  FilePlus,
  Scissors,
  FileMinus,
  Image as ImageIcon,
  Maximize,
  RefreshCw
} from 'lucide-react';

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: 'Academic' | 'Exam' | 'Utility' | 'PDF' | 'Image';
  path: string;
}

export const tools: Tool[] = [
  {
    id: 'cgpa-calc',
    name: 'CGPA Calculator',
    description: 'Calculate your cumulative GPA across multiple semesters easily.',
    icon: Calculator,
    category: 'Academic',
    path: '/tools/cgpa-calculator'
  },
  {
    id: 'cgpa-conv',
    name: 'CGPA ↔ % Converter',
    description: 'Quickly convert between CGPA and Percentage based on university standards.',
    icon: Percent,
    category: 'Academic',
    path: '/tools/cgpa-converter'
  },
  {
    id: 'attendance-calc',
    name: 'Attendance Calculator',
    description: 'Find out how many more classes you need to attend to reach your target %.',
    icon: Calendar,
    category: 'Academic',
    path: '/tools/attendance-calculator'
  },
  {
    id: 'rank-pred',
    name: 'AI Rank Predictor',
    description: 'Predict your exam rank based on marks using Gemini AI.',
    icon: TrendingUp,
    category: 'Exam',
    path: '/tools/rank-predictor'
  },
  {
    id: 'marks-percentile',
    name: 'Marks vs Percentile',
    description: 'Analyze your performance with our AI-powered percentile calculator.',
    icon: Target,
    category: 'Exam',
    path: '/tools/marks-percentile'
  },
  {
    id: 'study-planner',
    name: 'Study Planner',
    description: 'Plan your daily study schedule and track your progress.',
    icon: Layout,
    category: 'Exam',
    path: '/tools/study-planner'
  },
  {
    id: 'resume-builder',
    name: 'Resume Builder',
    description: 'Create professional resumes from high-quality templates.',
    icon: FileText,
    category: 'Utility',
    path: '/tools/resume-builder'
  },
  {
    id: 'word-counter',
    name: 'Word Counter',
    description: 'Live typing stats for word count, characters, and reading time.',
    icon: Type,
    category: 'Utility',
    path: '/tools/word-counter'
  },
  {
    id: 'pdf-to-text',
    name: 'PDF to Text',
    description: 'Extract text content from PDF files with high accuracy.',
    icon: FileSearch,
    category: 'Utility',
    path: '/tools/pdf-to-text'
  },
  // PDF Tools
  {
    id: 'pdf-merge',
    name: 'Merge PDF',
    description: 'Combine multiple PDF files into one easily.',
    icon: FilePlus,
    category: 'PDF',
    path: '/tools/pdf/merge'
  },
  {
    id: 'pdf-split',
    name: 'Split PDF',
    description: 'Separate one page or a whole set for easy conversion into independent PDF files.',
    icon: Scissors,
    category: 'PDF',
    path: '/tools/pdf/split'
  },
  {
    id: 'pdf-compress',
    name: 'Compress PDF',
    description: 'Reduce file size while optimizing for maximal PDF quality.',
    icon: FileMinus,
    category: 'PDF',
    path: '/tools/pdf/compress'
  },
  // Image Tools
  {
    id: 'image-compress',
    name: 'Compress Image',
    description: 'Compress JPG, PNG, SVG or GIF with the best quality and compression.',
    icon: ImageIcon,
    category: 'Image',
    path: '/tools/image/compress'
  },
  {
    id: 'image-resize',
    name: 'Resize Image',
    description: 'Define your dimensions, by pixels or percentage, and resize your JPG, PNG, SVG or GIF images.',
    icon: Maximize,
    category: 'Image',
    path: '/tools/image/resize'
  },
  {
    id: 'image-convert',
    name: 'Convert Image',
    description: 'Convert JPG to PNG, PNG to JPG, or any image to WebP.',
    icon: RefreshCw,
    category: 'Image',
    path: '/tools/image/convert'
  }
];
