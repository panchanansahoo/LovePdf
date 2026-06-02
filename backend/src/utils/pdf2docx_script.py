import sys
from pdf2docx import Converter

def convert_pdf_to_docx(pdf_path, docx_path):
    cv = Converter(pdf_path)
    # Convert all pages
    cv.convert(docx_path)
    cv.close()

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python pdf2docx_script.py <input.pdf> <output.docx>")
        sys.exit(1)
    
    input_pdf = sys.argv[1]
    output_docx = sys.argv[2]
    convert_pdf_to_docx(input_pdf, output_docx)
