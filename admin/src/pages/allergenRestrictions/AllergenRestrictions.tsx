import {FC, useCallback, useContext} from 'react';
import {Box, Breadcrumbs, Link, Paper, Stack, Typography} from '@mui/material';
import {Link as RouterLink} from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {
    AllergenRestrictionFilterType,
    AllergenRestrictionType,
    useAllergenRestrictions
} from 'src/api/allergenRestrictions';
import {PageableFilterParamsType} from 'src/api/common';
import AllergenRestrictionsTable from 'src/components/allergenRestrictions/AllergenRestrictionsTable';
import AllergenRestrictionsFilterBox from 'src/components/allergenRestrictions/AllergenRestrictionsFilterBox';
import AllergenRestrictionCreationDialog from 'src/components/allergenRestrictions/AllergenRestrictionCreationDialog';
import {AppContext} from 'src/state/context';
import {StoreActions} from 'src/state/reducers';

const AllergenRestrictions: FC = () => {
    const { state, dispatch } = useContext(AppContext);
    const appStateFilter: AllergenRestrictionFilterType = state.allergenRestrictionFilters;
    const { data } = useAllergenRestrictions(appStateFilter);

    const handlePaginationChange = useCallback((newPagination: PageableFilterParamsType<AllergenRestrictionType>): void => {
        dispatch({ type: StoreActions.UpdateAllergenRestrictionFilter, payload: newPagination });
    }, [dispatch]);

    const handleFilterChange = useCallback((newSearchFilter: AllergenRestrictionFilterType): void => {
        dispatch({ type: StoreActions.UpdateAllergenRestrictionFilter, payload: { ...newSearchFilter, offset: 0 } });
    }, [dispatch]);

    const handleClear = useCallback(() => {
        dispatch({ type: StoreActions.ResetAllergenRestrictionFilter });
    }, [dispatch]);

    return (
        <>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small"/>}>
                <Link underline="hover" component={RouterLink} to="/">
                    Home
                </Link>
                <Typography color="text.primary">
                    Allergen Restrictions
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
                            Allergen Restrictions
                        </Typography>
                        <AllergenRestrictionCreationDialog/>
                    </Box>

                    <Paper elevation={0} sx={{ p: 2 }}>
                        <AllergenRestrictionsFilterBox
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
                                        ? '1 Allergen Restriction'
                                        : `${data.page.total} Allergen Restrictions`}
                                </Typography>
                                <AllergenRestrictionsTable
                                    onPaginationChange={handlePaginationChange}
                                    paginatedAllergens={data}
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
                                    no matching allergen restrictions found
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Stack>
            </Box>
        </>
    );
};

export default AllergenRestrictions;