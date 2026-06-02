import { Request, Response, NextFunction } from 'express';
import { PdfService } from '../services/pdfService';
import { cleanupFiles } from '../utils/cleanup';
import path from 'path';

export const mergePdfs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      return res.status(400).json({ success: false, message: 'No files provided' });
    }

    const files = req.files as Express.Multer.File[];
    const filePaths = files.map(f => f.path);

    const outputPath = await PdfService.mergePdfs(filePaths);

    res.download(outputPath, 'merged.pdf', async (err) => {
      // Clean up files after download finishes (or fails)
      await cleanupFiles([...filePaths, outputPath]);
    });
  } catch (error) {
    // Attempt cleanup on error
    if (req.files) {
      const files = req.files as Express.Multer.File[];
      await cleanupFiles(files.map(f => f.path));
    }
    next(error);
  }
};

export const splitPdf = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file provided' });
    }

    const { ranges } = req.body;
    const outputPath = await PdfService.splitPdf(req.file.path, ranges);

    res.download(outputPath, 'split.pdf', async (err) => {
      await cleanupFiles([req.file!.path, outputPath]);
    });
  } catch (error) {
    if (req.file) await cleanupFiles([req.file.path]);
    next(error);
  }
};

export const protectPdf = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file provided' });
    
    const { password } = req.body;
    if (!password) return res.status(400).json({ success: false, message: 'Password is required' });

    const outputPath = await PdfService.protectPdf(req.file.path, password);

    res.download(outputPath, 'protected.pdf', async (err) => {
      await cleanupFiles([req.file!.path, outputPath]);
    });
  } catch (error) {
    if (req.file) await cleanupFiles([req.file.path]);
    next(error);
  }
};

export const unlockPdf = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file provided' });
    
    const { password } = req.body;
    if (!password) return res.status(400).json({ success: false, message: 'Password is required' });

    const outputPath = await PdfService.unlockPdf(req.file.path, password);

    res.download(outputPath, 'unlocked.pdf', async (err) => {
      await cleanupFiles([req.file!.path, outputPath]);
    });
  } catch (error: any) {
    if (req.file) await cleanupFiles([req.file.path]);
    if (error.message?.includes('password')) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }
    next(error);
  }
};

export const rotatePdf = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file provided' });
    
    const degrees = parseInt(req.body.degrees || '90', 10);

    const outputPath = await PdfService.rotatePdf(req.file.path, degrees);

    res.download(outputPath, 'rotated.pdf', async (err) => {
      await cleanupFiles([req.file!.path, outputPath]);
    });
  } catch (error) {
    if (req.file) await cleanupFiles([req.file.path]);
    next(error);
  }
};

export const watermarkPdf = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file provided' });
    
    const text = req.body.text || 'CONFIDENTIAL';
    const outputPath = await PdfService.watermarkPdf(req.file.path, text);

    res.download(outputPath, 'watermarked.pdf', async (err) => {
      await cleanupFiles([req.file!.path, outputPath]);
    });
  } catch (error) {
    if (req.file) await cleanupFiles([req.file.path]);
    next(error);
  }
};

export const reorderPdf = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file provided' });
    
    const order = req.body.order || '1';
    const outputPath = await PdfService.reorderPdf(req.file.path, order);

    res.download(outputPath, 'reordered.pdf', async (err) => {
      await cleanupFiles([req.file!.path, outputPath]);
    });
  } catch (error) {
    if (req.file) await cleanupFiles([req.file.path]);
    next(error);
  }
};

export const jpgToPdf = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file provided' });
    
    const outputPath = await PdfService.jpgToPdf(req.file.path);

    res.download(outputPath, 'converted.pdf', async (err) => {
      await cleanupFiles([req.file!.path, outputPath]);
    });
  } catch (error) {
    if (req.file) await cleanupFiles([req.file.path]);
    next(error);
  }
};

export const compressPdf = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file provided' });
    
    const targetSizeKb = parseInt(req.body.targetSize || '1024', 10);
    const outputPath = await PdfService.compressPdf(req.file.path, targetSizeKb);

    res.download(outputPath, 'compressed.pdf', async (err) => {
      await cleanupFiles([req.file!.path, outputPath]);
    });
  } catch (error) {
    if (req.file) await cleanupFiles([req.file.path]);
    next(error);
  }
};

export const removePages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file provided" });
    const pagesToRemove = req.body.pages || "1";
    const outputPath = await PdfService.removePages(req.file.path, pagesToRemove);
    res.download(outputPath, "removed.pdf", async () => await cleanupFiles([req.file!.path, outputPath]));
  } catch (error) {
    if (req.file) await cleanupFiles([req.file.path]);
    next(error);
  }
};

export const extractPages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file provided" });
    const pagesToExtract = req.body.pages || "1";
    const outputPath = await PdfService.extractPages(req.file.path, pagesToExtract);
    res.download(outputPath, "extracted.pdf", async () => await cleanupFiles([req.file!.path, outputPath]));
  } catch (error) {
    if (req.file) await cleanupFiles([req.file.path]);
    next(error);
  }
};

export const addPageNumbers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file provided" });
    const outputPath = await PdfService.addPageNumbers(req.file.path);
    res.download(outputPath, "numbered.pdf", async () => await cleanupFiles([req.file!.path, outputPath]));
  } catch (error) {
    if (req.file) await cleanupFiles([req.file.path]);
    next(error);
  }
};

export const scanToPdf = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) return res.status(400).json({ success: false, message: "No files provided" });
    const files = req.files as Express.Multer.File[];
    const filePaths = files.map(f => f.path);
    const outputPath = await PdfService.scanToPdf(filePaths);
    res.download(outputPath, "scanned.pdf", async () => await cleanupFiles([...filePaths, outputPath]));
  } catch (error) {
    if (req.files) await cleanupFiles((req.files as Express.Multer.File[]).map(f => f.path));
    next(error);
  }
};

export const signPdf = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file provided" });
    const text = req.body.text || "Signed Electronically";
    const outputPath = await PdfService.signPdf(req.file.path, text);
    res.download(outputPath, "signed.pdf", async () => await cleanupFiles([req.file!.path, outputPath]));
  } catch (error) {
    if (req.file) await cleanupFiles([req.file.path]);
    next(error);
  }
};

export const annotatePdf = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file provided" });
    const text = req.body.text || "Review Note";
    const outputPath = await PdfService.annotatePdf(req.file.path, text);
    res.download(outputPath, "annotated.pdf", async () => await cleanupFiles([req.file!.path, outputPath]));
  } catch (error) {
    if (req.file) await cleanupFiles([req.file.path]);
    next(error);
  }
};


export const pdfToWord = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file provided" });
    const outputPath = await PdfService.pdfToWord(req.file.path);
    res.download(outputPath, "converted.docx", async () => await cleanupFiles([req.file!.path, outputPath]));
  } catch (error) {
    if (req.file) await cleanupFiles([req.file.path]);
    next(error);
  }
};

export const ocrPdf = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file provided" });
    const outputPath = await PdfService.ocrPdf(req.file.path);
    res.download(outputPath, "ocr-searchable.pdf", async () => await cleanupFiles([req.file!.path, outputPath]));
  } catch (error) {
    if (req.file) await cleanupFiles([req.file.path]);
    next(error);
  }
};

