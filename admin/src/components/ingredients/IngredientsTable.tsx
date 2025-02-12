import * as React from 'react';
import {ChangeEvent, FC, useCallback, useState} from 'react';
import {Table, TableBody, TableCell, TableFooter, TableHead, TablePagination, TableRow} from '@mui/material';
import IngredientsTableRow from 'src/components/ingredients/IngredientsTableRow';
import {PageableFilterParamsType, PaginatedItemsType} from 'src/api/common';
import {IngredientType} from 'src/api/ingredients';
import usePagination from 'src/hooks/usePagination';
import {offsetFromPage, PAGE_SIZES} from 'src/util/pagination';
import SortLabel from 'src/components/tables/SortLabel';

interface IngredientsTableProps {
    paginatedIngredients: PaginatedItemsType<IngredientType>;
    onPaginationChange: (pagination: PageableFilterParamsType<IngredientType>) => void;
}

const DEFAULT_SORTING: Pick<PageableFilterParamsType<IngredientType>, 'sortField' | 'sortDir'> = {
    sortField: 'id',
    sortDir: 'desc',
};

const IngredientsTable: FC<IngredientsTableProps> = (props) => {
    const { paginatedIngredients, onPaginationChange } = props;
    const { items: ingredients, page } = paginatedIngredients;
    const { pageNumber, perPage, totalEntries } = usePagination(page);

    const [sorting, setSorting] = useState(DEFAULT_SORTING);

    const handlePageNumberChange = useCallback((event: React.MouseEvent<HTMLButtonElement> | null, newPageNumber: number): void => {
        onPaginationChange({ ...page, offset: offsetFromPage(newPageNumber, perPage) });
    }, [onPaginationChange, page, perPage]);

    const handlePageSizeChange = useCallback((event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        onPaginationChange({ ...page, offset: 0, limit: Number(event.target.value) });
    }, [onPaginationChange, page]);

    const handleSortChange = useCallback((field: keyof IngredientType, direction?: 'asc' | 'desc') => {
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
                    <TableCell width="5%">
                        <SortLabel
                            sortDirection={sorting.sortField === 'unit' ? sorting.sortDir : undefined}
                            onSortChange={(direction) => handleSortChange('unit', direction)}
                        >
                            Unit
                        </SortLabel>
                    </TableCell>
                    <TableCell width="5%">
                        <SortLabel
                            sortDirection={sorting.sortField === 'netPrice' ? sorting.sortDir : undefined}
                            onSortChange={(direction) => handleSortChange('netPrice', direction)}
                        >
                            Price
                        </SortLabel>
                    </TableCell>
                    <TableCell width="5%">
                        <SortLabel
                            sortDirection={sorting.sortField === 'stock' ? sorting.sortDir : undefined}
                            onSortChange={(direction) => handleSortChange('stock', direction)}
                        >
                            Stock
                        </SortLabel>
                    </TableCell>
                    <TableCell width="5%">
                        <SortLabel
                            sortDirection={sorting.sortField === 'calories' ? sorting.sortDir : undefined}
                            onSortChange={(direction) => handleSortChange('calories', direction)}
                        >
                            Calories
                        </SortLabel>
                    </TableCell>
                    <TableCell width="5%">
                        <SortLabel
                            sortDirection={sorting.sortField === 'carbohydrates' ? sorting.sortDir : undefined}
                            onSortChange={(direction) => handleSortChange('carbohydrates', direction)}
                        >
                            Carbs
                        </SortLabel>
                    </TableCell>
                    <TableCell width="5%">
                        <SortLabel
                            sortDirection={sorting.sortField === 'protein' ? sorting.sortDir : undefined}
                            onSortChange={(direction) => handleSortChange('protein', direction)}
                        >
                            Protein
                        </SortLabel>
                    </TableCell>
                    <TableCell width="20%">Supplier</TableCell>
                    <TableCell width="10%">Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {ingredients.map((ingredient: IngredientType) => (
                    <IngredientsTableRow
                        key={ingredient.id}
                        ingredient={ingredient}
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

export default IngredientsTable;