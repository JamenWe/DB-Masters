// The selectable amounts of elements per page
import { PaginatedItemsType } from 'src/api/common';

export const PAGE_SIZES = [25, 50, 100];

// The default amount of elements per page, if not explicitly overridden
export const DEFAULT_PAGE_SIZE = PAGE_SIZES[1];

export const offsetFromPage = (pageNumber: number, perPage: number): number => {
    // page number is 0-based
    return pageNumber * perPage;
};

export const calculatePageNumber = (offset: number, limit: number): number => {
    return Math.floor(offset / limit);
};

export const calculateTotalPages = (totalEntries: number, limit: number): number => {
    return Math.ceil(totalEntries / limit);
};

/**
 * Helper function to create a paginated item list on the fly.
 */
export const createPageOf = <T>(items: T[]): PaginatedItemsType<T> => ({
    items: items,
    page: {
        offset: 0,
        limit: items.length > DEFAULT_PAGE_SIZE ? items.length : DEFAULT_PAGE_SIZE,
        total: items.length,
    },
});
