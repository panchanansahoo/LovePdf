import React from 'react';
import { Link } from 'react-router-dom';
import { Layers } from 'lucide-react';

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-primary-600">
          <Layers className="h-6 w-6" />
          <span className="text-xl font-bold tracking-tight text-slate-900">PrepPDF</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">Tools</Link>
          <Link to="/about" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">About</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-sm font-medium text-slate-600 hover:text-primary-600">Recent Jobs</Link>
        </div>
      </div>
    </header>
  );
};
