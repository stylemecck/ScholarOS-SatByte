const { EXAM_CONFIG } = require('../utils/examConfig');

/**
 * Service to handle production-grade percentile and rank calculations.
 */
class PercentileService {
  
  /**
   * Calculate percentile based on exam type and marks.
   * @param {string} examName 
   * @param {number} marks 
   * @returns {Object} { percentile, type, error? }
   */
  getPercentile(examName, marks) {
    const config = EXAM_CONFIG.find(e => e.name === examName);
    
    if (!config) {
      return { error: `Exam '${examName}' is not supported.` };
    }

    if (marks < 0) {
      return { error: 'Marks cannot be negative.' };
    }

    if (marks > config.maxMarks) {
      return { error: `Marks (${marks}) exceed maximum allowed marks (${config.maxMarks}) for ${examName}.` };
    }

    let percentile = 0;

    if (config.type === 'direct') {
      percentile = (marks / config.maxMarks) * 100;
    } else if (config.type === 'scaled') {
      percentile = this._calculateScaledPercentile(config, marks);
    }

    return {
      percentile: parseFloat(percentile.toFixed(4)),
      type: config.type,
      estimatedRank: this.estimateRank(config, percentile)
    };
  }

  /**
   * Internal helper for scaled score interpolation.
   * Uses historical normalization data to map marks to percentile.
   */
  _calculateScaledPercentile(config, marks) {
    const data = config.normalizationData;
    if (!data) return (marks / config.maxMarks) * 100; // Fallback

    // Sort normalization points by marks
    const points = Object.entries(data)
      .map(([p, m]) => ({ p: parseFloat(p), m }))
      .sort((a, b) => a.m - b.m);

    // Add boundaries if missing
    if (points[0].m > 0) points.unshift({ p: 0, m: 0 });
    if (points[points.length - 1].m < config.maxMarks) {
        points.push({ p: 99.99, m: config.maxMarks });
    }

    // Linear interpolation
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      
      if (marks >= p1.m && marks <= p2.m) {
        const ratio = (marks - p1.m) / (p2.m - p1.m);
        return p1.p + (p2.p - p1.p) * ratio;
      }
    }

    return points[points.length - 1].p;
  }

  /**
   * Estimate rank based on percentile and total candidates.
   */
  estimateRank(config, percentile) {
    if (!config.totalCandidates) return null;

    // Check specific bands first
    if (config.bands) {
      for (const band of config.bands) {
        if (percentile >= band.minPercentile) {
          return band.rankRange;
        }
      }
    }

    // Mathematical estimation: Rank = Total * (1 - Percentile/100)
    const rawRank = Math.ceil(config.totalCandidates * (1 - percentile / 100));
    const range = Math.max(10, Math.ceil(rawRank * 0.1));
    return `${rawRank - range}-${rawRank + range}`;
  }
}

module.exports = new PercentileService();
