import React from 'react';
import Spinner from './Spinner';

const PageLoader = () => {
  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50 transition-colors">
      <div className="text-center">
        <Spinner size="xl" />
        <p className="mt-4 text-[#300A91] dark:text-purple-400 font-semibold animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default PageLoader;

