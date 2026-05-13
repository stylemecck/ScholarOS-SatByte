import sys
import json
import os
from fpdf import FPDF
from datetime import datetime

class ResumePDF(FPDF):
    def __init__(self, theme_color='#8b5cf6'):
        super().__init__()
        self.theme_color = theme_color
        # Convert hex to RGB
        self.theme_rgb = self.hex_to_rgb(theme_color)

    def hex_to_rgb(self, hex_color):
        hex_color = hex_color.lstrip('#')
        return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

    def header(self):
        pass # Custom header per template

    def footer(self):
        self.set_y(-15)
        self.set_font('helvetica', 'I', 8)
        self.set_text_color(150, 150, 150)
        self.cell(0, 10, 'Generated via Student Toolkit Pro API', align='C')

def safe_text(text):
    if not text: return ""
    if not isinstance(text, str): return str(text)
    replacements = {'₹': 'Rs.', '–': '-', '—': '-', '‘': "'", '’': "'", '“': '"', '”': '"'}
    for char, rep in replacements.items():
        text = text.replace(char, rep)
    return text.encode('latin-1', 'ignore').decode('latin-1')

def generate_resume(data):
    theme_color = data.get('themeColor', '#8b5cf6')
    pdf = ResumePDF(theme_color)
    pdf.add_page()
    
    personal = data.get('personalInfo', {})
    
    # 1. Header (Personal Info)
    pdf.set_font('helvetica', 'B', 24)
    pdf.set_text_color(*pdf.theme_rgb)
    pdf.cell(0, 15, safe_text(personal.get('fullName', 'Your Name')), new_x="LMARGIN", new_y="NEXT", align='L')
    
    pdf.set_font('helvetica', '', 12)
    pdf.set_text_color(100, 100, 100)
    pdf.cell(0, 8, safe_text(personal.get('title', 'Professional Title')), new_x="LMARGIN", new_y="NEXT", align='L')
    
    # Contact Info
    pdf.set_font('helvetica', '', 9)
    contact_str = f"{personal.get('email', '')} | {personal.get('phone', '')} | {personal.get('location', '')}"
    pdf.cell(0, 6, safe_text(contact_str), new_x="LMARGIN", new_y="NEXT", align='L')
    
    links = []
    if personal.get('linkedin'): links.append(f"LinkedIn: {personal.get('linkedin')}")
    if personal.get('github'): links.append(f"GitHub: {personal.get('github')}")
    if personal.get('website'): links.append(personal.get('website'))
    
    if links:
        pdf.cell(0, 6, safe_text(" | ".join(links)), new_x="LMARGIN", new_y="NEXT", align='L')
    
    pdf.ln(10)
    
    # 2. Summary
    if data.get('summary'):
        pdf.set_font('helvetica', 'B', 14)
        pdf.set_text_color(*pdf.theme_rgb)
        pdf.cell(0, 10, 'PROFESSIONAL SUMMARY', new_x="LMARGIN", new_y="NEXT")
        pdf.set_draw_color(*pdf.theme_rgb)
        pdf.line(pdf.get_x(), pdf.get_y(), 200, pdf.get_y())
        pdf.ln(2)
        
        pdf.set_font('helvetica', '', 10)
        pdf.set_text_color(50, 50, 50)
        pdf.multi_cell(0, 6, safe_text(data.get('summary')))
        pdf.ln(8)

    # 3. Experience
    exp_list = data.get('experience', [])
    if exp_list:
        pdf.set_font('helvetica', 'B', 14)
        pdf.set_text_color(*pdf.theme_rgb)
        pdf.cell(0, 10, 'EXPERIENCE', new_x="LMARGIN", new_y="NEXT")
        pdf.line(pdf.get_x(), pdf.get_y(), 200, pdf.get_y())
        pdf.ln(4)
        
        for exp in exp_list:
            pdf.set_font('helvetica', 'B', 11)
            pdf.set_text_color(0, 0, 0)
            pdf.cell(100, 7, safe_text(exp.get('position')), align='L')
            pdf.set_font('helvetica', 'I', 10)
            pdf.set_text_color(100, 100, 100)
            pdf.cell(0, 7, safe_text(f"{exp.get('startDate')} - {exp.get('endDate')}"), align='R', new_x="LMARGIN", new_y="NEXT")
            
            pdf.set_font('helvetica', 'B', 10)
            pdf.set_text_color(50, 50, 50)
            pdf.cell(0, 6, safe_text(exp.get('company')), new_x="LMARGIN", new_y="NEXT")
            
            pdf.set_font('helvetica', '', 10)
            pdf.multi_cell(0, 5, safe_text(exp.get('description')))
            pdf.ln(5)

    # 4. Education
    edu_list = data.get('education', [])
    if edu_list:
        pdf.set_font('helvetica', 'B', 14)
        pdf.set_text_color(*pdf.theme_rgb)
        pdf.cell(0, 10, 'EDUCATION', new_x="LMARGIN", new_y="NEXT")
        pdf.line(pdf.get_x(), pdf.get_y(), 200, pdf.get_y())
        pdf.ln(4)
        
        for edu in edu_list:
            pdf.set_font('helvetica', 'B', 11)
            pdf.set_text_color(0, 0, 0)
            pdf.cell(100, 7, safe_text(edu.get('degree')), align='L')
            pdf.set_font('helvetica', 'I', 10)
            pdf.set_text_color(100, 100, 100)
            pdf.cell(0, 7, safe_text(edu.get('year')), align='R', new_x="LMARGIN", new_y="NEXT")
            
            pdf.set_font('helvetica', 'B', 10)
            pdf.set_text_color(50, 50, 50)
            pdf.cell(0, 6, safe_text(edu.get('school')), new_x="LMARGIN", new_y="NEXT")
            pdf.ln(4)

    # 5. Skills
    skills = data.get('skills', [])
    if skills:
        pdf.set_font('helvetica', 'B', 14)
        pdf.set_text_color(*pdf.theme_rgb)
        pdf.cell(0, 10, 'SKILLS', new_x="LMARGIN", new_y="NEXT")
        pdf.line(pdf.get_x(), pdf.get_y(), 200, pdf.get_y())
        pdf.ln(4)
        
        pdf.set_font('helvetica', '', 10)
        pdf.set_text_color(50, 50, 50)
        pdf.multi_cell(0, 6, ", ".join([safe_text(s) for s in skills]))

    # Save
    output_path = data.get('outputPath', 'resume.pdf')
    pdf.output(output_path)
    return output_path

if __name__ == "__main__":
    if len(sys.argv) > 1:
        try:
            arg = sys.argv[1]
            if os.path.exists(arg) and arg.endswith('.json'):
                with open(arg, 'r', encoding='utf-8') as f:
                    input_data = json.load(f)
            else:
                input_data = json.loads(arg)
                
            generate_resume(input_data)
            print(f"SUCCESS:{input_data.get('outputPath', 'resume.pdf')}")
        except Exception as e:
            print(f"ERROR:{str(e)}")
            sys.exit(1)
    else:
        print("ERROR:No data provided")
        sys.exit(1)
