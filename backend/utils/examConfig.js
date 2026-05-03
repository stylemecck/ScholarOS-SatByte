/**
 * Production-grade exam configurations for SatByte AI Rank Predictor.
 * Includes metadata for direct and scaled scoring systems.
 */

const EXAM_CONFIG = [
  { 
    name: 'CUET PG (MCA)', 
    maxMarks: 300, 
    type: 'direct', 
    totalCandidates: 75000,
    bands: [
      { minPercentile: 99, rankRange: '1-200' },
      { minPercentile: 95, rankRange: '201-1000' },
      { minPercentile: 90, rankRange: '1001-2500' },
      { minPercentile: 80, rankRange: '2501-6000' }
    ]
  },
  { name: 'CUET UG', maxMarks: 800, type: 'direct', totalCandidates: 1500000 },
  { 
    name: 'NIMCET', 
    maxMarks: 1000, 
    type: 'direct', 
    totalCandidates: 13000,
    bands: [
      { minPercentile: 99.5, rankRange: '1-100' },
      { minPercentile: 98, rankRange: '101-300' },
      { minPercentile: 95, rankRange: '301-800' },
      { minPercentile: 90, rankRange: '801-1500' }
    ]
  },
  { name: 'MAH MCA CET', maxMarks: 200, type: 'direct', totalCandidates: 45000 },
  { name: 'WBJECA', maxMarks: 120, type: 'direct', totalCandidates: 15000 },
  { name: 'TANCET', maxMarks: 100, type: 'direct', totalCandidates: 35000 },
  { 
    name: 'JEE Mains', 
    maxMarks: 300, 
    type: 'scaled', 
    totalCandidates: 1400000, 
    normalizationData: { "99.9": 260, "99": 185, "95": 120, "90": 95, "80": 70 },
    bands: [
      { minPercentile: 99.9, rankRange: '1-1400' },
      { minPercentile: 99, rankRange: '1401-14000' },
      { minPercentile: 95, rankRange: '14001-70000' }
    ]
  },
  { name: 'JEE Advanced', maxMarks: 360, type: 'direct', totalCandidates: 180000 },
  { name: 'BITSAT', maxMarks: 390, type: 'direct', totalCandidates: 300000 },
  { name: 'VITEEE', maxMarks: 125, type: 'direct', totalCandidates: 250000 },
  { name: 'SRMJEEE', maxMarks: 125, type: 'direct', totalCandidates: 150000 },
  { name: 'COMEDK', maxMarks: 180, type: 'direct', totalCandidates: 80000 },
  { name: 'NEET UG', maxMarks: 720, type: 'direct', totalCandidates: 2500000 },
  { name: 'NEET PG', maxMarks: 800, type: 'direct', totalCandidates: 200000 },
  { name: 'GATE', maxMarks: 100, type: 'scaled', totalCandidates: 105000, normalizationData: { "99": 75, "95": 55, "90": 45, "80": 35 } },
  { name: 'JAM', maxMarks: 100, type: 'direct', totalCandidates: 70000 },
  { 
    name: 'CAT', 
    maxMarks: 228, 
    type: 'scaled', 
    totalCandidates: 290000, 
    normalizationData: { "99": 105, "95": 75, "90": 60, "80": 45, "50": 25 },
    bands: [
      { minPercentile: 99.9, rankRange: '1-300' },
      { minPercentile: 99, rankRange: '301-3000' },
      { minPercentile: 95, rankRange: '3001-15000' }
    ]
  },
  { name: 'XAT', maxMarks: 100, type: 'scaled', totalCandidates: 100000, normalizationData: { "99": 45, "95": 35, "90": 30, "80": 25 } },
  { name: 'MAT', maxMarks: 200, type: 'direct', totalCandidates: 50000 },
  { name: 'CMAT', maxMarks: 400, type: 'direct', totalCandidates: 70000 },
  { name: 'CLAT', maxMarks: 150, type: 'direct', totalCandidates: 60000 },
  { name: 'LSAT', maxMarks: 100, type: 'scaled', totalCandidates: 30000, normalizationData: { "99": 90, "95": 80, "90": 75, "80": 65 } },
  { name: 'NDA', maxMarks: 900, type: 'direct', totalCandidates: 400000 },
  { name: 'CDS', maxMarks: 300, type: 'direct', totalCandidates: 200000 },
  { name: 'SSC CGL', maxMarks: 200, type: 'direct', totalCandidates: 2500000 },
  { name: 'UPSC Prelims', maxMarks: 200, type: 'direct', totalCandidates: 1000000 },
  { name: 'IPU CET', maxMarks: 400, type: 'direct', totalCandidates: 50000 }
];

module.exports = { EXAM_CONFIG };
