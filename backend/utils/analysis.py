import json
import sys
import os

def load_data():
    base_path = os.path.dirname(os.path.abspath(__file__))
    try:
        with open(os.path.join(base_path, 'examData.json'), 'r') as f:
            exams = json.load(f).get('exams', {})
        with open(os.path.join(base_path, 'historicalData.json'), 'r') as f:
            historical = json.load(f)
        with open(os.path.join(base_path, 'collegeData.json'), 'r') as f:
            colleges = json.load(f)
        return exams, historical, colleges
    except Exception as e:
        print(json.dumps({"error": f"Could not load data: {str(e)}"}))
        sys.exit(1)

def interpolate_value(marks, sorted_data, key):
    """Precise linear interpolation between two data points."""
    if marks >= sorted_data[-1]['marks']:
        return sorted_data[-1].get(key)
    if marks <= sorted_data[0]['marks']:
        return sorted_data[0].get(key)
    
    for i in range(len(sorted_data) - 1):
        p1, p2 = sorted_data[i], sorted_data[i + 1]
        if p1['marks'] <= marks <= p2['marks']:
            if p2['marks'] == p1['marks']:
                return p1.get(key)
            ratio = (marks - p1['marks']) / (p2['marks'] - p1['marks'])
            try:
                v1 = float(p1.get(key, 0))
                v2 = float(p2.get(key, 0))
                return round(v1 + (v2 - v1) * ratio, 2)
            except (ValueError, TypeError):
                return p2.get(key)
    return sorted_data[-1].get(key)

def interpolate_rank(marks, sorted_data):
    """Interpolate a rank range string."""
    if marks >= sorted_data[-1]['marks']:
        return sorted_data[-1].get('rank', 'N/A')
    if marks <= sorted_data[0]['marks']:
        return sorted_data[0].get('rank', 'N/A')
    
    for i in range(len(sorted_data) - 1):
        p1, p2 = sorted_data[i], sorted_data[i + 1]
        if p1['marks'] <= marks <= p2['marks']:
            ratio = (marks - p1['marks']) / (p2['marks'] - p1['marks'])
            # Parse the rank ranges
            try:
                r1_parts = p1['rank'].replace('+', '').split('-')
                r2_parts = p2['rank'].replace('+', '').split('-')
                r1_low = int(r1_parts[0])
                r1_high = int(r1_parts[-1]) if len(r1_parts) > 1 else r1_low
                r2_low = int(r2_parts[0])
                r2_high = int(r2_parts[-1]) if len(r2_parts) > 1 else r2_low
                
                interp_low = int(r1_low + (r2_low - r1_low) * ratio)
                interp_high = int(r1_high + (r2_high - r1_high) * ratio)
                return f"{interp_low}-{interp_high}"
            except (ValueError, IndexError):
                return p2.get('rank', 'N/A')
    return sorted_data[-1].get('rank', 'N/A')

def get_admission_chances(percentile, exam_name):
    """Determine admission chances based on percentile."""
    if percentile >= 97:
        return "Very High"
    elif percentile >= 92:
        return "High"
    elif percentile >= 82:
        return "Moderate"
    elif percentile >= 65:
        return "Low"
    else:
        return "Very Low"

def get_performance_level(percentile):
    if percentile >= 97: return "Outstanding"
    if percentile >= 92: return "Excellent"
    if percentile >= 82: return "Very Good"
    if percentile >= 70: return "Good"
    if percentile >= 55: return "Average"
    if percentile >= 35: return "Below Average"
    return "Needs Significant Improvement"

