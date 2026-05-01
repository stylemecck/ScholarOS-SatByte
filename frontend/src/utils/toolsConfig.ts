import { 
  Calculator, 
  Percent, 
  Calendar, 
  TrendingUp, 
  Target, 
  Layout, 
  FileText, 
  Type, 
  FileSearch 
} from 'lucide-react';

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: 'Academic' | 'Exam' | 'Utility';
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
  }
];
