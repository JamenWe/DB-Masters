import {FC, useCallback, useContext} from 'react';
import {Box, Breadcrumbs, Link, Paper, Stack, Typography} from '@mui/material';
import {Link as RouterLink} from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {OrderFilterType, OrderType, useOrders} from 'src/api/orders';
import {PageableFilterParamsType} from 'src/api/common';
import OrdersTable from 'src/components/orders/OrdersTable';
import OrdersFilterBox from 'src/components/orders/OrdersFilterBox';
import OrderCreationDialog from 'src/components/orders/OrderCreationDialog';
import {AppContext} from 'src/state/context';
import {StoreActions} from 'src/state/reducers';

const Orders: FC = () => {
    const { state, dispatch } = useContext(AppContext);
    const appStateFilter: OrderFilterType = state.orderFilters;
    const { data } = useOrders(appStateFilter);

    const handlePaginationChange = useCallback((newPagination: PageableFilterParamsType<OrderType>): void => {
        dispatch({ type: StoreActions.UpdateOrderFilter, payload: newPagination });
    }, [dispatch]);

    const handleFilterChange = useCallback((newSearchFilter: OrderFilterType): void => {
        dispatch({ type: StoreActions.UpdateOrderFilter, payload: { ...newSearchFilter, offset: 0 } });
    }, [dispatch]);

    const handleClear = useCallback(() => {
        dispatch({ type: StoreActions.ResetOrderFilter });
    }, [dispatch]);

    return (
        <>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small"/>}>
                <Link underline="hover" component={RouterLink} to="/">
                    Home
                </Link>
                <Typography color="text.primary">
                    Orders
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
                            Orders
                        </Typography>
                        <OrderCreationDialog/>
                    </Box>

                    <Paper elevation={0} sx={{ p: 2 }}>
                        <OrdersFilterBox
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
                                        ? '1 Order'
                                        : `${data.page.total} Orders`}
                                </Typography>
                                <OrdersTable
                                    onPaginationChange={handlePaginationChange}
                                    paginatedOrders={data}
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
                                    no matching orders found
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Stack>
            </Box>
        </>
    );
};

export default Orders;