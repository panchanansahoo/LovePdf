# LovePdf 🎓

LovePdf is a powerful, privacy-first, student-focused PDF toolkit. It allows students to manage, convert, and edit their assignments, notes, and certificates directly on their local machine without requiring cloud uploads or paid subscriptions.

## ✨ Features

### Standard Tools
- 📦 **Merge PDF:** Combine multiple assignments or certificates into a single file.
- ✂️ **Extract Pages:** Pull specific pages out of a massive textbook or lecture slide deck.
- 📉 **Compress PDF:** Shrink huge scanned assignments so they fit into university portal limits (50MB+ down to KB).
- 📸 **Scan to PDF:** Turn photos of handwritten notes into a clean PDF document.
- 🔢 **Add Page Numbers:** Instantly format your essays with proper page numbers.
- 🏷️ **Watermark PDF:** Protect your original projects with a custom text watermark.
- ✍️ **Fill & Sign:** Add your signature to scholarship forms or official documents.
- 🔄 **PDF to JPG / JPG to PDF:** Quick format conversions for various upload requirements.

### Pro Tools (Fully Offline & Native)
- 📝 **PDF to Word:** Extracts text and layout from a PDF and translates it directly into an editable `.docx` Word file using native Python bindings.
- 🔍 **OCR PDF:** Makes scanned PDFs and image-based notes fully highlightable, searchable, and selectable using Tesseract's Optical Character Recognition.

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, TailwindCSS, `react-dropzone`, `pdfjs-dist`
- **Backend:** Node.js, Express, `pdf-lib`
- **System Dependencies:**
  - Ghostscript (for hardcore compression and image extraction)
  - Python `pdf2docx` (for PDF to Word conversion)
  - `tesseract.js` (for WebAssembly-based offline OCR)

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/), [Python](https://www.python.org/), and [Ghostscript](https://ghostscript.com/) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/panchanansahoo/LovePdf.git
   cd LovePdf
   ```

2. **Install Backend Dependencies:**
   ```bash
   cd backend
   npm install
   pip install pdf2docx
   ```

3. **Install Frontend Dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Run the Application:**
   Open two terminals.
   In the first terminal (Backend):
   ```bash
   cd backend
   npm run dev
   ```
   In the second terminal (Frontend):
   ```bash
   cd frontend
   npm run dev
   ```

## 🔒 Privacy First
LovePdf runs its core operations natively. Documents are processed directly on your backend server without bouncing through third-party cloud APIs, keeping your academic work strictly private!
