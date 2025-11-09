import React from 'react';

const Spinner = ({ size = 'lg', className = '' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative">
        {/* Outer rotating ring */}
        <div
          className={`${sizeClasses[size]} border-4 border-[#300A91]/20 dark:border-purple-400/20 rounded-full`}
        ></div>
        {/* Inner rotating ring */}
        <div
          className={`${sizeClasses[size]} border-4 border-transparent border-t-[#300A91] dark:border-t-purple-400 rounded-full animate-spin absolute top-0 left-0`}
        ></div>
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-2 h-2 bg-[#300A91] dark:bg-purple-400 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Spinner;

