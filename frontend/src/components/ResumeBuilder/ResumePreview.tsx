import { useResume } from '../../context/ResumeContext';
import { Mail, Phone, MapPin, Link, Globe } from 'lucide-react';

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
  <div className="p-10 md:p-14 space-y-10 font-sans">
    <header className="space-y-6">
      <div className="flex justify-between items-start border-b-2 pb-8" style={{ borderColor: data.themeColor }}>
        <div className="space-y-2 flex-1">
          <h1 className="text-5xl font-black tracking-tighter uppercase" style={{ color: data.themeColor }}>{data.personalInfo.fullName || 'Your Name'}</h1>
          <p className="text-xl font-bold text-slate-600 tracking-tight">{data.personalInfo.title || 'Professional Title'}</p>
        </div>
        <div className="flex flex-col items-end gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">
          {data.personalInfo.email && <span className="flex items-center gap-2">{data.personalInfo.email} <Mail className="w-3 h-3" /></span>}
          {data.personalInfo.phone && <span className="flex items-center gap-2">{data.personalInfo.phone} <Phone className="w-3 h-3" /></span>}
          {data.personalInfo.location && <span className="flex items-center gap-2">{data.personalInfo.location} <MapPin className="w-3 h-3" /></span>}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-6 text-xs font-bold text-slate-500">
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
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 pb-2">Professional Summary</h3>
        <p className="text-slate-600 leading-relaxed text-sm font-medium">{data.summary}</p>
      </section>
    )}

    <div className="grid grid-cols-12 gap-10">
      <div className="col-span-8 space-y-10">
        {data.experience.length > 0 && (
          <section className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 pb-2">Experience</h3>
            <div className="space-y-8">
              {data.experience.map((exp: any) => (
                <div key={exp.id} className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-black text-lg tracking-tight">{exp.position}</h4>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{exp.startDate} — {exp.endDate}</span>
                  </div>
                  <p className="text-sm font-black uppercase tracking-widest" style={{ color: data.themeColor }}>{exp.company}</p>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.projects.length > 0 && (
          <section className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 pb-2">Selected Projects</h3>
            <div className="space-y-6">
              {data.projects.map((proj: any) => (
                <div key={proj.id} className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-black text-base">{proj.name}</h4>
                    {proj.link && <span className="text-[10px] font-bold text-slate-400">{proj.link}</span>}
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="col-span-4 space-y-10">
        {data.skills.length > 0 && (
          <section className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 pb-2">Expertise</h3>
            <div className="flex flex-wrap gap-2">
              {data.skills.filter(Boolean).map((skill: string, i: number) => (
                <span key={i} className="px-3 py-1 bg-slate-50 text-slate-700 text-[10px] font-black uppercase tracking-wider rounded-md border border-slate-100">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {data.education.length > 0 && (
          <section className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 pb-2">Education</h3>
            <div className="space-y-6">
              {data.education.map((edu: any) => (
                <div key={edu.id} className="space-y-1">
                  <h4 className="font-black text-sm">{edu.degree}</h4>
                  <p className="text-xs font-bold text-slate-500">{edu.institution}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{edu.startDate} — {edu.endDate}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.certifications && data.certifications.length > 0 && (
          <section className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 pb-2">Certifications</h3>
            <div className="space-y-4">
              {data.certifications.map((cert: any) => (
                <div key={cert.id} className="space-y-0.5">
                  <h4 className="font-black text-[11px] leading-tight">{cert.name}</h4>
                  <p className="text-[10px] font-bold text-slate-500">{cert.issuer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.achievements && data.achievements.length > 0 && (
          <section className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 pb-2">Achievements</h3>
            <div className="space-y-3">
              {data.achievements.map((ach: any) => (
                <p key={ach.id} className="text-[11px] font-bold text-slate-600 leading-relaxed">• {ach.description}</p>
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
    <header className="text-center space-y-3 border-b-2 border-slate-900 pb-8">
      <h1 className="text-4xl font-bold tracking-tight">{data.personalInfo.fullName || 'Your Name'}</h1>
      <p className="text-lg font-medium text-slate-700 italic">{data.personalInfo.title}</p>
      <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 text-[11px] font-bold uppercase tracking-widest text-slate-600">
        <span>{data.personalInfo.email}</span>
        <span>{data.personalInfo.phone}</span>
        <span>{data.personalInfo.location}</span>
      </div>
    </header>

    <div className="space-y-8">
      <section className="space-y-3">
        <h3 className="text-sm font-black uppercase border-b border-slate-800 pb-1">Professional Profile</h3>
        <p className="text-sm leading-relaxed text-slate-800">{data.summary}</p>
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-black uppercase border-b border-slate-800 pb-1">Work History</h3>
        <div className="space-y-6">
          {data.experience.map((exp: any) => (
            <div key={exp.id} className="space-y-2">
              <div className="flex justify-between font-bold text-base">
                <span>{exp.position} | {exp.company}</span>
                <span className="text-xs">{exp.startDate} - {exp.endDate}</span>
              </div>
              <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-2 gap-10">
        <section className="space-y-4">
          <h3 className="text-sm font-black uppercase border-b border-slate-800 pb-1">Education</h3>
          {data.education.map((edu: any) => (
            <div key={edu.id} className="space-y-1">
              <p className="font-bold text-sm">{edu.degree}</p>
              <p className="text-xs text-slate-700">{edu.institution}</p>
              <p className="text-xs italic">{edu.startDate} - {edu.endDate}</p>
            </div>
          ))}
        </section>

        <section className="space-y-4">
          <h3 className="text-sm font-black uppercase border-b border-slate-800 pb-1">Core Skills</h3>
          <p className="text-sm text-slate-700 leading-relaxed font-medium">{data.skills.join(' • ')}</p>
        </section>
      </div>
    </div>
  </div>
);

const CreativeTemplate = ({ data }: { data: any }) => (
  <div className="flex h-full min-h-[1120px] font-sans">
    <aside className="w-[35%] bg-slate-900 text-white p-12 space-y-10">
      <div className="space-y-6">
        <div className="w-32 h-32 bg-white/10 rounded-[2.5rem] flex items-center justify-center text-5xl font-black text-white shadow-2xl border border-white/10" style={{ color: data.themeColor }}>
          {data.personalInfo.fullName?.charAt(0) || '?'}
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black tracking-tight leading-tight">{data.personalInfo.fullName}</h2>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400" style={{ color: data.themeColor }}>{data.personalInfo.title}</p>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 border-b border-white/5 pb-2">Contact</h3>
        <div className="space-y-4 text-[11px] font-medium text-slate-300">
          <p className="flex items-center gap-3"><Mail className="w-3.5 h-3.5 text-slate-500" /> {data.personalInfo.email}</p>
          <p className="flex items-center gap-3"><Phone className="w-3.5 h-3.5 text-slate-500" /> {data.personalInfo.phone}</p>
          <p className="flex items-center gap-3"><MapPin className="w-3.5 h-3.5 text-slate-500" /> {data.personalInfo.location}</p>
          {data.personalInfo.linkedin && <p className="flex items-center gap-3"><Link className="w-3.5 h-3.5 text-slate-500" /> LinkedIn</p>}
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 border-b border-white/5 pb-2">Expertise</h3>
        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill: string, i: number) => (
            <span key={i} className="px-2.5 py-1.5 bg-white/5 rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/5">{skill}</span>
          ))}
        </div>
      </div>
    </aside>

    <main className="flex-1 p-14 bg-white space-y-12">
      <section className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-300">Background</h3>
        <p className="text-sm text-slate-600 leading-relaxed font-medium">{data.summary}</p>
      </section>

      <section className="space-y-8">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-300 border-b pb-4">Professional Path</h3>
        <div className="space-y-8">
          {data.experience.map((exp: any) => (
            <div key={exp.id} className="space-y-3 relative pl-6 border-l-2" style={{ borderColor: `${data.themeColor}33` }}>
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2" style={{ borderColor: data.themeColor }} />
              <div className="flex justify-between items-baseline">
                <h4 className="font-black text-lg text-slate-800">{exp.position}</h4>
                <span className="text-[10px] font-black text-slate-400 uppercase">{exp.startDate} - {exp.endDate}</span>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: data.themeColor }}>{exp.company}</p>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">{exp.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  </div>
);

export default ResumePreview;
