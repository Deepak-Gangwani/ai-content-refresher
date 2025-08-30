import React from 'react';
import { diffLines } from 'diff';

const DiffViewer = ({ oldText = '', newText = '' }) => {
  // Ensure inputs are strings
  const oldStr = String(oldText || '');
  const newStr = String(newText || '');

  if (oldStr === newStr) {
    return <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-2 rounded border border-gray-200 dark:border-gray-600">{newStr || 'No change'}</p>;
  }

  const differences = diffLines(oldStr, newStr);

  return (
    <pre className="text-sm whitespace-pre-wrap font-mono bg-gray-50 dark:bg-gray-900/50 p-3 rounded-md border border-gray-200 dark:border-gray-700 overflow-x-auto">
      {differences.map((part, index) => {
        const style = {
          backgroundColor: part.added ? 'rgba(16, 185, 129, 0.1)' : part.removed ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
          color: part.added ? 'rgb(5 150 105)' : part.removed ? 'rgb(220 38 38)' : 'inherit',
          display: 'block',
          paddingLeft: '1.5em',
          textIndent: '-1.5em',
        };
        
        const darkStyle = {
            color: part.added ? 'rgb(52 211 153)' : part.removed ? 'rgb(248 113 113)' : 'inherit',
        }

        const prefix = part.added ? '+' : part.removed ? '-' : ' ';
        
        // Don't render unchanged lines that are just whitespace
        if (!part.added && !part.removed && part.value.trim() === '') {
          return null;
        }

        return (
          <span key={index} className="dark:!bg-transparent" style={style}>
            <span className="select-none w-4 inline-block">{prefix}</span>
            <span className="dark:!text-inherit" style={darkStyle}>{part.value}</span>
          </span>
        );
      })}
    </pre>
  );
};

export default DiffViewer;
