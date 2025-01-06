import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from './PaginationIcon';

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    itemsPerPage,
    onItemsPerPageChange,
    totalItems
}) => {
    // Ensure values are numeric
    const numericCurrentPage = parseInt(currentPage);
    const numericTotalPages = parseInt(totalPages);

    const handlePageChange = (newPage) => {
        // Validate the new page number
        if (newPage < 1 || newPage > numericTotalPages) {
            return;
        }
        onPageChange(newPage);
    };

    const handleNext = () => {
        if (numericCurrentPage < numericTotalPages) {
            handlePageChange(numericCurrentPage + 1);
        }
    };

    const handlePrevious = () => {
        if (numericCurrentPage > 1) {
            handlePageChange(numericCurrentPage - 1);
        }
    };

    // Generate page numbers array with ellipsis
    const getPageNumbers = () => {
        const delta = 1;
        const range = [];
        const rangeWithDots = [];

        for (
            let i = Math.max(2, numericCurrentPage - delta);
            i <= Math.min(numericTotalPages - 1, numericCurrentPage + delta);
            i++
        ) {
            range.push(i);
        }

        if (numericCurrentPage - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (numericCurrentPage + delta < numericTotalPages - 1) {
            rangeWithDots.push('...', numericTotalPages);
        } else if (numericTotalPages > 1) {
            rangeWithDots.push(numericTotalPages);
        }

        return rangeWithDots;
    };

    // Calculate current items range
    const startItem = Math.min((numericCurrentPage - 1) * itemsPerPage + 1, totalItems);
    const endItem = Math.min(numericCurrentPage * itemsPerPage, totalItems);

    // Button classes
    const buttonBaseClasses = "p-1 rounded-md transition-colors";
    const buttonActiveClasses = "text-gray-400 hover:text-blue-400 hover:bg-gray-800";
    const buttonDisabledClasses = "text-gray-600 cursor-not-allowed";

    return (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-700">
            {/* Items per page selector */}
            <div className="flex items-center text-sm text-gray-400">
                <span>Show</span>
                <select
                    className="mx-2 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={itemsPerPage}
                    onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                >
                    {[10, 15].map(size => (
                        <option key={size} value={size}>{size}</option>
                    ))}
                </select>
                <span>
                    Showing {startItem} - {endItem} of {totalItems}
                </span>
            </div>

            {/* Page navigation */}
            <div className="flex items-center space-x-2">
                {/* First page */}
                <button
                    onClick={() => handlePageChange(1)}
                    disabled={numericCurrentPage === 1}
                    className={`${buttonBaseClasses} ${numericCurrentPage === 1 ? buttonDisabledClasses : buttonActiveClasses
                        }`}
                    title="First Page"
                >
                    <ChevronsLeft className="h-5 w-5" />
                </button>

                {/* Previous page */}
                <button
                    onClick={handlePrevious}
                    disabled={numericCurrentPage === 1}
                    className={`${buttonBaseClasses} ${numericCurrentPage === 1 ? buttonDisabledClasses : buttonActiveClasses
                        }`}
                    title="Previous Page"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>

                {/* Page numbers */}
                <div className="flex space-x-1">
                    {getPageNumbers().map((page, index) => (
                        <button
                            key={index}
                            onClick={() => typeof page === 'number' ? handlePageChange(page) : null}
                            disabled={page === '...'}
                            className={`px-3 py-1 rounded-md text-sm transition-colors ${page === numericCurrentPage
                                ? 'bg-blue-500 text-white'
                                : page === '...'
                                    ? 'text-gray-400 cursor-default'
                                    : 'text-gray-400 hover:text-blue-400 hover:bg-gray-800'
                                }`}
                        >
                            {page}
                        </button>
                    ))}
                </div>

                {/* Next page */}
                <button
                    onClick={handleNext}
                    disabled={numericCurrentPage === numericTotalPages}
                    className={`${buttonBaseClasses} ${numericCurrentPage === numericTotalPages ? buttonDisabledClasses : buttonActiveClasses
                        }`}
                    title="Next Page"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>

                {/* Last page */}
                <button
                    onClick={() => handlePageChange(numericTotalPages)}
                    disabled={numericCurrentPage === numericTotalPages}
                    className={`${buttonBaseClasses} ${numericCurrentPage === numericTotalPages ? buttonDisabledClasses : buttonActiveClasses
                        }`}
                    title="Last Page"
                >
                    <ChevronsRight className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};

export default Pagination;