import React from 'react';
import { useResume } from '../../context/ResumeContext';

/* ─── All colours as explicit hex ──────────────────────────────── */
const C = {
  black:   '#000000',
  white:   '#ffffff',
  s900:    '#0f172a',
  s800:    '#1e293b',
  s700:    '#334155',
  s600:    '#475569',
  s500:    '#64748b',
  s400:    '#94a3b8',
  s300:    '#cbd5e1',
  s200:    '#e2e8f0',
  s100:    '#f1f5f9',
  s50:     '#f8fafc',
  emerald: '#059669',
};

/* ─── Shared inline-style helpers ──────────────────────────────── */
const row  = (extra: React.CSSProperties = {}): React.CSSProperties => ({ display: 'flex', ...extra });
const col  = (extra: React.CSSProperties = {}): React.CSSProperties => ({ display: 'flex', flexDirection: 'column', ...extra });
const grid = (cols: string, extra: React.CSSProperties = {}): React.CSSProperties => ({ display: 'grid', gridTemplateColumns: cols, ...extra });
const tag  = (bg: string, color: string, border: string): React.CSSProperties => ({
  padding: '2px 8px', fontSize: 9, fontWeight: 800, textTransform: 'uppercase',
  letterSpacing: '0.06em', backgroundColor: bg, color, border: `1px solid ${border}`, borderRadius: 4
});

