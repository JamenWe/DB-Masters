import * as React from 'react';
import {ChangeEvent, FC, useCallback, useState} from 'react';
import {Table, TableBody, TableCell, TableFooter, TableHead, TablePagination, TableRow} from '@mui/material';
import NutritionalCategoriesTableRow from 'src/components/nutritionalCategories/NutritionalCategoriesTableRow';
import {PageableFilterParamsType, PaginatedItemsType} from 'src/api/common';
import {NutritionalCategoryType} from 'src/api/nutritionalCategories';
import usePagination from 'src/hooks/usePagination';
import {offsetFromPage, PAGE_SIZES} from 'src/util/pagination';
import SortLabel from 'src/components/tables/SortLabel';

interface NutritionalCategoriesTableProps {
    paginatedCategories: PaginatedItemsType<NutritionalCategoryType>;
    onPaginationChange: (pagination: PageableFilterParamsType<NutritionalCategoryType>) => void;
}

const DEFAULT_SORTING: Pick<PageableFilterParamsType<NutritionalCategoryType>, 'sortField' | 'sortDir'> = {
    sortField: 'id',
    sortDir: 'desc',
};

const NutritionalCategoriesTable: FC<NutritionalCategoriesTableProps> = (props) => {
    const { paginatedCategories, onPaginationChange } = props;
    const { items: categories, page } = paginatedCategories;
    const { pageNumber, perPage, totalEntries } = usePagination(page);

    const [sorting, setSorting] = useState(DEFAULT_SORTING);

    const handlePageNumberChange = useCallback((event: React.MouseEvent<HTMLButtonElement> | null, newPageNumber: number): void => {
        onPaginationChange({ ...page, offset: offsetFromPage(newPageNumber, perPage) });
    }, [onPaginationChange, page, perPage]);

    const handlePageSizeChange = useCallback((event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        onPaginationChange({ ...page, offset: 0, limit: Number(event.target.value) });
    }, [onPaginationChange, page]);

    const handleSortChange = useCallback((field: keyof NutritionalCategoryType, direction?: 'asc' | 'desc') => {
        const newSorting = { sortField: field, sortDir: direction };
        setSorting(newSorting);
        onPaginationChange({ ...page, ...newSorting });
    }, [onPaginationChange, page]);

    return (
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell width="10%">
                        <SortLabel
                            sortDirection={sorting.sortField === 'id' ? sorting.sortDir : undefined}
                            onSortChange={(direction) => handleSortChange('id', direction)}
                        >
                            ID
                        </SortLabel>
                    </TableCell>
                    <TableCell width="70%">
                        <SortLabel
                            sortDirection={sorting.sortField === 'name' ? sorting.sortDir : undefined}
                            onSortChange={(direction) => handleSortChange('name', direction)}
                        >
                            Name
                        </SortLabel>
                    </TableCell>
                    <TableCell width="20%">Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {categories.map((category: NutritionalCategoryType) => (
                    <NutritionalCategoriesTableRow
                        key={category.id}
                        category={category}
                    />
                ))}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TablePagination
                        rowsPerPage={perPage}
                        rowsPerPageOptions={PAGE_SIZES}
                        count={totalEntries}
                        page={pageNumber}
                        onPageChange={handlePageNumberChange}
                        onRowsPerPageChange={handlePageSizeChange}
                    />
                </TableRow>
            </TableFooter>
        </Table>
    );
};

export default NutritionalCategoriesTable;