def get_eligible_colleges(exam_name, marks, rank_str, percentile, colleges_data, category="General"):
    """Get colleges the student is eligible for, with fee and cutoff details."""
    colleges = colleges_data.get(exam_name, [])
    if not colleges:
        return []
    
    m = float(marks)
    p = float(percentile) if percentile else 0
    
    # Parse rank
    r = 999999
    if rank_str:
        import re
        nums = re.findall(r'\d+', str(rank_str))
        if nums:
            r = int(nums[0])
    
    eligible = []
    for c in colleges:
        matched = False
        if c.get('minMarks') and m >= c['minMarks']:
            matched = True
        elif c.get('maxRank') and r <= c['maxRank']:
            matched = True
        elif c.get('percentile') and p >= c['percentile']:
            matched = True
        
        if matched:
            # Calculate cutoff range: spot/round3 as low end, round1 as high end
            base_cutoff = c.get('minMarks') or c.get('maxRank') or c.get('percentile', 0)
            if c.get('minMarks'):
                # Marks-based: spot cutoff ~70% of round1, so range is lower-upper
                cutoff_low = round(base_cutoff * 0.70)
                cutoff_high = base_cutoff
                cutoff_range = f"{cutoff_low}-{cutoff_high}"
            elif c.get('maxRank'):
                # Rank-based: spot rank ~1.5x of round1
                cutoff_low = base_cutoff
                cutoff_high = round(base_cutoff * 1.5)
                cutoff_range = f"{cutoff_low}-{cutoff_high}"
            elif c.get('percentile'):
                cutoff_low = round(base_cutoff - 1.5, 1)
                cutoff_high = base_cutoff
                cutoff_range = f"{cutoff_low}-{cutoff_high}"
            else:
                cutoff_range = str(base_cutoff)

            detail = {
                "name": c['name'],
                "branch": c.get('branch', 'N/A'),
                "fee": f"₹{c['fee']:,}/year" if c.get('fee') else "Contact university",
                "cutoffRange": cutoff_range,
                "cutoffGeneral": base_cutoff,
            }
            # Add category-wise cutoffs as ranges
            cat_cutoffs = c.get('categoryWiseCutoff', {})
            if cat_cutoffs:
                cat_ranges = {}
                for cat_name, val in cat_cutoffs.items():
                    low = round(val * 0.70)
                    cat_ranges[cat_name] = f"{low}-{val}"
                detail['categoryWiseCutoff'] = cat_ranges
                # Show the user's specific category cutoff as range
                if category in cat_cutoffs:
                    user_val = cat_cutoffs[category]
                    user_low = round(user_val * 0.70)
                    detail['yourCategoryCutoff'] = f"{user_low}-{user_val}"
            
            # Add location/campus
            if c.get('campus'):
                detail['location'] = c['campus']
            
            # Add placement and seat info
            if c.get('placementAvg'):
                detail['avgPlacement'] = c['placementAvg']
            if c.get('seats'):
                detail['totalSeats'] = c['seats']
            if c.get('naac'):
                detail['naacGrade'] = c['naac']
            if c.get('topRecruiters'):
                detail['topRecruiters'] = c['topRecruiters'][:3]
            if c.get('website'):
                detail['website'] = c['website']
            if c.get('hostel') is not None:
                detail['hostelAvailable'] = c['hostel']
            if c.get('note'):
                detail['note'] = c['note']
            
            eligible.append(detail)
    
    return eligible[:8]

def get_historical_analysis(exam_name, marks, historical):
    """Generate a rich historical analysis."""
    hist = historical.get(exam_name, {})
    if not hist:
        return None
    
    analysis = {}
    
    # Total candidates trend
    candidates = hist.get('totalCandidates', {})
    if candidates:
        years = sorted(candidates.keys())
        if len(years) >= 2:
            first_year_count = candidates[years[0]]
            last_year_count = candidates[years[-1]]
            growth = round(((last_year_count - first_year_count) / first_year_count) * 100, 1)
            analysis['competitionTrend'] = f"Total candidates grew from {first_year_count:,} ({years[0]}) to {last_year_count:,} ({years[-1]}), a {growth}% increase."
            analysis['totalCandidates2026'] = last_year_count
    
    # Year-wise cutoffs for specific colleges
    cutoffs = hist.get('yearWiseCutoffs', hist.get('yearWiseClosingRanks', {}))
    if cutoffs:
        analysis['collegeTrends'] = {}
        for college, years_data in cutoffs.items():
            years = sorted(years_data.keys())
            if len(years) >= 3:
                recent = years_data.get(years[-1], 0)
                avg = round(sum(years_data.values()) / len(years_data), 1)
                analysis['collegeTrends'][college] = {
                    "latest": recent,
                    "average10Year": avg,
                    "trend": "Rising" if recent > avg else "Stable"
                }
    
    # Category relaxation
    relaxation = hist.get('categoryRelaxation', {})
    if relaxation:
        analysis['categoryRelaxation'] = relaxation
    
    # Branches
    branches = hist.get('branches', [])
    if branches:
        analysis['availableBranches'] = branches
    
    # Trend note
    note = hist.get('trendNote', '')
    if note:
        analysis['expertNote'] = note
    
    # Total seats
    seats = hist.get('totalSeats', 0)
    if seats:
        analysis['totalSeats'] = seats
    
    return analysis

