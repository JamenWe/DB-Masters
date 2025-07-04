import * as React from 'react';
import {ChangeEvent, FC, useCallback, useState} from 'react';
import {Table, TableBody, TableCell, TableFooter, TableHead, TablePagination, TableRow} from '@mui/material';
import AllergenRestrictionsTableRow from 'src/components/allergenRestrictions/AllergenRestrictionsTableRow';
import {PageableFilterParamsType, PaginatedItemsType} from 'src/api/common';
import {AllergenRestrictionType} from 'src/api/allergenRestrictions';
import usePagination from 'src/hooks/usePagination';
import {offsetFromPage, PAGE_SIZES} from 'src/util/pagination';
import SortLabel from 'src/components/tables/SortLabel';

interface AllergenRestrictionsTableProps {
    paginatedAllergens: PaginatedItemsType<AllergenRestrictionType>;
    onPaginationChange: (pagination: PageableFilterParamsType<AllergenRestrictionType>) => void;
}

const DEFAULT_SORTING: Pick<PageableFilterParamsType<AllergenRestrictionType>, 'sortField' | 'sortDir'> = {
    sortField: 'id',
    sortDir: 'desc',
};

const AllergenRestrictionsTable: FC<AllergenRestrictionsTableProps> = (props) => {
    const { paginatedAllergens, onPaginationChange } = props;
    const { items: allergens, page } = paginatedAllergens;
    const { pageNumber, perPage, totalEntries } = usePagination(page);

    const [sorting, setSorting] = useState(DEFAULT_SORTING);

    const handlePageNumberChange = useCallback((event: React.MouseEvent<HTMLButtonElement> | null, newPageNumber: number): void => {
        onPaginationChange({ ...page, offset: offsetFromPage(newPageNumber, perPage) });
    }, [onPaginationChange, page, perPage]);

    const handlePageSizeChange = useCallback((event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        onPaginationChange({ ...page, offset: 0, limit: Number(event.target.value) });
    }, [onPaginationChange, page]);

    const handleSortChange = useCallback((field: keyof AllergenRestrictionType, direction?: 'asc' | 'desc') => {
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
                {allergens.map((allergen: AllergenRestrictionType) => (
                    <AllergenRestrictionsTableRow
                        key={allergen.id}
                        allergen={allergen}
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

export default AllergenRestrictionsTable;