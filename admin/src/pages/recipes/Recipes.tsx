import {FC, useCallback, useContext} from 'react';
import {Box, Breadcrumbs, Link, Paper, Stack, Typography} from '@mui/material';
import {Link as RouterLink} from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {RecipeFilterType, RecipeType, useRecipes} from 'src/api/recipes';
import {PageableFilterParamsType} from 'src/api/common';
import RecipesTable from 'src/components/recipes/RecipesTable';
import RecipesFilterBox from 'src/components/recipes/RecipesFilterBox';
import RecipeCreationDialog from 'src/components/recipes/RecipeCreationDialog';
import {AppContext} from 'src/state/context';
import {StoreActions} from 'src/state/reducers';

const Recipes: FC = () => {
    const { state, dispatch } = useContext(AppContext);
    const appStateFilter: RecipeFilterType = state.recipeFilters;
    const { data } = useRecipes(appStateFilter);

    const handlePaginationChange = useCallback((newPagination: PageableFilterParamsType<RecipeType>): void => {
        dispatch({ type: StoreActions.UpdateRecipeFilter, payload: newPagination });
    }, [dispatch]);

    const handleFilterChange = useCallback((newSearchFilter: RecipeFilterType): void => {
        dispatch({ type: StoreActions.UpdateRecipeFilter, payload: { ...newSearchFilter, offset: 0 } });
    }, [dispatch]);

    const handleClear = useCallback(() => {
        dispatch({ type: StoreActions.ResetRecipeFilter });
    }, [dispatch]);

    return (
        <>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
                <Link underline="hover" component={RouterLink} to="/">
                    Home
                </Link>
                <Typography color="text.primary">
                    Recipes
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
                            Recipes
                        </Typography>
                        <RecipeCreationDialog />
                    </Box>

                    <Paper elevation={0} sx={{ p: 2 }}>
                        <RecipesFilterBox
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
                                        ? '1 Recipe'
                                        : `${data.page.total} Recipes`}
                                </Typography>
                                <RecipesTable
                                    onPaginationChange={handlePaginationChange}
                                    paginatedRecipes={data}
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
                                    no matching recipes found
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Stack>
            </Box>
        </>
    );
};

export default Recipes;