def get_spot_round_chances(marks, rank_str, exam_name, historical):
    """Analyze spot round and multi-round counseling chances."""
    hist = historical.get(exam_name, {})
    spot_data = hist.get('spotRound', {})
    
    if not spot_data:
        return None
    
    m = float(marks)
    
    # Parse rank for NIMCET-style data
    import re
    r = 999999
    if rank_str:
        nums = re.findall(r'\d+', str(rank_str))
        if nums:
            r = int(nums[0])
    
    # Determine if we use marks-based (CUET) or rank-based (NIMCET) cutoffs
    cutoff_key = 'spotCutoffs' if 'spotCutoffs' in spot_data else 'spotClosingRanks'
    cutoff_data = spot_data.get(cutoff_key, {})
    is_rank_based = cutoff_key == 'spotClosingRanks'
    
    round_chances = {"round1": [], "round2": [], "round3": [], "spot": []}
    
    for college, rounds in cutoff_data.items():
        if is_rank_based:
            # For rank-based: lower rank = better, so student rank must be <= closing rank
            if r <= rounds.get('round1', 0): round_chances['round1'].append(college)
            elif r <= rounds.get('round2', 0): round_chances['round2'].append(college)
            elif r <= rounds.get('round3', 0): round_chances['round3'].append(college)
            elif r <= rounds.get('spot', 0): round_chances['spot'].append(college)
        else:
            # For marks-based: higher marks = better, so student marks must be >= cutoff
            if m >= rounds.get('round1', 9999): round_chances['round1'].append(college)
            elif m >= rounds.get('round2', 9999): round_chances['round2'].append(college)
            elif m >= rounds.get('round3', 9999): round_chances['round3'].append(college)
            elif m >= rounds.get('spot', 9999): round_chances['spot'].append(college)
    
    result = {
        "description": spot_data.get('description', ''),
        "tip": spot_data.get('tip', ''),
        "roundWiseChances": round_chances,
        "summary": {}
    }
    
    # Generate summary
    total_eligible = sum(len(v) for v in round_chances.values())
    if round_chances['round1']:
        result['summary']['bestCase'] = f"You can secure {', '.join(round_chances['round1'][:2])} in Round 1 itself."
    if round_chances['round2']:
        result['summary']['round2'] = f"In Round 2, you may also get: {', '.join(round_chances['round2'][:2])}."
    if round_chances['round3']:
        result['summary']['round3'] = f"In Round 3, additional options: {', '.join(round_chances['round3'][:2])}."
    if round_chances['spot']:
        result['summary']['spotRound'] = f"In Spot Round, you have a chance at: {', '.join(round_chances['spot'][:3])}. Don't miss the spot round registration!"
    
    if total_eligible == 0:
        result['summary']['note'] = "Your current score/rank may not qualify for any listed college even in spot rounds. Consider preparing for the next cycle."
    
    return result


