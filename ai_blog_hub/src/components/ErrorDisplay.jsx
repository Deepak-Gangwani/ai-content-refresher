import React from 'react';
import { AlertTriangle, WifiOff, RefreshCw } from 'lucide-react';

const ErrorDisplay = ({ error, onRetry }) => {
  const isNetworkError = error && error.toLowerCase().includes('network error');
  const isPermissionError = error && error.toLowerCase().includes('permission denied');

  return (
    <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-6 rounded-md my-6" role="alert">
      <div className="flex">
        <div className="py-1">
          {isNetworkError ? (
            <WifiOff className="h-6 w-6 text-red-500 mr-4" />
          ) : (
            <AlertTriangle className="h-6 w-6 text-red-500 mr-4" />
          )}
        </div>
        <div>
          <p className="font-bold">
            {isNetworkError ? 'API Connection Failed' : isPermissionError ? 'Access Denied' : 'An Error Occurred'}
          </p>
          <p className="text-sm">{error}</p>
          {isNetworkError && (
            <p className="text-sm mt-2 text-red-600 dark:text-red-400">
              This usually means the backend server is not running. Please start your Django server and then try again.
            </p>
          )}
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;
