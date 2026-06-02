import React, { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, File as FileIcon, X, Settings2, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/Button';
import { cn } from '../utils/cn';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();

// Mapping for tool details
const toolConfig: Record<string, { title: string; description: string; multiple: boolean; studentExample?: string }> = {
  merge: { title: 'Merge PDF', description: 'Combine PDFs in the order you want', multiple: true, studentExample: 'Perfect for combining certificates or transcripts into a single file.' },
  split: { title: 'Split PDF', description: 'Extract pages from your PDF', multiple: false, studentExample: 'Great for extracting a specific chapter from a long textbook.' },
  compress: { title: 'Compress PDF', description: 'Reduce PDF file size without losing quality', multiple: false, studentExample: 'Essential for making resumes and assignments small enough for portal uploads (e.g. < 2MB).' },
  protect: { title: 'Protect PDF', description: 'Encrypt your PDF with a password', multiple: false },
  unlock: { title: 'Unlock PDF', description: 'Remove PDF password security', multiple: false },
  rotate: { title: 'Rotate PDF', description: 'Rotate your PDFs the way you need them', multiple: false },
  'scan-to-pdf': { title: 'Scan to PDF', description: 'Capture notes and transform them into a PDF', multiple: true, studentExample: 'Turn photos of handwritten notes into a clean PDF.' },
  annotate: { title: 'Annotate PDF', description: 'Highlight and annotate your study materials', multiple: false, studentExample: 'Highlight important sections in your syllabus or readings.' },
  ocr: { title: 'OCR PDF', description: 'Make your scanned notes searchable and selectable', multiple: false, studentExample: 'Convert scanned textbook pages into copy-pasteable text.' },
  'page-numbers': { title: 'Add page numbers', description: 'Number your assignment pages', multiple: false, studentExample: 'A must-have for formatting long research papers.' },
  watermark: { title: 'Watermark PDF', description: 'Stamp your project report with your name', multiple: false, studentExample: 'Protect your original project reports before sharing.' },
  sign: { title: 'Fill and Sign PDF', description: 'Fill out and sign scholarship forms', multiple: false, studentExample: 'Sign university application forms and scholarship documents digitally.' },
  'jpg-to-pdf': { title: 'JPG to PDF', description: 'Convert images of notes to a PDF document', multiple: true },
  'pdf-to-word': { title: 'PDF to Word', description: 'Convert PDFs to editable Word documents', multiple: false, studentExample: 'Edit lecture slides or assignment instructions.' },
  'pdf-to-jpg': { title: 'PDF to JPG', description: 'Extract images from a PDF', multiple: false },
};

export const ToolPage = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const config = toolConfig[toolId || ''] || { title: 'PDF Tool', description: 'Process your PDF file', multiple: false };
  
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  // Tool specific state
  const [password, setPassword] = useState('');
  const [degrees, setDegrees] = useState('90');
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [pageOrder, setPageOrder] = useState('1,2,3');
  const [targetSize, setTargetSize] = useState('1024'); // target size in KB

  const [recentFiles, setRecentFiles] = useState<{name: string, url: string, tool: string, time: string}[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (config.multiple) {
      setFiles((prev) => [...prev, ...acceptedFiles]);
    } else {
      setFiles([acceptedFiles[0]]);
    }
    setResultUrl(null);
  }, [config.multiple]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: config.multiple
  });

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleProcess = async () => {
    if (files.length === 0) return;
    
    // Validate inputs
    if ((toolId === 'protect' || toolId === 'unlock') && !password) {
      toast.error('Please enter a password');
      return;
    }

    setIsProcessing(true);
    
    try {
      if (toolId === 'pdf-to-jpg') {
        const file = files[0];
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) } as any).promise;
        
        // For MVP, extract the first page
        const page = await pdf.getPage(1); 
        
        const scale = 2.0;
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        if (context) {
          await page.render({ canvasContext: context, viewport } as any).promise;
          const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
          
          setResultUrl(dataUrl);
          setRecentFiles(prev => [{ name: file.name, url: dataUrl, tool: config.title, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 5));
          toast.success('Task completed successfully!');
          setIsProcessing(false);
          return;
        } else {
          throw new Error("Canvas context could not be created");
        }
      }

      const formData = new FormData();
      if (config.multiple) {
        files.forEach((file) => formData.append('files', file));
      } else {
        formData.append('file', files[0]);
      }

      if (toolId === 'protect' || toolId === 'unlock') {
        formData.append('password', password);
      }
      if (toolId === 'rotate') {
        formData.append('degrees', degrees);
      }
      if (toolId === 'watermark') {
        formData.append('text', watermarkText);
      }
      if (toolId === 'reorder') {
        formData.append('order', pageOrder);
      }
      if (toolId === 'compress') {
        formData.append('targetSize', targetSize);
      }
      
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${API_URL}/api/tools/${toolId}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to process file');
      }

      // Handle file download response
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setResultUrl(url);
      setRecentFiles(prev => [{ name: files[0].name, url, tool: config.title, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 5));
      toast.success('Task completed successfully!');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'An error occurred during processing');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderOptions = () => {
    if (toolId === 'protect' || toolId === 'unlock') {
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {toolId === 'protect' ? 'Set Password' : 'Document Password'}
          </label>
          <input 
            type="password" 
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        </div>
      );
    }
    if (toolId === 'rotate') {
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">Rotation Angle</label>
          <select 
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            value={degrees}
            onChange={(e) => setDegrees(e.target.value)}
          >
            <option value="90">90 Degrees (Right)</option>
            <option value="180">180 Degrees (Upside Down)</option>
            <option value="270">270 Degrees (Left)</option>
          </select>
        </div>
      );
    }
    if (toolId === 'compress') {
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">Target Size (in KB)</label>
          <input 
            type="number" 
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            value={targetSize}
            onChange={(e) => setTargetSize(e.target.value)}
            placeholder="e.g. 500"
            min="10"
          />
          <p className="text-xs text-slate-500 mt-2">
            Note: Extreme compression may reduce image quality.
          </p>
        </div>
      );
    }
    if (toolId === 'watermark') {
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">Watermark Text</label>
          <input 
            type="text" 
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            value={watermarkText}
            onChange={(e) => setWatermarkText(e.target.value)}
            placeholder="e.g. CONFIDENTIAL"
          />
        </div>
      );
    }
    if (toolId === 'reorder') {
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">Page Order (comma separated)</label>
          <input 
            type="text" 
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            value={pageOrder}
            onChange={(e) => setPageOrder(e.target.value)}
            placeholder="e.g. 3,1,2,4"
          />
        </div>
      );
    }
    return (
      <p className="text-sm text-slate-500 flex-1">
        Ready to process your files? Click the button below to start.
      </p>
    );
  };

  return (
    <div className="flex-1 bg-slate-50/50 py-12 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-200/30 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-200/30 blur-[100px] pointer-events-none"></div>
      
      <div className="container relative z-10 mx-auto px-4 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">{config.title}</h1>
          <p className="text-lg text-slate-600">{config.description}</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!resultUrl ? (
            <motion.div 
              key="upload"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel overflow-hidden"
            >
            {files.length === 0 ? (
              <div 
                {...getRootProps()} 
                className={cn(
                  "p-20 flex flex-col items-center justify-center border-2 border-dashed rounded-3xl cursor-pointer transition-colors m-4",
                  isDragActive ? "border-primary-500 bg-primary-50" : "border-slate-300 hover:border-primary-400 hover:bg-slate-50"
                )}
              >
                <input {...getInputProps()} />
                <div className="bg-primary-100 p-4 rounded-full mb-6">
                  <UploadCloud className="h-10 w-10 text-primary-600" />
                </div>
                <p className="text-xl font-bold text-slate-700 mb-2">Select PDF file{config.multiple ? 's' : ''}</p>
                <p className="text-sm text-slate-500 mb-2">or drop {config.multiple ? 'them' : 'it'} here</p>
                <p className="text-xs text-slate-400 mb-6 flex items-center justify-center gap-1">
                  <Settings2 className="h-3 w-3" /> Max file size: 50MB. Files are deleted immediately for privacy.
                </p>
                <Button size="lg" className="pointer-events-none mb-4">Select File</Button>
                {config.studentExample && (
                  <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100 text-amber-800 text-sm max-w-sm text-center shadow-sm">
                    <strong>💡 Student Tip:</strong> {config.studentExample}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col md:flex-row">
                <div className="flex-1 p-8">
                  <h3 className="font-bold text-slate-900 mb-4">Selected Files</h3>
                  <div className="space-y-3 mb-8">
                    {files.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <FileIcon className="h-6 w-6 text-red-500 shrink-0" />
                          <span className="text-sm font-medium text-slate-700 truncate">{file.name}</span>
                        </div>
                        <button onClick={() => removeFile(idx)} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
                          <X className="h-4 w-4 text-slate-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                  {config.multiple && (
                    <div {...getRootProps()} className="inline-block cursor-pointer">
                      <input {...getInputProps()} />
                      <Button variant="outline" size="sm" className="mb-4">+ Add more files</Button>
                    </div>
                  )}
                </div>
                
                <div className="md:w-80 bg-slate-50 p-8 border-t md:border-t-0 md:border-l border-slate-200 flex flex-col">
                  <div className="flex items-center gap-2 mb-6">
                    <Settings2 className="h-5 w-5 text-slate-600" />
                    <h3 className="font-bold text-slate-900">Options</h3>
                  </div>
                  
                  {renderOptions()}
                  
                  <Button size="lg" className="w-full mt-6" onClick={handleProcess} disabled={isProcessing}>
                    {isProcessing ? 'Processing...' : config.title}
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-12 text-center max-w-2xl mx-auto"
          >
             <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="bg-green-100 p-4 rounded-full inline-block mb-6"
             >
                <Check className="h-10 w-10 text-green-600" />
              </motion.div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Task completed!</h2>
              <p className="text-slate-600 mb-8">Your PDF has been processed successfully.</p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href={resultUrl} download={`${toolId}-result.${toolId === 'pdf-to-jpg' ? 'jpg' : 'pdf'}`}>
                  <Button size="lg">Download File</Button>
                </a>
                <Button size="lg" variant="outline" onClick={() => {
                  setResultUrl(null);
                  setFiles([]);
                  setPassword('');
                }}>Process Another</Button>
              </div>
          </motion.div>
        )}
        </AnimatePresence>

        {/* Recent Files Section */}
        {recentFiles.length > 0 && !resultUrl && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16 pt-8 border-t border-slate-200"
          >
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FileIcon className="h-5 w-5 text-primary-500" />
              Recent Processed Files (Current Session)
            </h3>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              {recentFiles.map((rf, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                  <div>
                    <p className="font-medium text-slate-800">{rf.name}</p>
                    <p className="text-xs text-slate-500">{rf.tool} • Processed at {rf.time}</p>
                  </div>
                  <a href={rf.url} download={`processed-${rf.name}`}>
                    <Button variant="outline" size="sm">Download Again</Button>
                  </a>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
