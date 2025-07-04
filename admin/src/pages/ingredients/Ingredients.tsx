import React, {FC, useCallback, useContext} from 'react';
import {Box, Breadcrumbs, Link, Paper, Stack, Typography} from '@mui/material';
import {Link as RouterLink} from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {IngredientFilterType, IngredientType, useIngredients} from 'src/api/ingredients';
import {PageableFilterParamsType} from 'src/api/common';
import IngredientsTable from 'src/components/ingredients/IngredientsTable';
import IngredientsFilterBox from 'src/components/ingredients/IngredientsFilterBox';
import IngredientCreationDialog from 'src/components/ingredients/IngredientCreationDialog';
import {AppContext} from 'src/state/context';
import {StoreActions} from 'src/state/reducers';

const Ingredients: FC = () => {
    const { state, dispatch } = useContext(AppContext);
    const appStateFilter: IngredientFilterType = state.ingredientFilters;
    const { data } = useIngredients(appStateFilter);

    const handlePaginationChange = useCallback((newPagination: PageableFilterParamsType<IngredientType>): void => {
        dispatch({ type: StoreActions.UpdateIngredientFilter, payload: newPagination });
    }, [dispatch]);

    const handleFilterChange = useCallback((newSearchFilter: IngredientFilterType): void => {
        dispatch({ type: StoreActions.UpdateIngredientFilter, payload: { ...newSearchFilter, offset: 0 } });
    }, [dispatch]);

    const handleClear = useCallback(() => {
        dispatch({ type: StoreActions.ResetIngredientFilter });
    }, [dispatch]);

    return (
        <>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small"/>}>
                <Link underline="hover" component={RouterLink} to="/">
                    Home
                </Link>
                <Typography color="text.primary">
                    Ingredients
                </Typography>
            </Breadcrumbs>

            <Box sx={{ mt: 2 }}>
                <Stack spacing={2}>
                    <Box
                        display='flex'
                        justifyContent='space-between'
                        sx={{ pr: 2 }}
                    >
                        <Typography variant="h4">
                            Ingredients
                        </Typography>
                        <IngredientCreationDialog/>
                    </Box>

                    <Paper elevation={0} sx={{ p: 2 }}>
                        <IngredientsFilterBox
                            filter={appStateFilter}
                            onChange={handleFilterChange}
                            onClear={handleClear}
                        />
                    </Paper>

                    <Paper elevation={0} sx={{ p: 2, overflowX: 'scroll' }}>
                        {data && data.page.total > 0 ? (
                            <Stack spacing={2}>
                                <Typography variant="h6">
                                    {data.page.total === 1
                                        ? '1 Ingredient'
                                        : `${data.page.total} Ingredients`}
                                </Typography>
                                <IngredientsTable
                                    onPaginationChange={handlePaginationChange}
                                    paginatedIngredients={data}
                                />
                            </Stack>
                        ) : (
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: 100,
                            }}>
                                <Typography color="text.secondary">
                                    no matching ingredients found
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Stack>
            </Box>
        </>
    );
};

export default Ingredients;