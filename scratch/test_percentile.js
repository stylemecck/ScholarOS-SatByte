const percentileService = require('../backend/services/percentileService');

console.log('--- TEST: Direct Calculation (NIMCET) ---');
const nimcet = percentileService.getPercentile('NIMCET', 500); // 500/1000 = 50%
console.log('NIMCET 500/1000:', nimcet);

console.log('\n--- TEST: Scaled Calculation (CAT) ---');
// CAT normalization: p50: 25, p80: 45, p90: 60, p95: 75, p99: 105
const catMid = percentileService.getPercentile('CAT', 52.5); // Between p80(45) and p90(60) -> p85?
console.log('CAT 52.5 marks:', catMid);

const catHigh = percentileService.getPercentile('CAT', 105); // Exact p99
console.log('CAT 105 marks:', catHigh);

console.log('\n--- TEST: Error Handling ---');
console.log('Invalid Exam:', percentileService.getPercentile('Unknown', 100));
console.log('Negative Marks:', percentileService.getPercentile('NIMCET', -10));
console.log('Exceed Max Marks:', percentileService.getPercentile('GATE', 110));

console.log('\n--- TEST: Rank Estimation ---');
console.log('NIMCET p99.5:', percentileService.getPercentile('NIMCET', 995)); // High percentile
console.log('JEE Mains p99:', percentileService.getPercentile('JEE Mains', 185));
