import React, {FC, useCallback, useContext} from 'react';
import {Box, Breadcrumbs, Link, Paper, Stack, Typography} from '@mui/material';
import {Link as RouterLink} from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {CustomerFilterType, CustomerType, useCustomers} from 'src/api/customers';
import {PageableFilterParamsType} from 'src/api/common';
import CustomersTable from 'src/components/customers/CustomersTable';
import CustomersFilterBox from 'src/components/customers/CustomersFilterBox';
import CustomerCreationDialog from 'src/components/customers/CustomerCreationDialog';
import {AppContext} from 'src/state/context';
import {StoreActions} from 'src/state/reducers';

const Customers: FC = () => {
    const { state, dispatch } = useContext(AppContext);
    const appStateFilter: CustomerFilterType = state.customerFilters;
    const { data } = useCustomers(appStateFilter);

    const handlePaginationChange = useCallback((newPagination: PageableFilterParamsType<CustomerType>): void => {
        dispatch({ type: StoreActions.UpdateCustomerFilter, payload: newPagination });
    }, [dispatch]);

    const handleFilterChange = useCallback((newSearchFilter: CustomerFilterType): void => {
        dispatch({ type: StoreActions.UpdateCustomerFilter, payload: { ...newSearchFilter, offset: 0 } });
    }, [dispatch]);

    const handleClear = useCallback(() => {
        dispatch({ type: StoreActions.ResetCustomerFilter });
    }, [dispatch]);

    return (
        <>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small"/>}>
                <Link underline="hover" component={RouterLink} to="/">
                    Home
                </Link>
                <Typography color="text.primary">
                    Customers
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
                            Customers
                        </Typography>
                        <CustomerCreationDialog/>
                    </Box>

                    <Paper elevation={0} sx={{ p: 2 }}>
                        <CustomersFilterBox
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
                                        ? '1 Customer'
                                        : `${data.page.total} Customers`}
                                </Typography>
                                <CustomersTable
                                    onPaginationChange={handlePaginationChange}
                                    paginatedCustomers={data}
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
                                    no matching customers found
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Stack>
            </Box>
        </>
    );
};

export default Customers;