def get_difficulty_analysis(marks, exam_name, year, historical):
    """Analyze performance relative to paper difficulty."""
    hist = historical.get(exam_name, {})
    difficulty_data = hist.get('paperDifficulty', {})
    max_marks = hist.get('maxMarks', 300)
    
    if not difficulty_data:
        return None
    
    current_year = str(year)
    current_diff = difficulty_data.get(current_year, {})
    
    # Calculate 10-year average difficulty and average marks
    all_levels = [v['level'] for v in difficulty_data.values()]
    all_avg_marks = [v['avgMarks'] for v in difficulty_data.values()]
    avg_difficulty = round(sum(all_levels) / len(all_levels), 1)
    avg_marks_overall = round(sum(all_avg_marks) / len(all_avg_marks), 1)
    
    current_level = current_diff.get('level', avg_difficulty)
    current_label = current_diff.get('label', 'Unknown')
    current_avg = current_diff.get('avgMarks', avg_marks_overall)
    
    # How much above/below average the student scored
    marks_vs_avg = round(marks - current_avg, 1)
    marks_vs_avg_pct = round((marks / current_avg - 1) * 100, 1) if current_avg > 0 else 0
    
    # Difficulty-adjusted score: normalize to a "Moderate" baseline (level 5)
    # If paper was tough (level 7), your marks are worth MORE
    # If paper was easy (level 3), your marks are worth LESS
    normalization_factor = current_level / 5.0  # >1 = tough, <1 = easy
    adjusted_marks = round(marks * normalization_factor, 1)
    
    # Historical comparison: find years with similar difficulty
    similar_years = []
    for yr, data in difficulty_data.items():
        if abs(data['level'] - current_level) <= 1 and yr != current_year:
            similar_years.append({
                "year": yr,
                "difficulty": data['label'],
                "avgMarks": data['avgMarks']
            })
    
    result = {
        "currentYear": {
            "year": current_year,
            "difficultyLevel": f"{current_level}/10",
            "difficultyLabel": current_label,
            "avgMarksScored": current_avg
        },
        "10YearAvgDifficulty": f"{avg_difficulty}/10",
        "10YearAvgMarks": avg_marks_overall,
        "yourPerformance": {
            "marksScored": marks,
            "vsAverage": f"{'+' if marks_vs_avg >= 0 else ''}{marks_vs_avg} marks ({'+' if marks_vs_avg_pct >= 0 else ''}{marks_vs_avg_pct}%)",
            "normalizedScore": adjusted_marks,
            "verdict": "Above Average" if marks > current_avg else ("Average" if abs(marks - current_avg) < current_avg * 0.1 else "Below Average")
        },
        "paperInsight": "",
        "similarYears": similar_years[:3]
    }
    
    # Generate paper insight text
    if current_level >= 7:
        if marks > current_avg:
            result['paperInsight'] = f"The {current_year} paper was {current_label} (difficulty {current_level}/10). Scoring {marks} marks on a tough paper is impressive — your normalized score equivalent on a moderate paper would be ~{adjusted_marks} marks."
        else:
            result['paperInsight'] = f"The {current_year} paper was {current_label} (difficulty {current_level}/10). The average score was only {current_avg} marks, so your score of {marks} is understandable. On an easier paper, cutoffs would have been higher."
    elif current_level <= 4:
        if marks > current_avg:
            result['paperInsight'] = f"The {current_year} paper was {current_label} (difficulty {current_level}/10). While your score of {marks} is good, note that the easy paper inflated scores — your normalized equivalent is ~{adjusted_marks} marks."
        else:
            result['paperInsight'] = f"The {current_year} paper was {current_label} (difficulty {current_level}/10). Scoring below the average of {current_avg} on an easier paper suggests areas for improvement."
    else:
        result['paperInsight'] = f"The {current_year} paper was {current_label} (difficulty {current_level}/10) with an average score of {current_avg}. Your score of {marks} puts you {'above' if marks > current_avg else 'near'} the average."
    
    return result

def generate_analysis_text(marks, percentile, rank, exam_name, historical_analysis, eligible_colleges, difficulty_analysis=None):
    """Generate a human-readable analysis paragraph."""
    parts = []
    
    perf = get_performance_level(percentile)
    parts.append(f"With {marks} marks, you achieve approximately {percentile}% percentile, placing you in the '{perf}' category.")
    
    if rank:
        parts.append(f"Your estimated All India Rank is {rank}.")
    
    # Difficulty insight (most important new addition)
    if difficulty_analysis:
        parts.append(difficulty_analysis.get('paperInsight', ''))
        perf_data = difficulty_analysis.get('yourPerformance', {})
        verdict = perf_data.get('verdict', '')
        vs_avg = perf_data.get('vsAverage', '')
        if verdict and vs_avg:
            parts.append(f"Your performance relative to the average: {verdict} ({vs_avg}).")
    
    if historical_analysis:
        total = historical_analysis.get('totalCandidates2026', 0)
        if total:
            better_than = round(percentile / 100 * total)
            parts.append(f"You are estimated to be ahead of approximately {better_than:,} out of {total:,} candidates in 2026.")
        
        trend = historical_analysis.get('competitionTrend', '')
        if trend:
            parts.append(trend)
        
        note = historical_analysis.get('expertNote', '')
        if note:
            parts.append(f"Expert Note: {note}")
    
    if eligible_colleges:
        names = [c['name'] for c in eligible_colleges[:3]]
        parts.append(f"Top eligible institutions include: {', '.join(names)}.")
    
    return ' '.join(parts)

