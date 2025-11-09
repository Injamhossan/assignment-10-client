import React, { useState, useEffect } from 'react';
import PageLoader from '../../components/Spinner/PageLoader';

const MyConnections = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-[#300A91] dark:text-purple-400 mb-4">
          My Connections
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          View your study partner connections...
        </p>
      </div>
    </div>
  );
};

export default MyConnections;

