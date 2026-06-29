import { createContext, useContext, useState, useEffect, type ReactNode, type Dispatch, type SetStateAction } from 'react';
import axios from 'axios';

export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    portfolio: string;
    github?: string;
    title: string;
  };
  summary: string;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    startDate: string;
    endDate: string;
    location: string;
  }>;
  experience: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  projects: Array<{
    id: string;
    name: string;
    link: string;
    description: string;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
  }>;
  achievements: Array<{
    id: string;
    description: string;
  }>;
  skills: string[];
  languages?: string[];
  interests?: string[];
  template: 'Modern' | 'Classic' | 'Creative' | 'Minimal' | 'Corporate' | 'Tech';
  themeColor: string;
  fontFamily?: string;
  spacing?: string;
  fontSize?: 'Small' | 'Normal' | 'Large';
}

const initialData: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    portfolio: '',
    github: '',
    title: ''
  },
  summary: '',
  education: [],
  experience: [],
  projects: [],
  certifications: [],
  achievements: [],
  skills: [],
  languages: [],
  interests: [],
  template: 'Modern',
  themeColor: '#8b5cf6',
  fontFamily: 'Inter',
  spacing: 'Normal',
  fontSize: 'Normal'
};

const sampleData: ResumeData = {
  personalInfo: {
    fullName: 'Satyam Sharma',
    email: 'satyam@example.com',
    phone: '+91 98765 43210',
    location: 'Delhi, India',
    linkedin: 'linkedin.com/in/satyam',
    portfolio: 'satyam.dev',
    github: 'github.com/satyam',
    title: 'Software Engineer & MCA Aspirant'
  },
  summary: 'A highly motivated and detail-oriented student pursuing MCA with a strong foundation in MERN stack development. Passionate about building scalable web applications and solving complex architectural problems.',
  education: [
    {
      id: '1',
      institution: 'National Institute of Technology',
      degree: 'Master of Computer Applications',
      startDate: '2024',
      endDate: 'Present',
      location: 'Tiruchirappalli'
    }
  ],
  experience: [
    {
      id: '1',
      company: 'Tech Innovations Inc.',
      position: 'Web Development Intern',
      startDate: 'May 2023',
      endDate: 'Aug 2023',
      description: 'Developed responsive UI components using React and Tailwind CSS. Integrated RESTful APIs and improved page load performance by 40%.'
    }
  ],
  projects: [
    {
      id: '1',
      name: 'ScholarOS Workspace',
      link: 'github.com/satyam/scholaros',
      description: 'A full-stack SaaS academic operating system featuring AI rank predictors and resume builders.'
    }
  ],
  certifications: [
    {
      id: '1',
      name: 'AWS Certified Cloud Practitioner',
      issuer: 'Amazon Web Services',
      date: '2023'
    }
  ],
  achievements: [
    {
      id: '1',
      description: 'Winner of Smart India Hackathon 2023 out of 50,000+ participants.'
    }
  ],
  skills: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
  languages: ['English', 'Hindi'],
  interests: ['Coding', 'Gaming'],
  template: 'Modern',
  themeColor: '#8b5cf6',
  fontSize: 'Normal'
};

interface ResumeContextType {
  resumeData: ResumeData;
  setResumeData: Dispatch<SetStateAction<ResumeData>>;
  fillSampleData: () => void;
  resetData: () => void;
  aiFillResume: (title: string, skills: string) => Promise<void>;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider = ({ children }: { children: ReactNode }) => {
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    try {
      const saved = localStorage.getItem('resume-draft');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Deep-merge: ensure every field exists even if localStorage has old schema
        return {
          ...initialData,
          ...parsed,
          personalInfo: { ...initialData.personalInfo, ...(parsed.personalInfo || {}) },
          education:      Array.isArray(parsed.education)      ? parsed.education      : [],
          experience:     Array.isArray(parsed.experience)     ? parsed.experience     : [],
          projects:       Array.isArray(parsed.projects)       ? parsed.projects       : [],
          certifications: Array.isArray(parsed.certifications) ? parsed.certifications : [],
          achievements:   Array.isArray(parsed.achievements)   ? parsed.achievements   : [],
          skills:         Array.isArray(parsed.skills)         ? parsed.skills         : [],
          languages:      Array.isArray(parsed.languages)      ? parsed.languages      : [],
          interests:      Array.isArray(parsed.interests)      ? parsed.interests      : [],
        };
      }
    } catch { /* corrupted — start fresh */ }
    return initialData;
  });

  useEffect(() => {
    localStorage.setItem('resume-draft', JSON.stringify(resumeData));
  }, [resumeData]);

  const fillSampleData = () => setResumeData(sampleData);
  const resetData = () => setResumeData(initialData);

  const aiFillResume = async (title: string, skills: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/resumes/ai-fill`,
        { title, skills },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data) {
        setResumeData({
          ...initialData,
          ...res.data,
          personalInfo: {
            ...initialData.personalInfo,
            ...(res.data.personalInfo || {})
          }
        });
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'AI Resume auto-fill failed');
    }
  };

  return (
    <ResumeContext.Provider value={{ resumeData, setResumeData, fillSampleData, resetData, aiFillResume }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) throw new Error('useResume must be used within a ResumeProvider');
  return context;
};
