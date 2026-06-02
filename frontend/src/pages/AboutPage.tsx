import React from 'react';

export const AboutPage = () => {
  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-8">About & Privacy</h1>
        
        <div className="prose prose-slate lg:prose-lg">
          <h2>Our Mission</h2>
          <p>
            PrepPDF was created with a simple goal: provide fast, easy-to-use, and highly secure PDF tools for students, professionals, and everyone in between.
          </p>

          <h2>Privacy First Approach</h2>
          <p>
            We take your privacy seriously. Here is what you need to know about how we handle your files:
          </p>
          <ul>
            <li><strong>Temporary Storage:</strong> Files uploaded to our servers are only stored temporarily for processing.</li>
            <li><strong>Automatic Deletion:</strong> Your files (both uploads and generated results) are automatically and permanently deleted from our servers shortly after processing.</li>
            <li><strong>No Data Mining:</strong> We do not read, analyze, or mine the contents of your documents.</li>
            <li><strong>Secure Transfers:</strong> All file transfers are protected using industry-standard HTTPS/SSL encryption.</li>
          </ul>

          <h2>Contact Us</h2>
          <p>
            Have questions or feedback? We'd love to hear from you. Reach out to us at <code>support@preppdf.com</code>.
          </p>
        </div>
      </div>
    </div>
  );
};
