'use client';

import React from 'react';

const CircularLoader = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-gray-300 dark:border-gray-600 rounded-full animate-spin border-t-purple-600 dark:border-t-purple-300"></div>
        <div className="absolute inset-2 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
      </div>
    </div>
  );
};

export default CircularLoader;