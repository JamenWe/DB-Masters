import { PageType } from 'src/api/common';
import { useMemo } from 'react';
import { calculatePageNumber, calculateTotalPages } from 'src/util/pagination';

export type PaginationType = {
    pageNumber: number;
    perPage: number;
    totalEntries: number;
    totalPages: number;
};

/**
 * A hook, which calculates pagination numbers from offset- and limit-based pages.
 */
const usePagination = (page: PageType): PaginationType => {
    const { offset, limit, total } = page;

    return useMemo(() => ({
        pageNumber: calculatePageNumber(offset, limit),
        perPage: limit,
        totalEntries: total,
        totalPages: calculateTotalPages(total, limit),
    }), [limit, offset, total]);
};

export default usePagination;
