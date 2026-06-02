import { Router, Request, Response } from 'express';
import { upload } from '../middleware/upload';
import { mergePdfs, splitPdf, protectPdf, unlockPdf, rotatePdf, watermarkPdf, reorderPdf, jpgToPdf, compressPdf, removePages, extractPages, addPageNumbers, scanToPdf, signPdf, annotatePdf, pdfToWord, ocrPdf } from '../controllers/pdfController';

const router = Router();

// Functional Routes
router.post('/merge', upload.array('files', 20), mergePdfs);
router.post('/split', upload.single('file'), splitPdf);
router.post('/protect', upload.single('file'), protectPdf);
router.post('/unlock', upload.single('file'), unlockPdf);
router.post('/rotate', upload.single('file'), rotatePdf);
router.post('/watermark', upload.single('file'), watermarkPdf);
router.post('/reorder', upload.single('file'), reorderPdf);
router.post('/jpg-to-pdf', upload.single('file'), jpgToPdf);

// Mock Routes for MVP missing tools (requires heavier native binaries like ghostscript for real implementation)
const mockHandler = (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file provided' });
  }
  // Just return the same file back for the mock
  res.download(req.file.path, `processed-${req.file.originalname}`);
};

router.post('/compress', upload.single('file'), compressPdf);

router.post('/remove-pages', upload.single('file'), removePages);
router.post('/extract-pages', upload.single('file'), extractPages);
router.post('/scan-to-pdf', upload.array('files', 20), scanToPdf);
router.post('/page-numbers', upload.single('file'), addPageNumbers);
router.post('/annotate', upload.single('file'), annotatePdf);
router.post('/sign', upload.single('file'), signPdf);

router.post('/pdf-to-word', upload.single('file'), pdfToWord);
router.post('/ocr', upload.single('file'), ocrPdf);

router.post('/pdf-to-jpg', upload.single('file'), mockHandler);
router.post('/web-to-pdf', upload.single('file'), mockHandler);
router.post('/fill-forms', upload.single('file'), mockHandler);
router.post('/redact', upload.single('file'), mockHandler);
router.post('/compare', upload.single('file'), mockHandler);
router.post('/overlay', upload.single('file'), mockHandler);
router.post('/extract-images', upload.single('file'), mockHandler);
router.post('/ai-chat', upload.single('file'), mockHandler);
router.post('/pdf-to-word', upload.single('file'), mockHandler);

export default router;
