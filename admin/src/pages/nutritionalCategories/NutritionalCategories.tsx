import {FC, useCallback, useContext} from 'react';
import {Box, Breadcrumbs, Link, Paper, Stack, Typography} from '@mui/material';
import {Link as RouterLink} from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {
    NutritionalCategoryFilterType,
    NutritionalCategoryType,
    useNutritionalCategories
} from 'src/api/nutritionalCategories';
import {PageableFilterParamsType} from 'src/api/common';
import NutritionalCategoriesTable from 'src/components/nutritionalCategories/NutritionalCategoriesTable';
import NutritionalCategoriesFilterBox from 'src/components/nutritionalCategories/NutritionalCategoriesFilterBox';
import NutritionalCategoryCreationDialog from 'src/components/nutritionalCategories/NutritionalCategoryCreationDialog';
import {AppContext} from 'src/state/context';
import {StoreActions} from 'src/state/reducers';

const NutritionalCategories: FC = () => {
    const { state, dispatch } = useContext(AppContext);
    const appStateFilter: NutritionalCategoryFilterType = state.nutritionalCategoryFilters;
    const { data } = useNutritionalCategories(appStateFilter);

    const handlePaginationChange = useCallback((newPagination: PageableFilterParamsType<NutritionalCategoryType>): void => {
        dispatch({ type: StoreActions.UpdateNutritionalCategoryFilter, payload: newPagination });
    }, [dispatch]);

    const handleFilterChange = useCallback((newSearchFilter: NutritionalCategoryFilterType): void => {
        dispatch({ type: StoreActions.UpdateNutritionalCategoryFilter, payload: { ...newSearchFilter, offset: 0 } });
    }, [dispatch]);

    const handleClear = useCallback(() => {
        dispatch({ type: StoreActions.ResetNutritionalCategoryFilter });
    }, [dispatch]);

    return (
        <>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small"/>}>
                <Link underline="hover" component={RouterLink} to="/">
                    Home
                </Link>
                <Typography color="text.primary">
                    Nutritional Categories
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
                            Nutritional Categories
                        </Typography>
                        <NutritionalCategoryCreationDialog/>
                    </Box>

                    <Paper elevation={0} sx={{ p: 2 }}>
                        <NutritionalCategoriesFilterBox
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
                                        ? '1 Nutritional Category'
                                        : `${data.page.total} Nutritional Categories`}
                                </Typography>
                                <NutritionalCategoriesTable
                                    onPaginationChange={handlePaginationChange}
                                    paginatedCategories={data}
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
                                    no matching nutritional categories found
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Stack>
            </Box>
        </>
    );
};

export default NutritionalCategories;