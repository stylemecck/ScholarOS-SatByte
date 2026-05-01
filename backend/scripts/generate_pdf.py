import sys
import asyncio
from playwright.async_api import async_playwright
import os

async def generate_pdf(html_content, output_path):
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        
        # Set content and wait for fonts/images to load
        await page.set_content(html_content, wait_until="networkidle")
        
        # Inject some print-specific CSS to ensure A4 fit
        await page.add_style_tag(content="""
            @page { size: A4; margin: 0; }
            body { margin: 0; padding: 0; -webkit-print-color-adjust: exact; }
            #resume-a4 { width: 210mm; min-height: 297mm; box-shadow: none !important; border: none !important; margin: 0 !important; transform: none !important; }
        """)
        
        await page.pdf(
            path=output_path,
            format="A4",
            print_background=True,
            margin={"top": "0", "right": "0", "bottom": "0", "left": "0"}
        )
        await browser.close()

if __name__ == "__main__":
    # HTML content is passed via stdin
    html = sys.stdin.read()
    output = sys.argv[1] if len(sys.argv) > 1 else "resume.pdf"
    
    asyncio.run(generate_pdf(html, output))