def main():
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Usage: python analysis.py <exam> <marks> [category] [year]"}))
        sys.exit(1)
    
    exam_name = sys.argv[1]
    try:
        marks = float(sys.argv[2])
    except ValueError:
        print(json.dumps({"error": "Invalid marks value"}))
        sys.exit(1)
    
    category = sys.argv[3] if len(sys.argv) > 3 else "General"
    year = sys.argv[4] if len(sys.argv) > 4 else "2026"
    user_total_marks = float(sys.argv[5]) if len(sys.argv) > 5 else None
    
    exam_data_all, historical_data_all, colleges_data = load_data()
    exam_data = exam_data_all.get(exam_name)
    
    if not exam_data:
        print(json.dumps({"error": f"Exam '{exam_name}' not found. Supported: {', '.join(exam_data_all.keys())}"}))
        sys.exit(1)
    
    # Sort by marks ascending for interpolation
    sorted_data = sorted(exam_data, key=lambda x: x['marks'])
    
    # Max marks and Normalization logic
    hist_for_exam = historical_data_all.get(exam_name, {})
    historical_max = hist_for_exam.get('maxMarks', sorted_data[-1]['marks'] if sorted_data else 1000)
    
    # If user provided a different total marks, normalize the score to match historical scale
    original_marks = marks
    is_normalized = False
    if user_total_marks and abs(user_total_marks - historical_max) > 0.1:
        # Scale: (your_marks / your_total) * historical_total
        marks = round((marks / user_total_marks) * historical_max, 2)
        is_normalized = True

    if original_marks > (user_total_marks or historical_max):
        print(json.dumps({"error": f"Invalid marks: {original_marks} exceeds maximum allowed marks ({user_total_marks or historical_max}) for {exam_name}."}))
        sys.exit(1)
    
    # Core interpolation (using normalized marks if applicable)
    percentile = interpolate_value(marks, sorted_data, 'percentile')
    rank = interpolate_rank(marks, sorted_data)
    
    if percentile is None:
        percentile = 0
    percentile = float(percentile)
    
    # Paper difficulty analysis
    diff_analysis = get_difficulty_analysis(marks, exam_name, year, historical_data_all)
    
    # Admission chances
    chances = get_admission_chances(percentile, exam_name)
    
    # Performance level
    perf_level = get_performance_level(percentile)
    
    # Eligible colleges
    eligible = get_eligible_colleges(exam_name, marks, rank, percentile, colleges_data, category)
    
    # Historical analysis
    hist_analysis = get_historical_analysis(exam_name, marks, historical_data_all)
    
    # Spot round chances
    spot_analysis = get_spot_round_chances(marks, rank, exam_name, historical_data_all)
    
    # Generate analysis text (now includes difficulty)
    analysis_text = generate_analysis_text(marks, percentile, rank, exam_name, hist_analysis, eligible, diff_analysis)
    
    # Add spot round info to analysis text
    if spot_analysis:
        spot_summary = spot_analysis.get('summary', {})
        spot_parts = []
        for key in ['bestCase', 'round2', 'round3', 'spotRound']:
            if key in spot_summary:
                spot_parts.append(spot_summary[key])
        if spot_parts:
            analysis_text += ' COUNSELING ROUNDS: ' + ' '.join(spot_parts)
    
    # Build result
    result = {
        "predictedRank": rank,
        "predictedPercentile": str(percentile),
        "admissionChances": chances,
        "performanceLevel": perf_level,
        "suggestedColleges": [c['name'] for c in eligible[:5]],
        "collegeDetails": eligible[:5],
        "analysis": analysis_text,
        "confidence": "High (Local 10-Year Statistical Model)",
        "betterThan": f"{percentile}%",
        "paperDifficultyAnalysis": diff_analysis,
        "spotRoundAnalysis": spot_analysis,
        "historicalContext": hist_analysis,
        "category": category,
        "normalizationApplied": is_normalized,
        "normalizedMarks": marks if is_normalized else None,
        "originalMarks": original_marks
    }
    
    print(json.dumps(result))

if __name__ == "__main__":
    main()
