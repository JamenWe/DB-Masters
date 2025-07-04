import * as React from 'react';
import {ChangeEvent, FC, useCallback, useState} from 'react';
import {Table, TableBody, TableCell, TableFooter, TableHead, TablePagination, TableRow} from '@mui/material';
import OrdersTableRow from 'src/components/orders/OrdersTableRow';
import {PageableFilterParamsType, PaginatedItemsType} from 'src/api/common';
import {OrderType} from 'src/api/orders';
import usePagination from 'src/hooks/usePagination';
import {offsetFromPage, PAGE_SIZES} from 'src/util/pagination';
import SortLabel from 'src/components/tables/SortLabel';

interface OrdersTableProps {
    paginatedOrders: PaginatedItemsType<OrderType>;
    onPaginationChange: (pagination: PageableFilterParamsType<OrderType>) => void;
}

const DEFAULT_SORTING: Pick<PageableFilterParamsType<OrderType>, 'sortField' | 'sortDir'> = {
    sortField: 'id',
    sortDir: 'desc',
};

const OrdersTable: FC<OrdersTableProps> = (props) => {
    const { paginatedOrders, onPaginationChange } = props;
    const { items: orders, page } = paginatedOrders;
    const { pageNumber, perPage, totalEntries } = usePagination(page);

    const [sorting, setSorting] = useState(DEFAULT_SORTING);

    const handlePageNumberChange = useCallback((event: React.MouseEvent<HTMLButtonElement> | null, newPageNumber: number): void => {
        onPaginationChange({ ...page, offset: offsetFromPage(newPageNumber, perPage) });
    }, [onPaginationChange, page, perPage]);

    const handlePageSizeChange = useCallback((event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        onPaginationChange({ ...page, offset: 0, limit: Number(event.target.value) });
    }, [onPaginationChange, page]);

    const handleSortChange = useCallback((field: keyof OrderType, direction?: 'asc' | 'desc') => {
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
                            sortDirection={sorting.sortField === 'orderDate' ? sorting.sortDir : undefined}
                            onSortChange={(direction) => handleSortChange('orderDate', direction)}
                        >
                            Date
                        </SortLabel>
                    </TableCell>
                    <TableCell width="15%">Customer</TableCell>
                    <TableCell width="10%">
                        <SortLabel
                            sortDirection={sorting.sortField === 'invoiceAmount' ? sorting.sortDir : undefined}
                            onSortChange={(direction) => handleSortChange('invoiceAmount', direction)}
                        >
                            Amount
                        </SortLabel>
                    </TableCell>
                    <TableCell width="20%">Ingredients</TableCell>
                    <TableCell width="20%">Recipes</TableCell>
                    <TableCell width="10%">Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {orders.map((order: OrderType) => (
                    <OrdersTableRow
                        key={order.id}
                        order={order}
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

export default OrdersTable;