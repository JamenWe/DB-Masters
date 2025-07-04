import * as React from 'react';
import {ChangeEvent, FC, useCallback, useState} from 'react';
import {Table, TableBody, TableCell, TableFooter, TableHead, TablePagination, TableRow} from '@mui/material';
import CustomersTableRow from 'src/components/customers/CustomersTableRow';
import {PageableFilterParamsType, PaginatedItemsType} from 'src/api/common';
import {CustomerType} from 'src/api/customers';
import usePagination from 'src/hooks/usePagination';
import {offsetFromPage, PAGE_SIZES} from 'src/util/pagination';
import SortLabel from 'src/components/tables/SortLabel';

interface CustomersTableProps {
    paginatedCustomers: PaginatedItemsType<CustomerType>;
    onPaginationChange: (pagination: PageableFilterParamsType<CustomerType>) => void;
}

const DEFAULT_SORTING: Pick<PageableFilterParamsType<CustomerType>, 'sortField' | 'sortDir'> = {
    sortField: 'id',
    sortDir: 'desc',
};

/**
 * Table for listing customers.
 */
const CustomersTable: FC<CustomersTableProps> = (props) => {
    const { paginatedCustomers, onPaginationChange } = props;
    const { items, page } = paginatedCustomers;
    const { pageNumber, perPage, totalEntries } = usePagination(page);

    const [sorting, setSorting] = useState(DEFAULT_SORTING);

    const handlePageNumberChange = useCallback((event: React.MouseEvent<HTMLButtonElement> | null, newPageNumber: number): void => {
        onPaginationChange({ ...page, offset: offsetFromPage(newPageNumber, perPage) });
    }, [onPaginationChange, page, perPage]);

    const handlePageSizeChange = useCallback((event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        onPaginationChange({ ...page, offset: 0, limit: Number(event.target.value) });
    }, [onPaginationChange, page]);

    const handleSortChange = useCallback((field: keyof CustomerType, direction?: 'asc' | 'desc') => {
        const newSorting = { sortField: field, sortDir: direction };

        setSorting(newSorting);
        onPaginationChange({ ...page, ...newSorting });
    }, [onPaginationChange, page]);

    return (
        <Table
            size="small"
        >
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
                    <TableCell width="10%">
                        <SortLabel
                            sortDirection={sorting.sortField === 'lastName' ? sorting.sortDir : undefined}
                            onSortChange={(direction) => handleSortChange('lastName', direction)}
                        >
                            Last Name
                        </SortLabel>
                    </TableCell>
                    <TableCell width="10%">
                        <SortLabel
                            sortDirection={sorting.sortField === 'firstName' ? sorting.sortDir : undefined}
                            onSortChange={(direction) => handleSortChange('firstName', direction)}
                        >
                            First Name
                        </SortLabel>
                    </TableCell>
                    <TableCell width="10%">
                        <SortLabel
                            sortDirection={sorting.sortField === 'dateOfBirth' ? sorting.sortDir : undefined}
                            onSortChange={(direction) => handleSortChange('dateOfBirth', direction)}
                        >
                            Date of Birth
                        </SortLabel>
                    </TableCell>
                    <TableCell width="20%">Address</TableCell>
                    <TableCell width="10%">
                        <SortLabel
                            sortDirection={sorting.sortField === 'phone' ? sorting.sortDir : undefined}
                            onSortChange={(direction) => handleSortChange('phone', direction)}
                        >
                            Phone
                        </SortLabel>
                    </TableCell>
                    <TableCell width="15%">
                        <SortLabel
                            sortDirection={sorting.sortField === 'email' ? sorting.sortDir : undefined}
                            onSortChange={(direction) => handleSortChange('email', direction)}
                        >
                            Email
                        </SortLabel>
                    </TableCell>
                    <TableCell width="10%">Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {items.map((customer: CustomerType) => (
                    <CustomersTableRow
                        key={customer.id}
                        customer={customer}
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

export default CustomersTable;