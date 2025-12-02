import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) {
    return null; // Don't render pagination if there's only one page
  }

  const handlePrev = () => {
    onPageChange(prev => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    onPageChange(prev => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="flex items-center justify-between mt-4 px-2">
      <span className="text-sm text-slate-400">
        Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} 
        - {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} users
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="flex items-center justify-center p-2 bg-slate-700 hover:bg-slate-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-semibold text-slate-300">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center p-2 bg-slate-700 hover:bg-slate-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;