/* ─── Section heading ──────────────────────────────────────────── */
const SectionHead = ({ children, themeColor }: { children: React.ReactNode; themeColor?: string }) => (
  <div style={{ borderBottom: `1px solid ${themeColor || C.s200}`, paddingBottom: 3, marginBottom: 8 }}>
    <span style={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.18em', color: themeColor || C.s500 }}>
      {children}
    </span>
  </div>
);

/* ─── Recursive font-size scaling helper ──────────────────────── */
const scaleStyles = (element: React.ReactNode, scale: number): React.ReactNode => {
  if (scale === 1.0) return element;
  if (!React.isValidElement(element)) return element;

  const props = element.props as any;
  let newStyle = props.style ? { ...props.style } : undefined;

  if (newStyle && typeof newStyle.fontSize === 'number') {
    newStyle.fontSize = Math.round(newStyle.fontSize * scale * 10) / 10;
  } else if (newStyle && typeof newStyle.fontSize === 'string' && newStyle.fontSize.endsWith('px')) {
    const val = parseFloat(newStyle.fontSize);
    if (!isNaN(val)) {
      newStyle.fontSize = `${Math.round(val * scale * 10) / 10}px`;
    }
  }

  const children = props.children;
  let newChildren = children;

  if (Array.isArray(children)) {
    newChildren = children.map((child, idx) => {
      const scaled = scaleStyles(child, scale);
      return React.isValidElement(scaled) ? React.cloneElement(scaled, { key: scaled.key || idx }) : scaled;
    });
  } else if (React.isValidElement(children)) {
    newChildren = scaleStyles(children, scale);
  }

  return React.cloneElement(element, newStyle ? { ...props, style: newStyle } : props, newChildren);
};

/* ─── Main export ──────────────────────────────────────────────── */
const ResumePreview = () => {
  const { resumeData } = useResume();

  const fontFamily = (() => {
    switch (resumeData.fontFamily) {
      case 'Roboto':           return 'Roboto, Arial, sans-serif';
      case 'Playfair Display': return "'Playfair Display', Georgia, serif";
      case 'Courier New':      return "'Courier New', monospace";
      case 'Georgia':          return 'Georgia, serif';
      default:                 return 'Inter, system-ui, sans-serif';
    }
  })();

  const spacingPx = resumeData.spacing === 'Compact' ? 12 : resumeData.spacing === 'Loose' ? 24 : 18;
  const lineH     = resumeData.spacing === 'Compact' ? 1.4 : resumeData.spacing === 'Loose' ? 1.8 : 1.6;
  const theme     = resumeData.themeColor || C.s900;

  const fontSizeFactor = (() => {
    switch (resumeData.fontSize) {
      case 'Small': return 0.88;
      case 'Large': return 1.12;
      default:      return 1.0;
    }
  })();

  const renderTemplate = () => {
    const props = { data: resumeData, sp: spacingPx, lh: lineH, theme, font: fontFamily };
    switch (resumeData.template) {
      case 'Classic':   return <ClassicTemplate   {...props} />;
      case 'Creative':  return <CreativeTemplate  {...props} />;
      case 'Minimal':   return <MinimalTemplate   {...props} />;
      case 'Corporate': return <CorporateTemplate {...props} />;
      case 'Tech':      return <TechTemplate      {...props} />;
      default:          return <ModernTemplate    {...props} />;
    }
  };

  return (
    <div
      id="resume-a4"
      style={{
        width: 794, minHeight: 1122,
        backgroundColor: C.white, color: C.s900,
        fontFamily, boxSizing: 'border-box',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {scaleStyles(renderTemplate(), fontSizeFactor)}
    </div>
  );
};

/* ══════════════════ TEMPLATE PROPS TYPE ═══════════════════════════ */
interface TP { data: any; sp: number; lh: number; theme: string; font: string; }

/* ══════════════════ 1. MODERN ═════════════════════════════════════ */
const ModernTemplate = ({ data, sp, lh, theme }: TP) => (
  <div style={{ padding: '48px 52px', backgroundColor: C.white, fontFamily: 'inherit' }}>
    {/* Header */}
    <header style={{ borderBottom: `2px solid ${theme}`, paddingBottom: 20, marginBottom: sp }}>
      <div style={row({ justifyContent: 'space-between', alignItems: 'flex-start' })}>
        <div>
          <h1 style={{ fontSize: 30, fontWeight: 900, letterSpacing: -1, textTransform: 'uppercase', color: theme, margin: 0 }}>
            {data.personalInfo.fullName || 'Your Name'}
          </h1>
          <p style={{ fontSize: 13, fontWeight: 700, color: C.s600, margin: '4px 0 0' }}>
            {data.personalInfo.title || 'Professional Title'}
          </p>
        </div>
        <div style={col({ alignItems: 'flex-end', gap: 3 })}>
          {data.personalInfo.email    && <span style={{ fontSize: 10, color: C.s500 }}>{data.personalInfo.email}</span>}
          {data.personalInfo.phone    && <span style={{ fontSize: 10, color: C.s500 }}>{data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span style={{ fontSize: 10, color: C.s500 }}>{data.personalInfo.location}</span>}
        </div>
      </div>
      <div style={row({ gap: 20, marginTop: 10 })}>
        {data.personalInfo.linkedin  && <span style={{ fontSize: 10, color: C.s500 }}>🔗 {data.personalInfo.linkedin}</span>}
        {data.personalInfo.github    && <span style={{ fontSize: 10, color: C.s500 }}>⌨ {data.personalInfo.github}</span>}
        {data.personalInfo.portfolio && <span style={{ fontSize: 10, color: C.s500 }}>🌐 {data.personalInfo.portfolio}</span>}
      </div>
    </header>

    {data.summary && (
      <section style={{ marginBottom: sp }}>
        <SectionHead themeColor={theme}>Professional Summary</SectionHead>
        <p style={{ fontSize: 11, color: C.s600, lineHeight: lh, margin: 0 }}>{data.summary}</p>
      </section>
    )}

    <div style={grid('8fr 4fr', { gap: 28 })}>
      {/* Left */}
      <div style={col({ gap: sp })}>
        {data.experience?.length > 0 && (
          <section>
            <SectionHead>Experience</SectionHead>
            <div style={col({ gap: 14 })}>
              {data.experience.map((e: any) => (
                <div key={e.id}>
                  <div style={row({ justifyContent: 'space-between', alignItems: 'baseline' })}>
                    <span style={{ fontSize: 12, fontWeight: 900, color: C.s800 }}>{e.position}</span>
                    <span style={{ fontSize: 9, fontWeight: 700, color: C.s400, textTransform: 'uppercase' }}>{e.startDate} — {e.endDate}</span>
                  </div>
                  <p style={{ fontSize: 9, fontWeight: 900, color: theme, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '2px 0 4px' }}>{e.company}</p>
                  <p style={{ fontSize: 10, color: C.s600, lineHeight: lh, whiteSpace: 'pre-wrap', margin: 0 }}>{e.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.projects?.length > 0 && (
          <section>
            <SectionHead>Projects</SectionHead>
            <div style={col({ gap: 10 })}>
              {data.projects.map((p: any) => (
                <div key={p.id}>
                  <div style={row({ justifyContent: 'space-between', alignItems: 'baseline' })}>
                    <span style={{ fontSize: 11, fontWeight: 900, color: C.s800 }}>{p.name}</span>
                    {p.link && <span style={{ fontSize: 9, color: C.s400 }}>{p.link}</span>}
                  </div>
                  <p style={{ fontSize: 10, color: C.s600, lineHeight: lh, margin: '3px 0 0' }}>{p.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.certifications?.length > 0 && (
          <section>
            <SectionHead>Certifications</SectionHead>
            <div style={col({ gap: 6 })}>
              {data.certifications.map((c: any) => (
                <div key={c.id} style={row({ justifyContent: 'space-between', alignItems: 'baseline' })}>
                  <div>
                    <span style={{ fontSize: 10, fontWeight: 800, color: C.s800 }}>{c.name}</span>
                    {c.issuer && <span style={{ fontSize: 9, color: C.s500, marginLeft: 6 }}>— {c.issuer}</span>}
                  </div>
                  <span style={{ fontSize: 9, color: C.s400 }}>{c.date}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.achievements?.length > 0 && (
          <section>
            <SectionHead>Achievements</SectionHead>
            <div style={col({ gap: 5 })}>
              {data.achievements.map((a: any) => (
                <p key={a.id} style={{ fontSize: 10, color: C.s600, lineHeight: lh, margin: 0 }}>• {a.description}</p>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Right */}
      <div style={col({ gap: sp })}>
        {data.skills?.filter(Boolean).length > 0 && (
          <section>
            <SectionHead>Expertise</SectionHead>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {data.skills.filter(Boolean).map((s: string, i: number) => (
                <span key={i} style={tag(C.s50, C.s700, C.s200)}>{s}</span>
              ))}
            </div>
          </section>
        )}

        {data.education?.length > 0 && (
          <section>
            <SectionHead>Education</SectionHead>
            <div style={col({ gap: 10 })}>
              {data.education.map((e: any) => (
                <div key={e.id}>
                  <p style={{ fontSize: 10, fontWeight: 900, color: C.s800, margin: 0 }}>{e.degree}</p>
                  <p style={{ fontSize: 10, fontWeight: 700, color: C.s500, margin: '2px 0 1px' }}>{e.institution}</p>
                  <p style={{ fontSize: 9, color: C.s400, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{e.startDate} — {e.endDate}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.languages?.filter(Boolean).length > 0 && (
          <section>
            <SectionHead>Languages</SectionHead>
            <p style={{ fontSize: 10, color: C.s700, lineHeight: 1.5, margin: 0 }}>
              {data.languages.filter(Boolean).join(', ')}
            </p>
          </section>
        )}

        {data.interests?.filter(Boolean).length > 0 && (
          <section>
            <SectionHead>Interests</SectionHead>
            <p style={{ fontSize: 10, color: C.s700, lineHeight: 1.5, margin: 0 }}>
              {data.interests.filter(Boolean).join(', ')}
            </p>
          </section>
        )}
      </div>
    </div>
  </div>
);

/* ══════════════════ 2. CLASSIC ════════════════════════════════════ */
const ClassicTemplate = ({ data, sp, lh }: TP) => (
  <div style={{ padding: '52px 56px', backgroundColor: C.white, fontFamily: 'Georgia, serif' }}>
    <header style={{ textAlign: 'center', borderBottom: `2px solid ${C.s900}`, paddingBottom: 20, marginBottom: sp }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: C.s900, letterSpacing: -0.5, margin: 0 }}>
        {data.personalInfo.fullName || 'Your Name'}
      </h1>
      <p style={{ fontSize: 13, fontStyle: 'italic', color: C.s700, margin: '4px 0 8px' }}>{data.personalInfo.title}</p>
      <div style={row({ justifyContent: 'center', flexWrap: 'wrap', gap: '4px 16px' })}>
        {data.personalInfo.email    && <span style={{ fontSize: 10, color: C.s600 }}>{data.personalInfo.email}</span>}
        {data.personalInfo.phone    && <span style={{ fontSize: 10, color: C.s600 }}>{data.personalInfo.phone}</span>}
        {data.personalInfo.location && <span style={{ fontSize: 10, color: C.s600 }}>{data.personalInfo.location}</span>}
        {data.personalInfo.linkedin && <span style={{ fontSize: 10, color: C.s600 }}>{data.personalInfo.linkedin}</span>}
      </div>
    </header>

    <div style={col({ gap: sp })}>
      {data.summary && (
        <section>
          <div style={{ borderBottom: `1px solid ${C.s900}`, marginBottom: 6 }}>
            <span style={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: C.s900 }}>Profile</span>
          </div>
          <p style={{ fontSize: 11, color: C.s800, lineHeight: lh, margin: 0 }}>{data.summary}</p>
        </section>
      )}

      {data.experience?.length > 0 && (
        <section>
          <div style={{ borderBottom: `1px solid ${C.s900}`, marginBottom: 8 }}>
            <span style={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: C.s900 }}>Experience</span>
          </div>
          <div style={col({ gap: 12 })}>
            {data.experience.map((e: any) => (
              <div key={e.id}>
                <div style={row({ justifyContent: 'space-between' })}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.s900 }}>{e.position} | {e.company}</span>
                  <span style={{ fontSize: 10, color: C.s600 }}>{e.startDate} – {e.endDate}</span>
                </div>
                <p style={{ fontSize: 10, color: C.s700, lineHeight: lh, whiteSpace: 'pre-wrap', margin: '4px 0 0' }}>{e.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div style={grid('1fr 1fr', { gap: 24 })}>
        {data.education?.length > 0 && (
          <section>
            <div style={{ borderBottom: `1px solid ${C.s900}`, marginBottom: 8 }}>
              <span style={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: C.s900 }}>Education</span>
            </div>
            {data.education.map((e: any) => (
              <div key={e.id} style={{ marginBottom: 8 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: C.s900, margin: 0 }}>{e.degree}</p>
                <p style={{ fontSize: 10, color: C.s700, margin: '2px 0 1px' }}>{e.institution}</p>
                <p style={{ fontSize: 9, fontStyle: 'italic', color: C.s600, margin: 0 }}>{e.startDate} – {e.endDate}</p>
              </div>
            ))}
          </section>
        )}
        {data.skills?.filter(Boolean).length > 0 && (
          <section>
            <div style={{ borderBottom: `1px solid ${C.s900}`, marginBottom: 8 }}>
              <span style={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: C.s900 }}>Core Expertise</span>
            </div>
            <p style={{ fontSize: 10, color: C.s700, lineHeight: 1.8, margin: 0 }}>
              {data.skills.filter(Boolean).join(' • ')}
            </p>
          </section>
        )}
      </div>
    </div>
  </div>
);

/* ══════════════════ 3. CREATIVE ═══════════════════════════════════ */
const CreativeTemplate = ({ data, sp, lh, theme }: TP) => (
  <div style={row({ minHeight: 1122, backgroundColor: C.white })}>
    {/* Sidebar */}
    <aside style={{ width: '33%', backgroundColor: C.s900, color: C.white, padding: '48px 28px', boxSizing: 'border-box' }}>
      <div style={{ textAlign: 'center', marginBottom: sp }}>
        <div style={{
          width: 80, height: 80, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 36, fontWeight: 900, color: theme, margin: '0 auto 12px', border: '1px solid rgba(255,255,255,0.1)'
        }}>
          {data.personalInfo.fullName?.charAt(0) || '?'}
        </div>
        <h2 style={{ fontSize: 17, fontWeight: 900, color: C.white, margin: 0, lineHeight: 1.3 }}>{data.personalInfo.fullName}</h2>
        <p style={{ fontSize: 8, fontWeight: 900, color: theme, textTransform: 'uppercase', letterSpacing: '0.15em', margin: '5px 0 0' }}>{data.personalInfo.title}</p>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 16, marginBottom: sp }}>
        <p style={{ fontSize: 8, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', color: C.s500, marginBottom: 8 }}>Contact</p>
        {[data.personalInfo.email, data.personalInfo.phone, data.personalInfo.location, data.personalInfo.linkedin].filter(Boolean).map((v: string, i: number) => (
          <p key={i} style={{ fontSize: 9, color: C.s300, margin: '0 0 4px', wordBreak: 'break-all' }}>{v}</p>
        ))}
      </div>

      {data.skills?.filter(Boolean).length > 0 && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 16, marginBottom: sp }}>
          <p style={{ fontSize: 8, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', color: C.s500, marginBottom: 8 }}>Expertise</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {data.skills.filter(Boolean).map((s: string, i: number) => (
              <span key={i} style={{ fontSize: 8, padding: '2px 6px', backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 4, color: C.s300, border: '1px solid rgba(255,255,255,0.05)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s}</span>
            ))}
          </div>
        </div>
      )}

      {data.education?.length > 0 && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 16 }}>
          <p style={{ fontSize: 8, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', color: C.s500, marginBottom: 8 }}>Education</p>
          {data.education.map((e: any) => (
            <div key={e.id} style={{ marginBottom: 10 }}>
              <p style={{ fontSize: 9, fontWeight: 800, color: C.white, margin: 0 }}>{e.degree}</p>
              <p style={{ fontSize: 9, color: C.s400, margin: '2px 0 1px' }}>{e.institution}</p>
              <p style={{ fontSize: 8, color: C.s600, margin: 0 }}>{e.startDate} – {e.endDate}</p>
            </div>
          ))}
        </div>
      )}
    </aside>

    {/* Main */}
    <main style={{ flex: 1, backgroundColor: C.white, padding: '48px 36px', boxSizing: 'border-box' }}>
      {data.summary && (
        <section style={{ marginBottom: sp }}>
          <p style={{ fontSize: 8, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', color: C.s400, marginBottom: 6 }}>Summary</p>
          <p style={{ fontSize: 10, color: C.s600, lineHeight: lh, margin: 0 }}>{data.summary}</p>
        </section>
      )}

      {data.experience?.length > 0 && (
        <section style={{ marginBottom: sp }}>
          <p style={{ fontSize: 8, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', color: C.s400, borderBottom: `1px solid ${C.s200}`, paddingBottom: 4, marginBottom: 12 }}>Work History</p>
          <div style={col({ gap: 14 })}>
            {data.experience.map((e: any) => (
              <div key={e.id} style={{ paddingLeft: 14, borderLeft: `2px solid ${theme}33`, position: 'relative' }}>
                <div style={{ position: 'absolute', left: -5, top: 2, width: 9, height: 9, borderRadius: '50%', backgroundColor: C.white, border: `2px solid ${theme}` }} />
                <div style={row({ justifyContent: 'space-between', alignItems: 'baseline' })}>
                  <span style={{ fontSize: 11, fontWeight: 900, color: C.s800 }}>{e.position}</span>
                  <span style={{ fontSize: 8, fontWeight: 700, color: C.s400, textTransform: 'uppercase' }}>{e.startDate} – {e.endDate}</span>
                </div>
                <p style={{ fontSize: 8, fontWeight: 900, color: theme, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '2px 0 4px' }}>{e.company}</p>
                <p style={{ fontSize: 10, color: C.s600, lineHeight: lh, margin: 0 }}>{e.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.projects?.length > 0 && (
        <section style={{ marginBottom: sp }}>
          <p style={{ fontSize: 8, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', color: C.s400, borderBottom: `1px solid ${C.s200}`, paddingBottom: 4, marginBottom: 12 }}>Projects</p>
          <div style={col({ gap: 10 })}>
            {data.projects.map((p: any) => (
              <div key={p.id}>
                <div style={row({ justifyContent: 'space-between' })}>
                  <span style={{ fontSize: 10, fontWeight: 900, color: C.s800 }}>{p.name}</span>
                  {p.link && <span style={{ fontSize: 9, color: C.s400 }}>{p.link}</span>}
                </div>
                <p style={{ fontSize: 10, color: C.s600, lineHeight: lh, margin: '3px 0 0' }}>{p.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  </div>
);

/* ══════════════════ 4. MINIMAL ════════════════════════════════════ */
const MinimalTemplate = ({ data, sp, lh }: TP) => (
  <div style={{ padding: '56px 60px', backgroundColor: C.white, fontFamily: 'inherit' }}>
    <header style={{ borderBottom: `1px solid ${C.s200}`, paddingBottom: 20, marginBottom: sp }}>
      <h1 style={{ fontSize: 28, fontWeight: 300, color: C.black, letterSpacing: -0.5, margin: 0 }}>
        {data.personalInfo.fullName || 'Your Name'}
      </h1>
      <p style={{ fontSize: 11, fontWeight: 600, color: C.s500, textTransform: 'uppercase', letterSpacing: '0.15em', margin: '5px 0 10px' }}>
        {data.personalInfo.title || 'Title'}
      </p>
      <div style={row({ flexWrap: 'wrap', gap: '3px 16px' })}>
        {[data.personalInfo.email, data.personalInfo.phone, data.personalInfo.location, data.personalInfo.linkedin].filter(Boolean).map((v: string, i: number) => (
          <span key={i} style={{ fontSize: 10, color: C.s400 }}>{v}</span>
        ))}
      </div>
    </header>

    <div style={grid('8fr 4fr', { gap: 28 })}>
      <div style={col({ gap: sp })}>
        {data.summary && (
          <section>
            <p style={{ fontSize: 8, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: C.s400, marginBottom: 6 }}>About</p>
            <p style={{ fontSize: 10, color: C.s600, lineHeight: lh, margin: 0 }}>{data.summary}</p>
          </section>
        )}
        {data.experience?.length > 0 && (
          <section>
            <p style={{ fontSize: 8, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: C.s400, borderBottom: `1px solid ${C.s100}`, paddingBottom: 4, marginBottom: 10 }}>Work Experience</p>
            <div style={col({ gap: 12 })}>
              {data.experience.map((e: any) => (
                <div key={e.id}>
                  <div style={row({ justifyContent: 'space-between', alignItems: 'baseline' })}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: C.s800 }}>{e.position}</span>
                    <span style={{ fontSize: 9, color: C.s400, textTransform: 'uppercase' }}>{e.startDate} – {e.endDate}</span>
                  </div>
                  <p style={{ fontSize: 9, color: C.s500, fontWeight: 600, margin: '2px 0 4px' }}>{e.company}</p>
                  <p style={{ fontSize: 10, color: C.s600, lineHeight: lh, margin: 0 }}>{e.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
        {data.projects?.length > 0 && (
          <section>
            <p style={{ fontSize: 8, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: C.s400, borderBottom: `1px solid ${C.s100}`, paddingBottom: 4, marginBottom: 10 }}>Projects</p>
            <div style={col({ gap: 10 })}>
              {data.projects.map((p: any) => (
                <div key={p.id}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: C.s800 }}>{p.name}</span>
                  {p.link && <span style={{ fontSize: 9, color: C.s400, marginLeft: 8 }}>{p.link}</span>}
                  <p style={{ fontSize: 10, color: C.s600, lineHeight: lh, margin: '3px 0 0' }}>{p.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <div style={col({ gap: sp })}>
        {data.skills?.filter(Boolean).length > 0 && (
          <section>
            <p style={{ fontSize: 8, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: C.s400, marginBottom: 6 }}>Skills</p>
            <p style={{ fontSize: 10, color: C.s600, lineHeight: 1.9, margin: 0 }}>{data.skills.filter(Boolean).join(', ')}</p>
          </section>
        )}
        {data.education?.length > 0 && (
          <section>
            <p style={{ fontSize: 8, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: C.s400, marginBottom: 8 }}>Education</p>
            {data.education.map((e: any) => (
              <div key={e.id} style={{ marginBottom: 8 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: C.s800, margin: 0 }}>{e.degree}</p>
                <p style={{ fontSize: 9, color: C.s500, margin: '2px 0 1px' }}>{e.institution}</p>
                <p style={{ fontSize: 9, color: C.s400, margin: 0 }}>{e.startDate} – {e.endDate}</p>
              </div>
            ))}
          </section>
        )}
        {data.certifications?.length > 0 && (
          <section>
            <p style={{ fontSize: 8, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: C.s400, marginBottom: 8 }}>Certifications</p>
            {data.certifications.map((c: any) => (
              <div key={c.id} style={{ marginBottom: 6 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: C.s800, margin: 0 }}>{c.name}</p>
                <p style={{ fontSize: 9, color: C.s500, margin: '1px 0' }}>{c.issuer}</p>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  </div>
);

/* ══════════════════ 5. CORPORATE ══════════════════════════════════ */
const CorporateTemplate = ({ data, sp, lh, theme }: TP) => (
  <div style={{ backgroundColor: C.white, fontFamily: 'inherit' }}>
    {/* Top bar */}
    <div style={{ backgroundColor: theme, padding: '28px 48px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 900, color: C.white, margin: 0, letterSpacing: -0.5 }}>{data.personalInfo.fullName || 'Name'}</h1>
      <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '5px 0 0' }}>{data.personalInfo.title}</p>
    </div>
    {/* Contact strip */}
    <div style={{ backgroundColor: C.s900, padding: '8px 48px' }}>
      <div style={row({ gap: 24, flexWrap: 'wrap' })}>
        {[data.personalInfo.email, data.personalInfo.phone, data.personalInfo.location, data.personalInfo.linkedin].filter(Boolean).map((v: string, i: number) => (
          <span key={i} style={{ fontSize: 9, color: C.s400 }}>{v}</span>
        ))}
      </div>
    </div>

    <div style={{ padding: '32px 48px' }}>
      <div style={col({ gap: sp })}>
        {data.summary && (
          <section>
            <p style={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: theme, marginBottom: 6 }}>Profile Summary</p>
            <p style={{ fontSize: 10, color: C.s700, lineHeight: lh, margin: 0 }}>{data.summary}</p>
          </section>
        )}
        {data.experience?.length > 0 && (
          <section>
            <p style={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: theme, marginBottom: 8 }}>Professional Experience</p>
            <div style={col({ gap: 12 })}>
              {data.experience.map((e: any) => (
                <div key={e.id}>
                  <div style={row({ justifyContent: 'space-between', alignItems: 'baseline' })}>
                    <span style={{ fontSize: 11, fontWeight: 900, color: C.s800 }}>{e.position}</span>
                    <span style={{ fontSize: 9, color: C.s500, textTransform: 'uppercase' }}>{e.startDate} – {e.endDate}</span>
                  </div>
                  <p style={{ fontSize: 9, fontWeight: 900, color: C.s400, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '2px 0 4px' }}>{e.company}</p>
                  <p style={{ fontSize: 10, color: C.s600, lineHeight: lh, margin: 0 }}>{e.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
        <div style={grid('1fr 1fr', { gap: 24 })}>
          {data.education?.length > 0 && (
            <section>
              <p style={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: theme, marginBottom: 8 }}>Education</p>
              {data.education.map((e: any) => (
                <div key={e.id} style={row({ justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 })}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: C.s700 }}>{e.degree} — <span style={{ fontWeight: 400, color: C.s500 }}>{e.institution}</span></span>
                  <span style={{ fontSize: 9, color: C.s400 }}>{e.startDate}–{e.endDate}</span>
                </div>
              ))}
            </section>
          )}
          {data.skills?.filter(Boolean).length > 0 && (
            <section>
              <p style={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: theme, marginBottom: 8 }}>Core Skills</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {data.skills.filter(Boolean).map((s: string, i: number) => (
                  <span key={i} style={tag(C.s50, C.s700, C.s200)}>{s}</span>
                ))}
              </div>
            </section>
          )}
        </div>
        {data.projects?.length > 0 && (
          <section>
            <p style={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: theme, marginBottom: 8 }}>Key Projects</p>
            <div style={col({ gap: 10 })}>
              {data.projects.map((p: any) => (
                <div key={p.id}>
                  <div style={row({ justifyContent: 'space-between' })}>
                    <span style={{ fontSize: 10, fontWeight: 800, color: C.s800 }}>{p.name}</span>
                    {p.link && <span style={{ fontSize: 9, color: C.s400 }}>{p.link}</span>}
                  </div>
                  <p style={{ fontSize: 10, color: C.s600, lineHeight: lh, margin: '3px 0 0' }}>{p.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  </div>
);

/* ══════════════════ 6. TECH ═══════════════════════════════════════ */
const TechTemplate = ({ data, sp, lh }: TP) => (
  <div style={{ padding: '44px 48px', backgroundColor: '#f9fafb', fontFamily: "'Courier New', monospace" }}>
    <header style={{ borderBottom: '1px dashed #d1d5db', paddingBottom: 16, marginBottom: sp }}>
      <div style={row({ justifyContent: 'space-between', alignItems: 'flex-start' })}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 900, color: C.black, margin: 0 }}>
            {`const candidate = "${data.personalInfo.fullName || 'Name'}";`}
          </h1>
          <p style={{ fontSize: 10, color: C.s500, fontWeight: 700, margin: '3px 0 0' }}>
            {`// Role: ${data.personalInfo.title || 'N/A'}`}
          </p>
        </div>
        <span style={{ fontSize: 8, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', backgroundColor: C.black, color: C.white, padding: '3px 8px', borderRadius: 4 }}>Tech Layout</span>
      </div>
      <div style={grid('1fr 1fr', { gap: '4px 20px', marginTop: 10, borderTop: '1px dashed #e5e7eb', paddingTop: 8 })}>
        {data.personalInfo.email    && <p style={{ fontSize: 9, color: C.s600, margin: 0 }}>{`email: "${data.personalInfo.email}"`}</p>}
        {data.personalInfo.phone    && <p style={{ fontSize: 9, color: C.s600, margin: 0 }}>{`phone: "${data.personalInfo.phone}"`}</p>}
        {data.personalInfo.github   && <p style={{ fontSize: 9, color: C.s600, margin: 0 }}>{`github: "${data.personalInfo.github}"`}</p>}
        {data.personalInfo.linkedin && <p style={{ fontSize: 9, color: C.s600, margin: 0 }}>{`linkedin: "${data.personalInfo.linkedin}"`}</p>}
      </div>
    </header>

    <div style={col({ gap: sp })}>
      {data.summary && (
        <section>
          <p style={{ fontSize: 9, fontWeight: 700, color: C.s400, margin: '0 0 4px' }}>{'/** About **/'}</p>
          <p style={{ fontSize: 10, color: C.s700, lineHeight: lh, margin: 0 }}>{data.summary}</p>
        </section>
      )}
      {data.skills?.filter(Boolean).length > 0 && (
        <section>
          <p style={{ fontSize: 9, fontWeight: 700, color: C.s400, margin: '0 0 4px' }}>{'/** Skills **/'}</p>
          <p style={{ fontSize: 10, color: C.s700, lineHeight: 1.8, margin: 0 }}>
            {`[ ${data.skills.filter(Boolean).map((s: string) => `"${s}"`).join(', ')} ]`}
          </p>
        </section>
      )}
      {data.experience?.length > 0 && (
        <section>
          <p style={{ fontSize: 9, fontWeight: 700, color: C.s400, margin: '0 0 8px' }}>{'/** Work Experience **/'}</p>
          <div style={col({ gap: 12 })}>
            {data.experience.map((e: any) => (
              <div key={e.id} style={{ fontSize: 10 }}>
                <p style={{ fontWeight: 700, color: C.black, margin: 0 }}>{`* ${e.position} @ ${e.company} (${e.startDate} – ${e.endDate})`}</p>
                <p style={{ color: C.s600, lineHeight: lh, margin: '3px 0 0', paddingLeft: 12 }}>{e.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
      {data.projects?.length > 0 && (
        <section>
          <p style={{ fontSize: 9, fontWeight: 700, color: C.s400, margin: '0 0 8px' }}>{'/** Projects **/'}</p>
          <div style={col({ gap: 10 })}>
            {data.projects.map((p: any) => (
              <div key={p.id} style={{ fontSize: 10 }}>
                <p style={{ fontWeight: 700, color: C.black, margin: 0 }}>{`> ${p.name}${p.link ? ` // ${p.link}` : ''}`}</p>
                <p style={{ color: C.s600, lineHeight: lh, margin: '3px 0 0', paddingLeft: 12 }}>{p.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
      <div style={grid('1fr 1fr', { gap: 24 })}>
        {data.education?.length > 0 && (
          <section>
            <p style={{ fontSize: 9, fontWeight: 700, color: C.s400, margin: '0 0 8px' }}>{'/** Education **/'}</p>
            {data.education.map((e: any) => (
              <div key={e.id} style={{ fontSize: 9, marginBottom: 8 }}>
                <p style={{ fontWeight: 700, color: C.s900, margin: 0 }}>{e.degree}</p>
                <p style={{ color: C.s600, margin: '2px 0' }}>{e.institution}</p>
                <p style={{ color: C.s500, margin: 0 }}>{e.startDate} – {e.endDate}</p>
              </div>
            ))}
          </section>
        )}
        {data.certifications?.length > 0 && (
          <section>
            <p style={{ fontSize: 9, fontWeight: 700, color: C.s400, margin: '0 0 8px' }}>{'/** Certs **/'}</p>
            {data.certifications.map((c: any) => (
              <div key={c.id} style={{ fontSize: 9, marginBottom: 6 }}>
                <p style={{ fontWeight: 700, color: C.s900, margin: 0 }}>{c.name}</p>
                <p style={{ color: C.s500, margin: '1px 0' }}>{c.issuer}</p>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  </div>
);

export default ResumePreview;
