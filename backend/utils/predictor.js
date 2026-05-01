const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'examData.json');
const collegePath = path.join(__dirname, 'collegeData.json');
let examData = {};
let collegeData = {};

try {
    const rawData = fs.readFileSync(dataPath, 'utf8');
    examData = JSON.parse(rawData).exams;
    
    const rawCollegeData = fs.readFileSync(collegePath, 'utf8');
    collegeData = JSON.parse(rawCollegeData);
} catch (err) {
    console.error('Error loading predictor data:', err);
}

/**
 * Predicts rank and percentile based on local historical data.
 * @param {string} exam Name of the exam
 * @param {number} marks Marks obtained
 * @returns {object|null} Prediction result or null if exam not found
 */
exports.predictLocal = (exam, marks) => {
    if (!exam || typeof exam !== 'string') return null;
    const normalizedExam = exam.trim();
    const data = examData[normalizedExam];

    if (!data) return null;

    // Convert marks to number
    const m = parseFloat(marks);
    if (isNaN(m)) return null;

    // Sort data by marks descending
    const sorted = [...data].sort((a, b) => b.marks - a.marks);

    // Find the range
    let upper = sorted[0];
    let lower = sorted[sorted.length - 1];

    if (m >= upper.marks) return { ...upper, confidence: 'High (Data-Matched)' };
    if (m <= lower.marks) return { ...lower, confidence: 'Moderate (Data-Extrapolated)' };

    for (let i = 0; i < sorted.length - 1; i++) {
        if (m <= sorted[i].marks && m >= sorted[i + 1].marks) {
            upper = sorted[i];
            lower = sorted[i + 1];
            break;
        }
    }

    // Interpolation (Optional: could just return the range of the closer one)
    // For now, we return the closer one's range or a combined range
    const diffUpper = upper.marks - m;
    const diffLower = m - lower.marks;

    if (diffUpper < diffLower) {
        return { 
            predictedRank: upper.rank, 
            predictedPercentile: upper.percentile, 
            confidence: 'High (Local Model)' 
        };
    } else {
        return { 
            predictedRank: lower.rank, 
            predictedPercentile: lower.percentile, 
            confidence: 'High (Local Model)' 
        };
    }
};

/**
 * Gets suggested colleges based on exam and score/rank
 */
exports.getSuggestions = (exam, marks, rank, percentile) => {
    const colleges = collegeData[exam];
    if (!colleges) return [];

    const m = parseFloat(marks);
    const p = parseFloat(percentile);
    
    // Parse rank to get the lower bound of the range
    let r = 999999;
    if (rank) {
        const matches = String(rank).match(/\d+/);
        if (matches) r = parseInt(matches[0]);
    }

    return colleges.filter(c => {
        if (c.minMarks && m >= c.minMarks) return true;
        if (c.maxRank && r <= c.maxRank) return true;
        if (c.percentile && p >= c.percentile) return true;
        return false;
    }).map(c => c.name).slice(0, 6);
};
