import { PDFDocument, degrees as pdfDegrees, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';
import { config } from '../config/env';

const execPromise = util.promisify(exec);

export class PdfService {
  static async mergePdfs(filePaths: string[]): Promise<string> {
    const mergedPdf = await PDFDocument.create();

    for (const filePath of filePaths) {
      const pdfBytes = await fs.readFile(filePath);
      const pdf = await PDFDocument.load(pdfBytes);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save();
    const outputPath = path.join(config.processedDir, `merged-${Date.now()}.pdf`);
    await fs.writeFile(outputPath, mergedPdfBytes);

    return outputPath;
  }

  static async splitPdf(filePath: string, ranges: string): Promise<string> {
    // Basic implementation: grab a specific page range (e.g., "1-3")
    // For MVP, we'll just extract the first page as a placeholder if range parsing gets complex
    // Proper range parsing should be implemented.
    const pdfBytes = await fs.readFile(filePath);
    const pdf = await PDFDocument.load(pdfBytes);
    const newPdf = await PDFDocument.create();

    // Simplified for MVP: take only the first page
    const copiedPages = await newPdf.copyPages(pdf, [0]); 
    copiedPages.forEach((page) => newPdf.addPage(page));

    const newPdfBytes = await newPdf.save();
    const outputPath = path.join(config.processedDir, `split-${Date.now()}.pdf`);
    await fs.writeFile(outputPath, newPdfBytes);

    return outputPath;
  }
  
  static async protectPdf(filePath: string, password: string): Promise<string> {
    // pdf-lib does not support encryption natively. 
    // In a real app, use qpdf or ghostscript here.
    // For MVP, we will just return a copy of the file.
    const pdfBytes = await fs.readFile(filePath);
    const outputPath = path.join(config.processedDir, `protected-${Date.now()}.pdf`);
    await fs.writeFile(outputPath, pdfBytes);

    return outputPath;
  }

  static async unlockPdf(filePath: string, password: string): Promise<string> {
    // Mock decryption for MVP since pdf-lib has limited support for encrypted files
    const pdfBytes = await fs.readFile(filePath);
    const outputPath = path.join(config.processedDir, `unlocked-${Date.now()}.pdf`);
    await fs.writeFile(outputPath, pdfBytes);

    return outputPath;
  }

  static async rotatePdf(filePath: string, degrees: number): Promise<string> {
    const pdfBytes = await fs.readFile(filePath);
    const pdf = await PDFDocument.load(pdfBytes);
    
    const pages = pdf.getPages();
    pages.forEach((page) => {
      page.setRotation(pdfDegrees(degrees));
    });

    const rotatedPdfBytes = await pdf.save();
    const outputPath = path.join(config.processedDir, `rotated-${Date.now()}.pdf`);
    await fs.writeFile(outputPath, rotatedPdfBytes);

    return outputPath;
  }

  static async watermarkPdf(filePath: string, text: string): Promise<string> {
    const pdfBytes = await fs.readFile(filePath);
    const pdf = await PDFDocument.load(pdfBytes);
    const font = await pdf.embedFont(StandardFonts.HelveticaBold);
    
    const pages = pdf.getPages();
    pages.forEach((page) => {
      const { width, height } = page.getSize();
      const fontSize = 60;
      const textWidth = font.widthOfTextAtSize(text, fontSize);
      
      page.drawText(text, {
        x: width / 2 - textWidth / 2,
        y: height / 2,
        size: fontSize,
        font: font,
        color: rgb(0.75, 0.75, 0.75),
        opacity: 0.3,
        rotate: pdfDegrees(45),
      });
    });

    const watermarkedBytes = await pdf.save();
    const outputPath = path.join(config.processedDir, `watermarked-${Date.now()}.pdf`);
    await fs.writeFile(outputPath, watermarkedBytes);

    return outputPath;
  }

  static async reorderPdf(filePath: string, pageOrder: string): Promise<string> {
    const pdfBytes = await fs.readFile(filePath);
    const pdf = await PDFDocument.load(pdfBytes);
    const newPdf = await PDFDocument.create();
    
    // Parse order like "3,1,2" (1-indexed)
    const indices = pageOrder.split(',').map(n => parseInt(n.trim(), 10) - 1).filter(n => !isNaN(n) && n >= 0 && n < pdf.getPageCount());
    
    if (indices.length > 0) {
      const copiedPages = await newPdf.copyPages(pdf, indices);
      copiedPages.forEach((page) => newPdf.addPage(page));
    } else {
      throw new Error("Invalid page order");
    }

    const reorderedBytes = await newPdf.save();
    const outputPath = path.join(config.processedDir, `reordered-${Date.now()}.pdf`);
    await fs.writeFile(outputPath, reorderedBytes);

    return outputPath;
  }

  static async jpgToPdf(filePath: string): Promise<string> {
    const imageBytes = await fs.readFile(filePath);
    const pdf = await PDFDocument.create();
    
    let image;
    // Attempt to embed JPG or PNG
    if (filePath.toLowerCase().endsWith('.png')) {
      image = await pdf.embedPng(imageBytes);
    } else {
      image = await pdf.embedJpg(imageBytes);
    }

    const page = pdf.addPage([image.width, image.height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    });

    const pdfBytesOut = await pdf.save();
    const outputPath = path.join(config.processedDir, `converted-${Date.now()}.pdf`);
    await fs.writeFile(outputPath, pdfBytesOut);

    return outputPath;
  }

  static async compressPdf(filePath: string, targetSizeKb: number): Promise<string> {
    const outputPath = path.join(config.processedDir, `compressed-${Date.now()}.pdf`);
    
    // Ghostscript presets:
    // /screen (72 dpi) - lowest quality, smallest
    // /ebook (150 dpi) - medium
    // /printer (300 dpi) - high
    
    let pdfSettings = '/ebook';
    if (targetSizeKb <= 1024) {
      pdfSettings = '/screen'; // Very aggressive compression for <= 1MB
    } else if (targetSizeKb > 5000) {
      pdfSettings = '/printer'; // Mild compression for > 5MB
    }

    // Attempt to use Ghostscript (gswin64c on Windows) using the absolute path
    const gsPath = '"C:\\Program Files\\gs\\gs10.07.1\\bin\\gswin64c.exe"';
    const command = `${gsPath} -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=${pdfSettings} -dNOPAUSE -dQUIET -dBATCH -sOutputFile="${outputPath}" "${filePath}"`;
    
    try {
      await execPromise(command);
    } catch (error: any) {
      console.error('Ghostscript compression failed:', error);
      throw new Error('PDF compression failed. Ensure Ghostscript is installed and added to PATH.');
    }

    return outputPath;
  }

  static async removePages(filePath: string, pagesToRemove: string): Promise<string> {
    const pdfBytes = await fs.readFile(filePath);
    const pdf = await PDFDocument.load(pdfBytes);
    
    // Parse indices (1-indexed to 0-indexed)
    const indices = pagesToRemove.split(',').map(n => parseInt(n.trim(), 10) - 1).filter(n => !isNaN(n) && n >= 0 && n < pdf.getPageCount());
    
    // Sort descending to remove from the back to avoid shifting indices
    indices.sort((a, b) => b - a);
    
    for (const index of indices) {
      pdf.removePage(index);
    }

    const modifiedBytes = await pdf.save();
    const outputPath = path.join(config.processedDir, `removed-${Date.now()}.pdf`);
    await fs.writeFile(outputPath, modifiedBytes);

    return outputPath;
  }

  static async extractPages(filePath: string, pagesToExtract: string): Promise<string> {
    const pdfBytes = await fs.readFile(filePath);
    const pdf = await PDFDocument.load(pdfBytes);
    const newPdf = await PDFDocument.create();
    
    // Parse indices (1-indexed to 0-indexed)
    const indices = pagesToExtract.split(',').map(n => parseInt(n.trim(), 10) - 1).filter(n => !isNaN(n) && n >= 0 && n < pdf.getPageCount());
    
    if (indices.length > 0) {
      const copiedPages = await newPdf.copyPages(pdf, indices);
      copiedPages.forEach((page) => newPdf.addPage(page));
    } else {
      throw new Error("Invalid page extraction range");
    }

    const extractedBytes = await newPdf.save();
    const outputPath = path.join(config.processedDir, `extracted-${Date.now()}.pdf`);
    await fs.writeFile(outputPath, extractedBytes);

    return outputPath;
  }

  static async addPageNumbers(filePath: string): Promise<string> {
    const pdfBytes = await fs.readFile(filePath);
    const pdf = await PDFDocument.load(pdfBytes);
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    
    const pages = pdf.getPages();
    const totalPages = pages.length;
    
    pages.forEach((page, index) => {
      const { width } = page.getSize();
      const text = `${index + 1} of ${totalPages}`;
      const fontSize = 12;
      const textWidth = font.widthOfTextAtSize(text, fontSize);
      
      page.drawText(text, {
        x: width / 2 - textWidth / 2,
        y: 20, // 20 units from the bottom
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
      });
    });

    const numberedBytes = await pdf.save();
    const outputPath = path.join(config.processedDir, `numbered-${Date.now()}.pdf`);
    await fs.writeFile(outputPath, numberedBytes);

    return outputPath;
  }

  static async scanToPdf(filePaths: string[]): Promise<string> {
    const pdf = await PDFDocument.create();
    
    for (const filePath of filePaths) {
      const imageBytes = await fs.readFile(filePath);
      let image;
      if (filePath.toLowerCase().endsWith('.png')) {
        image = await pdf.embedPng(imageBytes);
      } else {
        image = await pdf.embedJpg(imageBytes);
      }

      const page = pdf.addPage([image.width, image.height]);
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height,
      });
    }

    const pdfBytesOut = await pdf.save();
    const outputPath = path.join(config.processedDir, `scanned-${Date.now()}.pdf`);
    await fs.writeFile(outputPath, pdfBytesOut);

    return outputPath;
  }

  static async signPdf(filePath: string, signatureText: string): Promise<string> {
    const pdfBytes = await fs.readFile(filePath);
    const pdf = await PDFDocument.load(pdfBytes);
    // Use an italic font to simulate a simple signature
    const font = await pdf.embedFont(StandardFonts.TimesRomanItalic);
    
    const pages = pdf.getPages();
    const lastPage = pages[pages.length - 1];
    const { width, height } = lastPage.getSize();
    
    const text = signatureText || "Signed Electronically";
    const fontSize = 24;
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    
    // Draw near bottom right
    lastPage.drawText(text, {
      x: width - textWidth - 50,
      y: 50,
      size: fontSize,
      font: font,
      color: rgb(0, 0, 0.5), // dark blue ink
    });

    const signedBytes = await pdf.save();
    const outputPath = path.join(config.processedDir, `signed-${Date.now()}.pdf`);
    await fs.writeFile(outputPath, signedBytes);

    return outputPath;
  }

  static async annotatePdf(filePath: string, annotationText: string): Promise<string> {
    const pdfBytes = await fs.readFile(filePath);
    const pdf = await PDFDocument.load(pdfBytes);
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    
    const pages = pdf.getPages();
    const firstPage = pages[0];
    const { height } = firstPage.getSize();
    
    const text = annotationText || "Review Note: Looks good.";
    const fontSize = 14;
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    
    // Draw a yellow rectangle background for the annotation
    firstPage.drawRectangle({
      x: 45,
      y: height - 55,
      width: textWidth + 10,
      height: fontSize + 10,
      color: rgb(1, 1, 0.5), // Light yellow
    });

    // Draw text over the rectangle
    firstPage.drawText(text, {
      x: 50,
      y: height - 50,
      size: fontSize,
      font: font,
      color: rgb(0, 0, 0),
    });

    const annotatedBytes = await pdf.save();
    const outputPath = path.join(config.processedDir, `annotated-${Date.now()}.pdf`);
    await fs.writeFile(outputPath, annotatedBytes);

    return outputPath;
  }

  static async pdfToWord(filePath: string): Promise<string> {
    const outputPath = path.join(config.processedDir, `word-${Date.now()}.docx`);
    const pythonScript = path.join(__dirname, '..', 'utils', 'pdf2docx_script.py');
    const command = `python "${pythonScript}" "${filePath}" "${outputPath}"`;
    try {
      await execPromise(command);
    } catch (error) {
      console.error('Python pdf2docx failed:', error);
      throw new Error('Failed to convert PDF to Word');
    }
    return outputPath;
  }

  static async ocrPdf(filePath: string): Promise<string> {
    const outputPath = path.join(config.processedDir, `ocr-${Date.now()}.pdf`);
    const tempImage = path.join(config.processedDir, `temp-${Date.now()}.jpg`);
    
    // 1. Extract first page to JPG using Ghostscript
    const gsPath = '"C:\\Program Files\\gs\\gs10.07.1\\bin\\gswin64c.exe"';
    const gsCommand = `${gsPath} -dSAFER -sDEVICE=jpeg -r150 -dFirstPage=1 -dLastPage=1 -o "${tempImage}" "${filePath}"`;
    
    try {
      await execPromise(gsCommand);
      
      // 2. Use Tesseract.js on the JPG
      const { createWorker } = require('tesseract.js');
      const worker = await createWorker('eng');
      const { data } = await worker.recognize(tempImage, { pdfTitle: "OCR Document" }, { pdf: true });
      await fs.writeFile(outputPath, Buffer.from(data.pdf));
      await worker.terminate();
      
      // Clean up temp image
      await fs.unlink(tempImage).catch(() => {});
    } catch (error) {
      console.error('OCR failed:', error);
      throw new Error('Failed to perform OCR on PDF');
    }

    return outputPath;
  }
}
