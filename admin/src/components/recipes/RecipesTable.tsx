import React, {ChangeEvent, FC, useCallback, useState} from 'react';
import {Table, TableBody, TableCell, TableFooter, TableHead, TablePagination, TableRow} from '@mui/material';
import RecipesTableRow from 'src/components/recipes/RecipesTableRow';
import {PageableFilterParamsType, PaginatedItemsType} from 'src/api/common';
import {BasicRecipeType} from 'src/api/recipes';
import usePagination from 'src/hooks/usePagination';
import {offsetFromPage, PAGE_SIZES} from 'src/util/pagination';
import SortLabel from 'src/components/tables/SortLabel';

interface RecipesTableProps {
    paginatedRecipes: PaginatedItemsType<BasicRecipeType>;
    onPaginationChange: (pagination: PageableFilterParamsType<BasicRecipeType>) => void;
}

const DEFAULT_SORTING: Pick<PageableFilterParamsType<BasicRecipeType>, 'sortField' | 'sortDir'> = {
    sortField: 'id',
    sortDir: 'desc',
};

const RecipesTable: FC<RecipesTableProps> = (props) => {
    const { paginatedRecipes, onPaginationChange } = props;
    const { items: recipes, page } = paginatedRecipes;
    const { pageNumber, perPage, totalEntries } = usePagination(page);

    const [sorting, setSorting] = useState(DEFAULT_SORTING);

    const handlePageNumberChange = useCallback((event: React.MouseEvent<HTMLButtonElement> | null, newPageNumber: number): void => {
        onPaginationChange({ ...page, offset: offsetFromPage(newPageNumber, perPage) });
    }, [onPaginationChange, page, perPage]);

    const handlePageSizeChange = useCallback((event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        onPaginationChange({ ...page, offset: 0, limit: Number(event.target.value) });
    }, [onPaginationChange, page]);

    const handleSortChange = useCallback((field: keyof BasicRecipeType, direction?: 'asc' | 'desc') => {
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
                    <TableCell width="20%">
                        <SortLabel
                            sortDirection={sorting.sortField === 'name' ? sorting.sortDir : undefined}
                            onSortChange={(direction) => handleSortChange('name', direction)}
                        >
                            Name
                        </SortLabel>
                    </TableCell>
                    <TableCell width="10%">
                        <SortLabel
                            sortDirection={sorting.sortField === 'netPrice' ? sorting.sortDir : undefined}
                            onSortChange={(direction) => handleSortChange('netPrice', direction)}
                        >
                            Net Price
                        </SortLabel>
                    </TableCell>
                    <TableCell width="10%">Preparation Time</TableCell>
                    <TableCell width="20%">Nutritional Categories</TableCell>
                    <TableCell width="20%">Allergen Restrictions</TableCell>
                    <TableCell width="10%">Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {recipes.map((recipe: BasicRecipeType) => (
                    <RecipesTableRow
                        key={recipe.id}
                        recipe={recipe}
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

export default RecipesTable;