import { useResume } from '../../context/ResumeContext';
import { Mail, Phone, MapPin, Link, Globe } from 'lucide-react';

// Standard hex colors to avoid html2canvas oklch parsing errors
const COLORS = {
  slate900: '#0f172a',
  slate800: '#1e293b',
  slate700: '#334155',
  slate600: '#475569',
  slate500: '#64748b',
  slate400: '#94a3b8',
  slate300: '#cbd5e1',
  slate100: '#f1f5f9',
  slate50: '#f8fafc',
  white: '#ffffff',
  emerald600: '#059669'
};

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
    <div className="bg-white shadow-2xl rounded-sm overflow-hidden min-h-[1120px] w-full max-w-[794px] mx-auto origin-top transition-all duration-500 print:shadow-none print:rounded-none print:m-0" 
      id="resume-a4"
      style={{ color: COLORS.slate900, backgroundColor: COLORS.white }}
    >
      {renderTemplate()}
    </div>
  );
};

const ModernTemplate = ({ data }: { data: any }) => (
  <div className="p-10 md:p-14 space-y-10 font-sans">
    <header className="space-y-6">
      <div className="flex justify-between items-start border-b-2 pb-8" style={{ borderColor: data.themeColor || COLORS.slate900 }}>
        <div className="space-y-2 flex-1">
          <h1 className="text-5xl font-black tracking-tighter uppercase" style={{ color: data.themeColor || COLORS.slate900 }}>{data.personalInfo.fullName || 'Your Name'}</h1>
          <p className="text-xl font-bold tracking-tight" style={{ color: COLORS.slate600 }}>{data.personalInfo.title || 'Professional Title'}</p>
        </div>
        <div className="flex flex-col items-end gap-1.5 text-[10px] font-black uppercase tracking-widest text-right" style={{ color: COLORS.slate400 }}>
          {data.personalInfo.email && <span className="flex items-center gap-2">{data.personalInfo.email} <Mail className="w-3 h-3" /></span>}
          {data.personalInfo.phone && <span className="flex items-center gap-2">{data.personalInfo.phone} <Phone className="w-3 h-3" /></span>}
          {data.personalInfo.location && <span className="flex items-center gap-2">{data.personalInfo.location} <MapPin className="w-3 h-3" /></span>}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-6 text-xs font-bold" style={{ color: COLORS.slate500 }}>
        {data.personalInfo.linkedin && (
          <a href={data.personalInfo.linkedin} className="flex items-center gap-1.5 hover:text-slate-900 transition-colors">
            <Link className="w-3.5 h-3.5" /> LinkedIn
          </a>
        )}
        {data.personalInfo.github && (
          <a href={data.personalInfo.github} className="flex items-center gap-1.5 hover:text-slate-900 transition-colors">
            <Globe className="w-3.5 h-3.5" /> GitHub
          </a>
        )}
        {data.personalInfo.portfolio && (
          <a href={data.personalInfo.portfolio} className="flex items-center gap-1.5 hover:text-slate-900 transition-colors">
            <Link className="w-3.5 h-3.5" /> Portfolio
          </a>
        )}
      </div>
    </header>

    {data.summary && (
      <section className="space-y-3">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] border-b pb-2" style={{ color: COLORS.slate400, borderColor: COLORS.slate100 }}>Professional Summary</h3>
        <p className="leading-relaxed text-sm font-medium" style={{ color: COLORS.slate600 }}>{data.summary}</p>
      </section>
    )}

    <div className="grid grid-cols-12 gap-10">
      <div className="col-span-8 space-y-10">
        {data.experience.length > 0 && (
          <section className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] border-b pb-2" style={{ color: COLORS.slate400, borderColor: COLORS.slate100 }}>Experience</h3>
            <div className="space-y-8">
              {data.experience.map((exp: any) => (
                <div key={exp.id} className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-black text-lg tracking-tight" style={{ color: COLORS.slate800 }}>{exp.position}</h4>
                    <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: COLORS.slate400 }}>{exp.startDate} — {exp.endDate}</span>
                  </div>
                  <p className="text-sm font-black uppercase tracking-widest" style={{ color: data.themeColor || COLORS.slate900 }}>{exp.company}</p>
                  <p className="text-sm leading-relaxed font-medium whitespace-pre-wrap" style={{ color: COLORS.slate600 }}>{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.projects.length > 0 && (
          <section className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] border-b pb-2" style={{ color: COLORS.slate400, borderColor: COLORS.slate100 }}>Selected Projects</h3>
            <div className="space-y-6">
              {data.projects.map((proj: any) => (
                <div key={proj.id} className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-black text-base" style={{ color: COLORS.slate800 }}>{proj.name}</h4>
                    {proj.link && <span className="text-[10px] font-bold" style={{ color: COLORS.slate400 }}>{proj.link}</span>}
                  </div>
                  <p className="text-sm leading-relaxed font-medium" style={{ color: COLORS.slate600 }}>{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="col-span-4 space-y-10">
        {data.skills.length > 0 && (
          <section className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] border-b pb-2" style={{ color: COLORS.slate400, borderColor: COLORS.slate100 }}>Expertise</h3>
            <div className="flex flex-wrap gap-2">
              {data.skills.filter(Boolean).map((skill: string, i: number) => (
                <span key={i} className="px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-md border" style={{ backgroundColor: COLORS.slate50, color: COLORS.slate700, borderColor: COLORS.slate100 }}>
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {data.education.length > 0 && (
          <section className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] border-b pb-2" style={{ color: COLORS.slate400, borderColor: COLORS.slate100 }}>Education</h3>
            <div className="space-y-6">
              {data.education.map((edu: any) => (
                <div key={edu.id} className="space-y-1">
                  <h4 className="font-black text-sm" style={{ color: COLORS.slate800 }}>{edu.degree}</h4>
                  <p className="text-xs font-bold" style={{ color: COLORS.slate500 }}>{edu.institution}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: COLORS.slate400 }}>{edu.startDate} — {edu.endDate}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.certifications && data.certifications.length > 0 && (
          <section className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] border-b pb-2" style={{ color: COLORS.slate400, borderColor: COLORS.slate100 }}>Certifications</h3>
            <div className="space-y-4">
              {data.certifications.map((cert: any) => (
                <div key={cert.id} className="space-y-0.5">
                  <h4 className="font-black text-[11px] leading-tight" style={{ color: COLORS.slate800 }}>{cert.name}</h4>
                  <p className="text-[10px] font-bold" style={{ color: COLORS.slate500 }}>{cert.issuer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.achievements && data.achievements.length > 0 && (
          <section className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] border-b pb-2" style={{ color: COLORS.slate400, borderColor: COLORS.slate100 }}>Achievements</h3>
            <div className="space-y-3">
              {data.achievements.map((ach: any) => (
                <p key={ach.id} className="text-[11px] font-bold leading-relaxed" style={{ color: COLORS.slate600 }}>• {ach.description}</p>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  </div>
);

const ClassicTemplate = ({ data }: { data: any }) => (
  <div className="p-14 space-y-8 font-serif">
    <header className="text-center space-y-3 border-b-2 pb-8" style={{ borderColor: COLORS.slate900 }}>
      <h1 className="text-4xl font-bold tracking-tight" style={{ color: COLORS.slate900 }}>{data.personalInfo.fullName || 'Your Name'}</h1>
      <p className="text-lg font-medium italic" style={{ color: COLORS.slate700 }}>{data.personalInfo.title}</p>
      <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 text-[11px] font-bold uppercase tracking-widest" style={{ color: COLORS.slate600 }}>
        <span>{data.personalInfo.email}</span>
        <span>{data.personalInfo.phone}</span>
        <span>{data.personalInfo.location}</span>
      </div>
    </header>

    <div className="space-y-8">
      <section className="space-y-3">
        <h3 className="text-sm font-black uppercase border-b pb-1" style={{ borderColor: COLORS.slate800, color: COLORS.slate900 }}>Professional Profile</h3>
        <p className="text-sm leading-relaxed" style={{ color: COLORS.slate800 }}>{data.summary}</p>
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-black uppercase border-b pb-1" style={{ borderColor: COLORS.slate800, color: COLORS.slate900 }}>Work History</h3>
        <div className="space-y-6">
          {data.experience.map((exp: any) => (
            <div key={exp.id} className="space-y-2">
              <div className="flex justify-between font-bold text-base">
                <span style={{ color: COLORS.slate900 }}>{exp.position} | {exp.company}</span>
                <span className="text-xs" style={{ color: COLORS.slate600 }}>{exp.startDate} - {exp.endDate}</span>
              </div>
              <p className="text-sm whitespace-pre-wrap leading-relaxed" style={{ color: COLORS.slate700 }}>{exp.description}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-2 gap-10">
        <section className="space-y-4">
          <h3 className="text-sm font-black uppercase border-b pb-1" style={{ borderColor: COLORS.slate800, color: COLORS.slate900 }}>Education</h3>
          {data.education.map((edu: any) => (
            <div key={edu.id} className="space-y-1">
              <p className="font-bold text-sm" style={{ color: COLORS.slate900 }}>{edu.degree}</p>
              <p className="text-xs" style={{ color: COLORS.slate700 }}>{edu.institution}</p>
              <p className="text-xs italic" style={{ color: COLORS.slate600 }}>{edu.startDate} - {edu.endDate}</p>
            </div>
          ))}
        </section>

        <section className="space-y-4">
          <h3 className="text-sm font-black uppercase border-b pb-1" style={{ borderColor: COLORS.slate800, color: COLORS.slate900 }}>Core Skills</h3>
          <p className="text-sm leading-relaxed font-medium" style={{ color: COLORS.slate700 }}>{data.skills.join(' • ')}</p>
        </section>
      </div>
    </div>
  </div>
);

const CreativeTemplate = ({ data }: { data: any }) => (
  <div className="flex h-full min-h-[1120px] font-sans">
    <aside className="w-[35%] p-12 space-y-10" style={{ backgroundColor: COLORS.slate900, color: COLORS.white }}>
      <div className="space-y-6">
        <div className="w-32 h-32 bg-white/10 rounded-[2.5rem] flex items-center justify-center text-5xl font-black shadow-2xl border border-white/10" style={{ color: data.themeColor || COLORS.white }}>
          {data.personalInfo.fullName?.charAt(0) || '?'}
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black tracking-tight leading-tight">{data.personalInfo.fullName}</h2>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: data.themeColor || COLORS.white }}>{data.personalInfo.title}</p>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] border-b pb-2" style={{ color: COLORS.slate500, borderColor: 'rgba(255,255,255,0.05)' }}>Contact</h3>
        <div className="space-y-4 text-[11px] font-medium" style={{ color: COLORS.slate300 }}>
          <p className="flex items-center gap-3"><Mail className="w-3.5 h-3.5" style={{ color: COLORS.slate500 }} /> {data.personalInfo.email}</p>
          <p className="flex items-center gap-3"><Phone className="w-3.5 h-3.5" style={{ color: COLORS.slate500 }} /> {data.personalInfo.phone}</p>
          <p className="flex items-center gap-3"><MapPin className="w-3.5 h-3.5" style={{ color: COLORS.slate500 }} /> {data.personalInfo.location}</p>
          {data.personalInfo.linkedin && <p className="flex items-center gap-3"><Link className="w-3.5 h-3.5" style={{ color: COLORS.slate500 }} /> LinkedIn</p>}
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] border-b pb-2" style={{ color: COLORS.slate500, borderColor: 'rgba(255,255,255,0.05)' }}>Expertise</h3>
        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill: string, i: number) => (
            <span key={i} className="px-2.5 py-1.5 bg-white/5 rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/5">{skill}</span>
          ))}
        </div>
      </div>
    </aside>

    <main className="flex-1 p-14 bg-white space-y-12">
      <section className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-[0.3em]" style={{ color: COLORS.slate300 }}>Background</h3>
        <p className="text-sm leading-relaxed font-medium" style={{ color: COLORS.slate600 }}>{data.summary}</p>
      </section>

      <section className="space-y-8">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] border-b pb-4" style={{ color: COLORS.slate300 }}>Professional Path</h3>
        <div className="space-y-8">
          {data.experience.map((exp: any) => (
            <div key={exp.id} className="space-y-3 relative pl-6 border-l-2" style={{ borderColor: `${data.themeColor || COLORS.slate900}33` }}>
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2" style={{ borderColor: data.themeColor || COLORS.slate900 }} />
              <div className="flex justify-between items-baseline">
                <h4 className="font-black text-lg" style={{ color: COLORS.slate800 }}>{exp.position}</h4>
                <span className="text-[10px] font-black uppercase" style={{ color: COLORS.slate400 }}>{exp.startDate} - {exp.endDate}</span>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: data.themeColor || COLORS.slate900 }}>{exp.company}</p>
              <p className="text-sm leading-relaxed font-medium" style={{ color: COLORS.slate600 }}>{exp.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  </div>
);

export default ResumePreview;
