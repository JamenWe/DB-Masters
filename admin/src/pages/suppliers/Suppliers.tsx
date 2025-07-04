import React, {FC, useCallback, useContext} from 'react';
import {Box, Breadcrumbs, Link, Paper, Stack, Typography} from '@mui/material';
import {Link as RouterLink} from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {SupplierFilterType, SupplierType, useSuppliers} from 'src/api/suppliers';
import {PageableFilterParamsType} from 'src/api/common';
import SuppliersTable from 'src/components/suppliers/SuppliersTable';
import SuppliersFilterBox from 'src/components/suppliers/SuppliersFilterBox';
import SupplierCreationDialog from 'src/components/suppliers/SupplierCreationDialog';
import {AppContext} from 'src/state/context';
import {StoreActions} from 'src/state/reducers';

const Suppliers: FC = () => {
    const { state, dispatch } = useContext(AppContext);
    const appStateFilter: SupplierFilterType = state.supplierFilters;
    const { data } = useSuppliers(appStateFilter);

    const handlePaginationChange = useCallback((newPagination: PageableFilterParamsType<SupplierType>): void => {
        dispatch({ type: StoreActions.UpdateSupplierFilter, payload: newPagination });
    }, [dispatch]);

    const handleFilterChange = useCallback((newSearchFilter: SupplierFilterType): void => {
        dispatch({ type: StoreActions.UpdateSupplierFilter, payload: { ...newSearchFilter, offset: 0 } });
    }, [dispatch]);

    const handleClear = useCallback(() => {
        dispatch({ type: StoreActions.ResetSupplierFilter });
    }, [dispatch]);

    return (
        <>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small"/>}>
                <Link underline="hover" component={RouterLink} to="/">
                    Home
                </Link>
                <Typography color="text.primary">
                    Suppliers
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
                            Suppliers
                        </Typography>
                        <SupplierCreationDialog/>
                    </Box>

                    <Paper elevation={0} sx={{ p: 2 }}>
                        <SuppliersFilterBox
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
                                        ? '1 Supplier'
                                        : `${data.page.total} Suppliers`}
                                </Typography>
                                <SuppliersTable
                                    onPaginationChange={handlePaginationChange}
                                    paginatedSuppliers={data}
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
                                    no matching suppliers found
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Stack>
            </Box>
        </>
    );
};

export default Suppliers;