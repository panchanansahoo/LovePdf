import React from 'react';
import { Clock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';

export const DashboardPage = () => {
  // Mock data for MVP
  const recentJobs = [];

  return (
    <div className="py-20 bg-slate-50 min-h-[calc(100vh-64px)]">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-8">Recent Jobs</h1>
        
        {recentJobs.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="bg-slate-100 p-4 rounded-full inline-block mb-6">
              <Clock className="h-10 w-10 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No recent jobs</h2>
            <p className="text-slate-500 mb-6">You haven't processed any files yet.</p>
            <Link to="/">
              <Button>Explore Tools</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* List jobs here */}
          </div>
        )}
      </div>
    </div>
  );
};
