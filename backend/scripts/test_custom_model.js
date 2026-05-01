const predictor = require('../utils/predictor');

const testCases = [
    { exam: 'CUET PG (MCA)', marks: 250 },
    { exam: 'NIMCET', marks: 550 },
    { exam: 'JEE Mains', marks: 140 },
    { exam: 'Unknown Exam', marks: 100 }
];

console.log('--- Custom Model Test Results ---');
testCases.forEach(tc => {
    const res = predictor.predictLocal(tc.exam, tc.marks);
    if (res) {
        console.log(`PASS: ${tc.exam} at ${tc.marks} marks -> Rank: ${res.predictedRank || res.rank}, Percentile: ${res.predictedPercentile || res.percentile} (${res.confidence})`);
    } else {
        console.log(`SKIP: No local data for ${tc.exam}`);
    }
});
