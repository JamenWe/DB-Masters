// src/components/suppliers/SuppliersTable.tsx
import * as React from 'react';
import {ChangeEvent, FC, useCallback, useState} from 'react';
import {Table, TableBody, TableCell, TableFooter, TableHead, TablePagination, TableRow} from '@mui/material';
import SuppliersTableRow from 'src/components/suppliers/SuppliersTableRow';
import {PageableFilterParamsType, PaginatedItemsType} from 'src/api/common';
import {SupplierType} from 'src/api/suppliers';
import usePagination from 'src/hooks/usePagination';
import {offsetFromPage, PAGE_SIZES} from 'src/util/pagination';
import SortLabel from 'src/components/tables/SortLabel';

interface SuppliersTableProps {
    paginatedSuppliers: PaginatedItemsType<SupplierType>;
    onPaginationChange: (pagination: PageableFilterParamsType<SupplierType>) => void;
}

const DEFAULT_SORTING: Pick<PageableFilterParamsType<SupplierType>, 'sortField' | 'sortDir'> = {
    sortField: 'id',
    sortDir: 'desc',
};

const SuppliersTable: FC<SuppliersTableProps> = (props) => {
    const { paginatedSuppliers, onPaginationChange } = props;
    const { items: suppliers, page } = paginatedSuppliers;
    const { pageNumber, perPage, totalEntries } = usePagination(page);

    const [sorting, setSorting] = useState(DEFAULT_SORTING);

    const handlePageNumberChange = useCallback((event: React.MouseEvent<HTMLButtonElement> | null, newPageNumber: number): void => {
        onPaginationChange({ ...page, offset: offsetFromPage(newPageNumber, perPage) });
    }, [onPaginationChange, page, perPage]);

    const handlePageSizeChange = useCallback((event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        onPaginationChange({ ...page, offset: 0, limit: Number(event.target.value) });
    }, [onPaginationChange, page]);

    const handleSortChange = useCallback((field: keyof SupplierType, direction?: 'asc' | 'desc') => {
        const newSorting = { sortField: field, sortDir: direction };
        setSorting(newSorting);
        onPaginationChange({ ...page, ...newSorting });
    }, [onPaginationChange, page]);

    return (
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell width="5%">
                        <SortLabel
                            sortDirection={sorting.sortField === 'id' ? sorting.sortDir : undefined}
                            onSortChange={(direction) => handleSortChange('id', direction)}
                        >
                            ID
                        </SortLabel>
                    </TableCell>
                    <TableCell width="15%">
                        <SortLabel
                            sortDirection={sorting.sortField === 'name' ? sorting.sortDir : undefined}
                            onSortChange={(direction) => handleSortChange('name', direction)}
                        >
                            Name
                        </SortLabel>
                    </TableCell>
                    <TableCell width="30%">Address</TableCell>
                    <TableCell width="15%">
                        <SortLabel
                            sortDirection={sorting.sortField === 'phone' ? sorting.sortDir : undefined}
                            onSortChange={(direction) => handleSortChange('phone', direction)}
                        >
                            Phone
                        </SortLabel>
                    </TableCell>
                    <TableCell width="20%">
                        <SortLabel
                            sortDirection={sorting.sortField === 'email' ? sorting.sortDir : undefined}
                            onSortChange={(direction) => handleSortChange('email', direction)}
                        >
                            Email
                        </SortLabel>
                    </TableCell>
                    <TableCell width="15%">Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {suppliers.map((supplier: SupplierType) => (
                    <SuppliersTableRow
                        key={supplier.id}
                        supplier={supplier}
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

export default SuppliersTable;