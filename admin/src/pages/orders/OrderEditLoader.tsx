import {FC} from 'react';
import {Link as RouterLink, useParams} from 'react-router-dom';
import {Box, Breadcrumbs, CircularProgress, Link, Typography} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ErrorPage from 'src/pages/ErrorPage';
import {useOrder} from 'src/api/orders';
import OrderEdit from 'src/pages/orders/OrderEdit';

const OrderEditLoader: FC = () => {
    const { id } = useParams();
    const { data: order, isLoading } = useOrder(Number(id));

    if (isLoading) {
        return (
            <>
                <Breadcrumbs separator={<NavigateNextIcon fontSize="small"/>}>
                    <Link underline="hover" component={RouterLink} to="/">
                        Home
                    </Link>
                    <Link underline="hover" component={RouterLink} to="/orders">
                        Orders
                    </Link>
                    <Typography color="text.primary">
                        #{id}
                    </Typography>
                </Breadcrumbs>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 100,
                    }}
                >
                    <CircularProgress />
                </Box>
            </>
        );
    }

    if (!order) {
        return <ErrorPage code={404} message={`Order #${id} does not exist`}/>;
    }

    return <OrderEdit order={order}/>;
};

export default OrderEditLoader;