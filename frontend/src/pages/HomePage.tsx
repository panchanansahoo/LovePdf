import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { 
  FilePlus2, SplitSquareHorizontal, FileDown, Lock, Unlock, FileImage, 
  Image, ArrowDownUp, RefreshCw, Type, Sparkles, FileMinus, Search, 
  ListOrdered, FileDigit, PenTool, Edit3, ShieldAlert, GitCompare, 
  Layers, Camera, Scan, Bot 
} from 'lucide-react';
import { Button } from '../components/ui/Button';

interface Tool {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  isPro?: boolean;
  comingSoon?: boolean;
}

const tools: Tool[] = [
  // Study Tools
  { id: 'scan-to-pdf', title: 'Scan to PDF', description: 'Capture notes and transform them into a PDF.', category: 'Study Tools', icon: <Scan className="h-8 w-8 text-primary-500" /> },
  { id: 'annotate', title: 'Annotate PDF', description: 'Highlight and annotate your study materials.', category: 'Study Tools', icon: <Edit3 className="h-8 w-8 text-primary-500" /> },
  { id: 'ocr', title: 'OCR PDF', description: 'Make your scanned notes searchable and selectable.', category: 'Study Tools', icon: <Search className="h-8 w-8 text-primary-500" />, isPro: true },

  // Submission Tools
  { id: 'compress', title: 'Compress PDF', description: 'Reduce assignment file sizes for portal uploads.', category: 'Submission Tools', icon: <FileDown className="h-8 w-8 text-primary-500" /> },
  { id: 'page-numbers', title: 'Add page numbers', description: 'Number your assignment pages.', category: 'Submission Tools', icon: <FileDigit className="h-8 w-8 text-primary-500" /> },
  { id: 'watermark', title: 'Watermark PDF', description: 'Stamp your project report with your name.', category: 'Submission Tools', icon: <Type className="h-8 w-8 text-primary-500" /> },

  // Application Tools
  { id: 'merge', title: 'Merge PDF', description: 'Combine certificates or transcripts into one file.', category: 'Application Tools', icon: <FilePlus2 className="h-8 w-8 text-primary-500" /> },
  { id: 'sign', title: 'Fill and Sign PDF', description: 'Fill out and sign scholarship forms.', category: 'Application Tools', icon: <PenTool className="h-8 w-8 text-primary-500" /> },

  // Conversion Tools
  { id: 'jpg-to-pdf', title: 'JPG to PDF', description: 'Convert images of notes to a PDF document.', category: 'Conversion Tools', icon: <FileImage className="h-8 w-8 text-primary-500" /> },
  { id: 'pdf-to-word', title: 'PDF to Word', description: 'Convert PDFs to editable Word documents.', category: 'Conversion Tools', icon: <Type className="h-8 w-8 text-primary-500" />, isPro: true },
  { id: 'pdf-to-jpg', title: 'PDF to JPG', description: 'Extract images from a PDF.', category: 'Conversion Tools', icon: <Image className="h-8 w-8 text-primary-500" /> },
];

const categories = Array.from(new Set(tools.map(t => t.category)));

export const HomePage = () => {
  const containerVars: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVars: Variants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative w-full mesh-bg-light py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[100px] pointer-events-none"></div>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="container relative z-10 mx-auto px-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-primary-100 shadow-sm text-primary-700 text-sm font-medium mb-8">
            <Sparkles className="h-4 w-4" /> The future of PDF tools is here
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
            All your PDF tools <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">in one place.</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Merge, split, compress, convert, and protect documents in seconds. 
            Built for privacy, designed for simplicity, tailored for you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/tool/compress">
              <Button size="lg" className="rounded-full shadow-lg shadow-primary-500/30 px-6 py-4 text-sm sm:text-base hover:scale-105 transition-transform">
                Compress Resume
              </Button>
            </Link>
            <Link to="/tool/merge">
              <Button size="lg" variant="outline" className="rounded-full bg-white/80 backdrop-blur px-6 py-4 text-sm sm:text-base hover:scale-105 transition-transform border-slate-200">
                Merge Certificates
              </Button>
            </Link>
            <Link to="/tool/scan-to-pdf">
              <Button size="lg" variant="outline" className="rounded-full bg-white/80 backdrop-blur px-6 py-4 text-sm sm:text-base hover:scale-105 transition-transform border-slate-200">
                Scan Notes
              </Button>
            </Link>
            <Link to="/tool/ocr">
              <Button size="lg" variant="outline" className="rounded-full bg-white/80 backdrop-blur px-6 py-4 text-sm sm:text-base hover:scale-105 transition-transform border-slate-200 hidden sm:flex">
                Convert Notes to Text
              </Button>
            </Link>
            <Link to="/tool/sign">
              <Button size="lg" variant="outline" className="rounded-full bg-white/80 backdrop-blur px-6 py-4 text-sm sm:text-base hover:scale-105 transition-transform border-slate-200 hidden md:flex">
                Fill Scholarship Form
              </Button>
            </Link>
            <Link to="/tool/page-numbers">
              <Button size="lg" variant="outline" className="rounded-full bg-white/80 backdrop-blur px-6 py-4 text-sm sm:text-base hover:scale-105 transition-transform border-slate-200 hidden lg:flex">
                Add Page Numbers
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Tools Grid Section */}
      <section className="w-full py-24 bg-slate-50/50">
        <div className="container mx-auto px-4 max-w-6xl">
          
          {/* Most Used Section */}
          <div className="mb-16 bg-gradient-to-br from-primary-50 to-indigo-50 p-8 rounded-3xl border border-primary-100 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="h-6 w-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-slate-800">Most Used by Students</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {tools.filter(t => ['compress', 'merge', 'scan-to-pdf'].includes(t.id)).map((tool) => (
                <Link 
                  key={`popular-${tool.id}`}
                  to={`/tool/${tool.id}`}
                  className="flex items-center gap-4 bg-white p-4 rounded-2xl hover:shadow-md transition-all border border-slate-100 group"
                >
                  <div className="p-3 bg-primary-50 rounded-xl group-hover:bg-primary-100 transition-colors">
                    {tool.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{tool.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-1">{tool.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          {categories.map((category) => (
            <div key={category} className="mb-16">
              <h2 className="text-2xl font-bold text-slate-800 mb-8 border-b border-slate-200 pb-2">{category}</h2>
              <motion.div 
                variants={containerVars}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              >
                {tools.filter(t => t.category === category).map((tool) => (
                  <motion.div variants={itemVars} key={tool.id}>
                    <Link 
                      to={tool.comingSoon ? '#' : `/tool/${tool.id}`}
                      onClick={(e) => tool.comingSoon && e.preventDefault()}
                      className={`group flex flex-col items-center text-center glass-panel p-8 transition-all duration-300 h-full relative overflow-hidden ${
                        tool.comingSoon 
                          ? 'opacity-75 cursor-not-allowed grayscale-[0.2]' 
                          : 'hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary-500/10 cursor-pointer'
                      }`}
                    >
                      {tool.isPro && (
                        <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                          Pro
                        </div>
                      )}
                      {tool.comingSoon && (
                        <div className="absolute top-3 right-3 bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                          Soon
                        </div>
                      )}
                      <div className={`mb-6 p-4 bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-2xl transition-transform duration-300 shadow-sm border border-white ${!tool.comingSoon && 'group-hover:scale-110'}`}>
                        {tool.icon}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-3">{tool.title}</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">{tool.description}</p>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
