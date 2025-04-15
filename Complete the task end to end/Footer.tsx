import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Production Order Scheduler
          </div>
          <div className="text-sm text-gray-500">
            React Coding Challenge
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
