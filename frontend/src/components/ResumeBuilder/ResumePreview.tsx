import { useResume } from '../../context/ResumeContext';
import { Mail, Phone, MapPin, Link } from 'lucide-react';

const ResumePreview = () => {
  const { resumeData } = useResume();

  const renderTemplate = () => {
    switch (resumeData.template) {
      case 'Classic':
        return <ClassicTemplate data={resumeData} />;
      case 'Creative':
        return <CreativeTemplate data={resumeData} />;
      default:
        return <ModernTemplate data={resumeData} />;
    }
  };

  return (
    <div className="bg-white text-slate-900 shadow-2xl rounded-sm overflow-hidden min-h-[1120px] w-full max-w-[794px] mx-auto origin-top transition-all duration-500 print:shadow-none print:rounded-none print:m-0" id="resume-a4">
      {renderTemplate()}
    </div>
  );
};

const ModernTemplate = ({ data }: { data: any }) => (
  <div className="p-12 space-y-8 font-sans">
    <header className="space-y-4 border-b-2 pb-8" style={{ borderColor: data.themeColor }}>
      <h1 className="text-5xl font-black tracking-tight uppercase" style={{ color: data.themeColor }}>{data.personalInfo.fullName || 'Your Name'}</h1>
      <p className="text-xl font-bold text-slate-500">{data.personalInfo.title}</p>
      <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-400">
        {data.personalInfo.email && <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {data.personalInfo.email}</span>}
        {data.personalInfo.phone && <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {data.personalInfo.phone}</span>}
        {data.personalInfo.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {data.personalInfo.location}</span>}
      </div>
    </header>

    {data.summary && (
      <section className="space-y-3">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Profile</h3>
        <p className="text-slate-600 leading-relaxed text-sm">{data.summary}</p>
      </section>
    )}

    {data.experience.length > 0 && (
      <section className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Experience</h3>
        <div className="space-y-6">
          {data.experience.map((exp: any) => (
            <div key={exp.id} className="space-y-2">
              <div className="flex justify-between items-baseline">
                <h4 className="font-bold text-lg">{exp.position}</h4>
                <span className="text-xs font-bold text-slate-400">{exp.startDate} — {exp.endDate}</span>
              </div>
              <p className="text-sm font-bold" style={{ color: data.themeColor }}>{exp.company}</p>
              <p className="text-sm text-slate-600 leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      </section>
    )}

    {data.education.length > 0 && (
      <section className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Education</h3>
        <div className="space-y-4">
          {data.education.map((edu: any) => (
            <div key={edu.id} className="flex justify-between items-baseline">
              <div>
                <h4 className="font-bold text-base">{edu.degree}</h4>
                <p className="text-sm text-slate-600">{edu.institution}</p>
              </div>
              <span className="text-xs font-bold text-slate-400">{edu.startDate} — {edu.endDate}</span>
            </div>
          ))}
        </div>
      </section>
    )}

    {data.projects.length > 0 && (
      <section className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Projects</h3>
        <div className="space-y-4">
          {data.projects.map((proj: any) => (
            <div key={proj.id} className="space-y-1">
              <div className="flex justify-between items-baseline">
                <h4 className="font-bold text-base">{proj.name}</h4>
                {proj.link && <span className="text-xs font-bold text-slate-400">{proj.link}</span>}
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{proj.description}</p>
            </div>
          ))}
        </div>
      </section>
    )}

    {data.skills.length > 0 && (
      <section className="space-y-3">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {data.skills.filter(Boolean).map((skill: string, i: number) => (
            <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">
              {skill}
            </span>
          ))}
        </div>
      </section>
    )}
  </div>
);

const ClassicTemplate = ({ data }: { data: any }) => (
  <div className="p-12 space-y-6 font-serif">
    <header className="text-center space-y-2 border-b border-slate-200 pb-6">
      <h1 className="text-4xl font-bold">{data.personalInfo.fullName || 'Your Name'}</h1>
      <div className="flex justify-center flex-wrap gap-4 text-xs text-slate-600 italic">
        <span>{data.personalInfo.email}</span>
        <span>{data.personalInfo.phone}</span>
        <span>{data.personalInfo.location}</span>
      </div>
    </header>

    <section className="space-y-2">
      <h3 className="text-base font-bold uppercase border-b border-slate-800 pb-1">Professional Summary</h3>
      <p className="text-sm leading-relaxed">{data.summary}</p>
    </section>

    <section className="space-y-4">
      <h3 className="text-base font-bold uppercase border-b border-slate-800 pb-1">Work History</h3>
      {data.experience.map((exp: any) => (
        <div key={exp.id} className="space-y-1">
          <div className="flex justify-between font-bold text-sm">
            <span>{exp.position}, {exp.company}</span>
            <span>{exp.startDate} - {exp.endDate}</span>
          </div>
          <p className="text-sm text-slate-700">{exp.description}</p>
        </div>
      ))}
    </section>

    {data.education.length > 0 && (
      <section className="space-y-3">
        <h3 className="text-base font-bold uppercase border-b border-slate-800 pb-1">Education</h3>
        {data.education.map((edu: any) => (
          <div key={edu.id} className="flex justify-between text-sm">
            <span className="font-bold">{edu.degree}, {edu.institution}</span>
            <span>{edu.startDate} - {edu.endDate}</span>
          </div>
        ))}
      </section>
    )}

    {data.projects.length > 0 && (
      <section className="space-y-4">
        <h3 className="text-base font-bold uppercase border-b border-slate-800 pb-1">Key Projects</h3>
        {data.projects.map((proj: any) => (
          <div key={proj.id} className="space-y-1 text-sm">
            <div className="flex justify-between font-bold">
              <span>{proj.name}</span>
              <span className="text-xs italic">{proj.link}</span>
            </div>
            <p className="text-slate-700">{proj.description}</p>
          </div>
        ))}
      </section>
    )}
  </div>
);

const CreativeTemplate = ({ data }: { data: any }) => (
  <div className="flex h-full min-h-[1120px] font-sans">
    <aside className="w-1/3 bg-slate-900 text-white p-10 space-y-8">
      <div className="space-y-4">
        <div className="w-32 h-32 bg-white/10 rounded-2xl mx-auto flex items-center justify-center text-4xl font-black">
          {data.personalInfo.fullName?.charAt(0) || '?'}
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold">{data.personalInfo.fullName}</h2>
          <p className="text-xs text-slate-400">{data.personalInfo.title}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 border-b border-white/10 pb-2">Contact</h3>
        <div className="space-y-3 text-xs opacity-80">
          <p className="flex items-center gap-2"><Mail className="w-3 h-3" /> {data.personalInfo.email}</p>
          <p className="flex items-center gap-2"><Phone className="w-3 h-3" /> {data.personalInfo.phone}</p>
          <p className="flex items-center gap-2"><MapPin className="w-3 h-3" /> {data.personalInfo.location}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 border-b border-white/10 pb-2">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill: string, i: number) => (
            <span key={i} className="px-2 py-1 bg-white/10 rounded text-[10px] font-medium">{skill}</span>
          ))}
        </div>
      </div>
    </aside>

    <main className="w-2/3 p-12 bg-white space-y-8">
      <section className="space-y-3">
        <h3 className="text-lg font-bold" style={{ color: data.themeColor }}>Professional Profile</h3>
        <p className="text-sm text-slate-600 leading-relaxed">{data.summary}</p>
      </section>

      <section className="space-y-6">
        <h3 className="text-lg font-bold border-b pb-2" style={{ color: data.themeColor, borderColor: `${data.themeColor}33` }}>Experience</h3>
        {data.experience.map((exp: any) => (
          <div key={exp.id} className="space-y-2">
            <div className="flex justify-between">
              <h4 className="font-bold text-slate-800">{exp.position}</h4>
              <span className="text-xs font-bold text-slate-400 uppercase">{exp.startDate} - {exp.endDate}</span>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{exp.company}</p>
            <p className="text-sm text-slate-600">{exp.description}</p>
          </div>
        ))}
      </section>
    </main>
  </div>
);

export default ResumePreview;
