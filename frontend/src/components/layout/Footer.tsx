import React from 'react';
import { Link } from 'react-router-dom';
import { Layers } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-primary-600">
            <Layers className="h-5 w-5" />
            <span className="text-lg font-bold tracking-tight text-slate-900">PrepPDF</span>
          </div>
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} PrepPDF. All rights reserved. Built for privacy.
          </p>
          <nav className="flex gap-4">
            <Link to="/about" className="text-sm text-slate-500 hover:text-primary-600">Privacy Policy</Link>
            <Link to="/about" className="text-sm text-slate-500 hover:text-primary-600">Terms of Service</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};
