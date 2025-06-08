import React from "react";
import { setCurrentPage } from "../../store/features/paginationSlice";
import { useDispatch, useSelector } from "react-redux";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Paginator = () => {
  const dispatch = useDispatch();

  const { itemsPerPage, totalItems, currentPage } = useSelector(
    (state) => state.pagination
  );

  const paginate = (pageNumber) => {
    dispatch(setCurrentPage(pageNumber));
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`w-10 h-10 flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200
            ${
              currentPage === i
                ? "bg-[#537D5D] text-white shadow-sm"
                : "text-gray-700 hover:bg-gray-100 hover:text-[#537D5D]"
            }`}
        >
          {i}
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="flex justify-center items-center space-x-2 my-8">
      <button
        onClick={() => currentPage > 1 && paginate(currentPage - 1)}
        disabled={currentPage === 1}
        className={`w-10 h-10 flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200
          ${
            currentPage === 1
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-100 hover:text-[#537D5D]"
          }`}
      >
        <FaChevronLeft className="w-4 h-4" />
      </button>

      {renderPageNumbers()}

      <button
        onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`w-10 h-10 flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200
          ${
            currentPage === totalPages
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-100 hover:text-[#537D5D]"
          }`}
      >
        <FaChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Paginator;
