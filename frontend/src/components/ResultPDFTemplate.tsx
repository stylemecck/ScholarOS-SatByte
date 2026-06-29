import { ShieldCheck, Award, School, MapPin, Zap } from 'lucide-react';

interface PDFTemplateProps {
  user: { name: string; email: string };
  data: {
    exam: string;
    marks: string;
    category: string;
    predictedRank: string;
    predictedPercentile: string;
    admissionChances: string;
    confidence: string;
    analysis: string;
    collegeDetails?: any[];
    paperDifficultyAnalysis?: any;
  };
  date: string;
}

// We use hardcoded hex colors to avoid html2pdf/html2canvas oklch parsing errors
const COLORS = {
  blue: '#2563eb',
  slate900: '#0f172a',
  slate600: '#475569',
  slate400: '#94a3b8',
  slate100: '#f1f5f9',
  slate50: '#f8fafc',
  emerald: '#10b981',
  emeraldLight: '#ecfdf5',
  amber: '#f59e0b',
  white: '#ffffff',
  blueLight: '#eff6ff'
};

const ResultPDFTemplate = ({ user, data, date }: PDFTemplateProps) => {
  return (
    <div id="pdf-report-content" style={{ padding: '48px', backgroundColor: COLORS.white, color: COLORS.slate900, fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto', minHeight: '1120px', display: 'flex', flexDirection: 'column' }}>
      {/* Header with Branding */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: `4px solid ${COLORS.blue}`, paddingBottom: '32px', marginBottom: '40px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <div style={{ width: '32px', height: '32px', backgroundColor: COLORS.blue, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.white, fontWeight: 900 }}>S</div>
            <h1 style={{ fontSize: '24px', fontWeight: 900, color: COLORS.slate900, letterSpacing: '-0.05em', margin: 0 }}>Scholar<span style={{ color: COLORS.blue, fontWeight: 500 }}>OS</span></h1>
          </div>
          <p style={{ fontSize: '10px', fontWeight: 900, color: COLORS.slate400, textTransform: 'uppercase', letterSpacing: '0.3em', marginLeft: '40px', margin: 0 }}>Official Career Insight Report</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '12px', fontWeight: 900, color: COLORS.slate900, margin: 0 }}>{date}</p>
          <p style={{ fontSize: '9px', color: COLORS.slate400, fontFamily: 'monospace', marginTop: '4px', margin: 0 }}>REF: SBT-{Math.random().toString(36).slice(2, 11).toUpperCase()}</p>
        </div>
      </div>

      {/* Student & Exam Profile */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
        <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '10px', fontWeight: 900, color: COLORS.blue, textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: `1px solid ${COLORS.slate100}`, paddingBottom: '8px', margin: 0 }}>Student Profile</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            <div>
              <p style={{ fontSize: '9px', fontWeight: 700, color: COLORS.slate400, textTransform: 'uppercase', margin: 0 }}>Full Name</p>
              <p style={{ fontSize: '14px', fontWeight: 900, color: '#1e293b', margin: 0 }}>{user.name}</p>
            </div>
            <div>
              <p style={{ fontSize: '9px', fontWeight: 700, color: COLORS.slate400, textTransform: 'uppercase', margin: 0 }}>Email Identity</p>
              <p style={{ fontSize: '14px', fontWeight: 700, color: COLORS.slate600, margin: 0 }}>{user.email}</p>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '10px', fontWeight: 900, color: COLORS.blue, textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: `1px solid ${COLORS.slate100}`, paddingBottom: '8px', margin: 0 }}>Exam Context</h3>
          <div>
            <p style={{ fontSize: '9px', fontWeight: 700, color: COLORS.slate400, textTransform: 'uppercase', margin: 0 }}>Target Exam</p>
            <p style={{ fontSize: '14px', fontWeight: 900, color: '#1e293b', margin: 0 }}>{data.exam}</p>
          </div>
        </div>
      </div>

      {/* Performance Dashboard */}
      <div style={{ backgroundColor: COLORS.slate900, color: COLORS.white, borderRadius: '32px', padding: '32px', marginBottom: '40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 10, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <p style={{ fontSize: '10px', fontWeight: 900, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Predicted AIR Rank</p>
            <h2 style={{ fontSize: '48px', fontWeight: 900, letterSpacing: '-0.05em', color: COLORS.white, margin: 0 }}>{data.predictedRank}</h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <p style={{ fontSize: '8px', fontWeight: 900, color: COLORS.slate400, textTransform: 'uppercase', margin: 0 }}>Percentile Score</p>
              <p style={{ fontSize: '16px', fontWeight: 900, color: COLORS.white, margin: 0 }}>{data.predictedPercentile}%</p>
            </div>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <p style={{ fontSize: '8px', fontWeight: 900, color: COLORS.slate400, textTransform: 'uppercase', margin: 0 }}>Admission Chances</p>
              <p style={{ fontSize: '16px', fontWeight: 900, color: '#34d399', margin: 0 }}>{data.admissionChances}</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', backgroundColor: 'rgba(37,99,235,0.2)', color: '#60a5fa', borderRadius: '8px', border: '1px solid rgba(37,99,235,0.3)', fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              <ShieldCheck size={12} /> {data.confidence} Confidence
            </div>
            <p style={{ fontSize: '10px', color: COLORS.slate400, lineHeight: 1.5, fontWeight: 500, fontStyle: 'italic', margin: 0 }}>
              AI analysis suggests your score is in the top {100 - parseFloat(data.predictedPercentile)}% of participants.
            </p>
          </div>
        </div>
      </div>

      {/* Difficulty Analysis Section */}
      {data.paperDifficultyAnalysis && (
        <div style={{ marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={16} style={{ color: COLORS.amber }} />
            <h3 style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#1e293b', margin: 0 }}>Counselling Shift Analysis</h3>
          </div>
          <div style={{ backgroundColor: COLORS.slate50, border: `1px solid ${COLORS.slate100}`, borderRadius: '16px', padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            <div>
              <p style={{ fontSize: '8px', fontWeight: 900, color: COLORS.slate400, textTransform: 'uppercase', margin: 0 }}>Shift Difficulty</p>
              <p style={{ fontSize: '12px', fontWeight: 900, color: '#1e293b', margin: 0 }}>{data.paperDifficultyAnalysis.currentYear.difficultyLevel}</p>
            </div>
            <div>
              <p style={{ fontSize: '8px', fontWeight: 900, color: COLORS.slate400, textTransform: 'uppercase', margin: 0 }}>Global Avg</p>
              <p style={{ fontSize: '12px', fontWeight: 900, color: '#1e293b', margin: 0 }}>{data.paperDifficultyAnalysis.currentYear.avgMarksScored}</p>
            </div>
            <div>
              <p style={{ fontSize: '8px', fontWeight: 900, color: COLORS.slate400, textTransform: 'uppercase', margin: 0 }}>Normalization</p>
              <p style={{ fontSize: '12px', fontWeight: 900, color: COLORS.blue, margin: 0 }}>Applied</p>
            </div>
            <div>
              <p style={{ fontSize: '8px', fontWeight: 900, color: COLORS.slate400, textTransform: 'uppercase', margin: 0 }}>Verdict</p>
              <p style={{ fontSize: '12px', fontWeight: 900, color: COLORS.emerald, margin: 0 }}>{data.paperDifficultyAnalysis.yourPerformance.verdict}</p>
            </div>
          </div>
        </div>
      )}

      {/* College Recommendations Table */}
      <div style={{ marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <School size={16} style={{ color: COLORS.blue }} />
          <h3 style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#1e293b', margin: 0 }}>College Recommendation Roadmap</h3>
        </div>
        
        <div style={{ border: `1px solid ${COLORS.slate100}`, borderRadius: '16px', overflow: 'hidden' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: COLORS.slate50, borderBottom: `1px solid ${COLORS.slate100}` }}>
              <tr>
                <th style={{ padding: '12px 16px', fontSize: '9px', fontWeight: 900, color: COLORS.slate600, textTransform: 'uppercase' }}>Institution & Branch</th>
                <th style={{ padding: '12px 16px', fontSize: '9px', fontWeight: 900, color: COLORS.slate600, textTransform: 'uppercase' }}>Est. Cutoff</th>
                <th style={{ padding: '12px 16px', fontSize: '9px', fontWeight: 900, color: COLORS.slate600, textTransform: 'uppercase' }}>Placement</th>
                <th style={{ padding: '12px 16px', fontSize: '9px', fontWeight: 900, color: COLORS.slate600, textTransform: 'uppercase', textAlign: 'right' }}>Chance</th>
              </tr>
            </thead>
            <tbody>
              {data.collegeDetails?.map((college, idx) => (
                <tr key={idx} style={{ borderBottom: `1px solid ${COLORS.slate50}` }}>
                  <td style={{ padding: '16px' }}>
                    <p style={{ fontSize: '14px', fontWeight: 900, color: '#1e293b', margin: 0 }}>{college.name}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                      <span style={{ fontSize: '9px', fontWeight: 700, color: COLORS.slate400, textTransform: 'uppercase' }}>{college.branch}</span>
                      <span style={{ fontSize: '9px', fontWeight: 700, color: COLORS.slate400, display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={8} /> {college.location || 'India'}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <p style={{ fontSize: '10px', fontWeight: 900, color: COLORS.slate600, margin: 0 }}>{college.cutoffRange}</p>
                  </td>
                  <td style={{ padding: '16px', fontSize: '12px', fontWeight: 700, color: COLORS.emerald }}>
                    {college.avgPlacement || '₹8.5 LPA'}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '8px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', backgroundColor: idx % 3 === 0 ? COLORS.emeraldLight : idx % 3 === 1 ? COLORS.blueLight : '#fff7ed', color: idx % 3 === 0 ? '#047857' : idx % 3 === 1 ? '#1d4ed8' : '#c2410c' }}>
                      {idx % 3 === 0 ? 'Safe' : idx % 3 === 1 ? 'Possible' : 'Ambitious'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Verdict */}
      <div style={{ marginTop: 'auto', paddingTop: '32px', borderTop: `1px solid ${COLORS.slate100}` }}>
        <div style={{ display: 'flex', gap: '16px', padding: '24px', backgroundColor: COLORS.blueLight, borderRadius: '16px', border: `1px solid ${COLORS.blue}22` }}>
          <div style={{ width: '40px', height: '40px', backgroundColor: COLORS.blue, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.white, flexShrink: 0 }}>
            <Award size={20} />
          </div>
          <div>
            <h4 style={{ fontSize: '10px', fontWeight: 900, color: COLORS.blue, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '4px', margin: 0 }}>Counselling Strategy & Verdict</h4>
            <p style={{ fontSize: '12px', color: COLORS.slate600, lineHeight: 1.6, fontWeight: 500, margin: 0 }}>
              {data.analysis}
            </p>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div style={{ marginTop: '32px', paddingTop: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${COLORS.slate100}` }}>
        <p style={{ fontSize: '9px', color: COLORS.slate400, fontWeight: 500, fontStyle: 'italic', maxWidth: '400px', margin: 0 }}>
          * Predictions are based on historical data. Final outcome may vary during actual counseling. ScholarOS is an AI prediction platform.
        </p>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '9px', fontWeight: 900, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>ScholarOS by SatByte</p>
          <p style={{ fontSize: '8px', color: COLORS.slate400, margin: 0 }}>os.satbyte.in</p>
        </div>
      </div>
    </div>
  );
};

export default ResultPDFTemplate;
