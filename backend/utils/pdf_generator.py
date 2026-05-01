import sys
import json
import os
from fpdf import FPDF
from datetime import datetime

class ReportPDF(FPDF):
    def header(self):
        # Logo placeholder (if we had one)
        self.set_font('helvetica', 'B', 20)
        self.set_text_color(59, 130, 246) # Primary blue
        self.cell(0, 10, 'Student Toolkit Pro', new_x="LMARGIN", new_y="NEXT", align='L')
        self.set_font('helvetica', '', 10)
        self.set_text_color(100, 100, 100)
        self.cell(0, 5, 'Official AI Rank & Counseling Report', new_x="LMARGIN", new_y="NEXT", align='L')
        self.ln(10)
        # Line break
        self.set_draw_color(200, 200, 200)
        self.line(10, 30, 200, 30)

    def footer(self):
        self.set_y(-15)
        self.set_font('helvetica', 'I', 8)
        self.set_text_color(150, 150, 150)
        self.cell(0, 10, f'Page {self.page_no()} | Generated on {datetime.now().strftime("%Y-%m-%d %H:%M")} | Powered by Student Toolkit Pro', align='C')

def generate_pdf(data):
    pdf = ReportPDF()
    pdf.add_page()
    
    # User & Exam Info
    pdf.set_font('helvetica', 'B', 14)
    pdf.set_text_color(0, 0, 0)
    pdf.cell(0, 10, f"Analysis for: {data.get('userName', 'Student')}", new_x="LMARGIN", new_y="NEXT")
    
    pdf.set_font('helvetica', '', 11)
    pdf.cell(50, 8, f"Exam: {data.get('exam', 'N/A')}", border=0)
    pdf.cell(50, 8, f"Category: {data.get('category', 'General')}", border=0)
    pdf.cell(50, 8, f"Score: {data.get('marks', 'N/A')}", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(5)

    # Summary Stats Box
    pdf.set_fill_color(249, 250, 251)
    pdf.rect(10, 60, 190, 30, 'F')
    
    pdf.set_xy(15, 65)
    pdf.set_font('helvetica', 'B', 10)
    pdf.set_text_color(100, 100, 100)
    pdf.cell(60, 5, 'PREDICTED RANK', align='C')
    pdf.cell(60, 5, 'PERCENTILE', align='C')
    pdf.cell(60, 5, 'ADMISSION CHANCES', align='C', new_x="LMARGIN", new_y="NEXT")
    
    pdf.set_x(15)
    pdf.set_font('helvetica', 'B', 16)
    pdf.set_text_color(59, 130, 246)
    pdf.cell(60, 10, str(data.get('predictedRank', 'N/A')), align='C')
    pdf.set_text_color(99, 102, 241)
    pdf.cell(60, 10, f"{data.get('predictedPercentile', 'N/A')}%", align='C')
    
    chance = data.get('admissionChances', 'N/A')
    if 'High' in chance: pdf.set_text_color(16, 185, 129)
    elif 'Moderate' in chance: pdf.set_text_color(245, 158, 11)
    else: pdf.set_text_color(239, 68, 68)
    pdf.cell(60, 10, chance, align='C', new_x="LMARGIN", new_y="NEXT")
    
    pdf.ln(15)

    # Paper Difficulty Section
    diff = data.get('paperDifficultyAnalysis', {})
    if diff:
        pdf.set_font('helvetica', 'B', 12)
        pdf.set_text_color(234, 88, 12) # Orange
        pdf.cell(0, 10, 'PAPER DIFFICULTY ANALYSIS', new_x="LMARGIN", new_y="NEXT")
        pdf.set_font('helvetica', '', 10)
        pdf.set_text_color(50, 50, 50)
        pdf.multi_cell(0, 6, diff.get('paperInsight', 'N/A'))
        pdf.ln(5)

    # College Suggestions Table
    colleges = data.get('collegeDetails', [])
    if colleges:
        pdf.set_font('helvetica', 'B', 12)
        pdf.set_text_color(59, 130, 246)
        pdf.cell(0, 10, 'TOP RECOMMENDED COLLEGES', new_x="LMARGIN", new_y="NEXT")
        
        # Table Header
        pdf.set_fill_color(59, 130, 246)
        pdf.set_text_color(255, 255, 255)
        pdf.set_font('helvetica', 'B', 9)
        pdf.cell(80, 8, 'College Name', border=1, fill=True)
        pdf.cell(35, 8, 'Location', border=1, fill=True)
        pdf.cell(25, 8, 'Fee/Year', border=1, fill=True)
        pdf.cell(30, 8, 'Cutoff Range', border=1, fill=True)
        pdf.cell(20, 8, 'NAAC', border=1, fill=True, new_x="LMARGIN", new_y="NEXT")
        
        # Table Body
        pdf.set_text_color(0, 0, 0)
        pdf.set_font('helvetica', '', 8)
        for c in colleges[:8]:
            # Handle long names
            name = c.get('name', 'N/A')
            if len(name) > 45: name = name[:42] + "..."
            
            pdf.cell(80, 7, name, border=1)
            pdf.cell(35, 7, c.get('location', 'N/A')[:20], border=1)
            pdf.cell(25, 7, c.get('fee', 'N/A'), border=1)
            pdf.cell(30, 7, c.get('cutoffRange', 'N/A'), border=1)
            pdf.cell(20, 7, c.get('naacGrade', 'N/A'), border=1, new_x="LMARGIN", new_y="NEXT")
        pdf.ln(10)

    # Counseling Rounds
    spot = data.get('spotRoundAnalysis', {})
    if spot:
        pdf.set_font('helvetica', 'B', 12)
        pdf.set_text_color(139, 92, 246) # Violet
        pdf.cell(0, 10, 'COUNSELING STRATEGY', new_x="LMARGIN", new_y="NEXT")
        
        pdf.set_font('helvetica', 'B', 9)
        pdf.set_text_color(100, 100, 100)
        rounds = spot.get('roundWiseChances', {})
        for r_name, r_colleges in rounds.items():
            if r_colleges:
                pdf.set_font('helvetica', 'B', 9)
                pdf.cell(30, 6, f"{r_name.capitalize()}: ", ln=0)
                pdf.set_font('helvetica', '', 9)
                pdf.multi_cell(0, 6, ", ".join(r_colleges))
        
        pdf.ln(5)
        pdf.set_font('helvetica', 'I', 9)
        pdf.set_text_color(100, 100, 100)
        pdf.multi_cell(0, 5, f"Counselor Tip: {spot.get('tip', 'N/A')}")

    # Final AI Analysis
    pdf.ln(5)
    pdf.set_fill_color(243, 244, 246)
    pdf.set_font('helvetica', 'B', 10)
    pdf.set_text_color(0, 0, 0)
    pdf.cell(0, 8, 'EXPERT AI ANALYSIS', fill=True, new_x="LMARGIN", new_y="NEXT")
    pdf.set_font('helvetica', '', 9)
    pdf.multi_cell(0, 5, data.get('analysis', 'N/A'))

    # Disclaimer
    pdf.ln(10)
    pdf.set_font('helvetica', 'I', 7)
    pdf.set_text_color(150, 150, 150)
    pdf.multi_cell(0, 4, "Disclaimer: This report is generated by an AI model based on historical data. Actual results may vary. Student Toolkit Pro is not responsible for any admission decisions.")

    # Save to buffer/file
    output_path = data.get('outputPath', 'report.pdf')
    pdf.output(output_path)
    return output_path

if __name__ == "__main__":
    if len(sys.argv) > 1:
        try:
            arg = sys.argv[1]
            # Check if arg is a file path or raw JSON
            if os.path.exists(arg) and arg.endswith('.json'):
                with open(arg, 'r', encoding='utf-8') as f:
                    input_data = json.load(f)
            else:
                input_data = json.loads(arg)
                
            generate_pdf(input_data)
            print(f"SUCCESS:{input_data.get('outputPath', 'report.pdf')}")
        except Exception as e:
            print(f"ERROR:{str(e)}")
            sys.exit(1)
    else:
        print("ERROR:No data provided")
        sys.exit(1)
