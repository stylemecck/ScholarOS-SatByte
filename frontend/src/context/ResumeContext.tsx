import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    portfolio: string;
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
  skills: string[];
  template: 'Modern' | 'Classic' | 'Creative';
  themeColor: string;
}

const initialData: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    portfolio: '',
    title: ''
  },
  summary: '',
  education: [],
  experience: [],
  projects: [],
  skills: [],
  template: 'Modern',
  themeColor: '#8b5cf6'
};

const sampleData: ResumeData = {
  personalInfo: {
    fullName: 'Satyam Sharma',
    email: 'satyam@example.com',
    phone: '+91 98765 43210',
    location: 'Delhi, India',
    linkedin: 'linkedin.com/in/satyam',
    portfolio: 'satyam.dev',
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
      name: 'Student Toolkit Pro',
      link: 'github.com/satyam/toolkit',
      description: 'A full-stack utility platform for students featuring AI rank predictors and resume builders.'
    }
  ],
  skills: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
  template: 'Modern',
  themeColor: '#8b5cf6'
};

interface ResumeContextType {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
  fillSampleData: () => void;
  resetData: () => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    const saved = localStorage.getItem('resume-draft');
    return saved ? JSON.parse(saved) : initialData;
  });

  useEffect(() => {
    localStorage.setItem('resume-draft', JSON.stringify(resumeData));
  }, [resumeData]);

  const fillSampleData = () => setResumeData(sampleData);
  const resetData = () => setResumeData(initialData);

  return (
    <ResumeContext.Provider value={{ resumeData, setResumeData, fillSampleData, resetData }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) throw new Error('useResume must be used within a ResumeProvider');
  return context;
};
