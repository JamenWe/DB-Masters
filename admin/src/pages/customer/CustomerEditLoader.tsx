import React, {FC} from 'react';
import {Link as RouterLink, useParams} from 'react-router-dom';
import {Box, Breadcrumbs, CircularProgress, Link, Typography} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ErrorPage from 'src/pages/ErrorPage';
import {useCustomer} from 'src/api/customers';
import CustomerEdit from 'src/pages/customer/CustomerEdit';

/**
 * Wrapper to load a customer and once successful, render the edit page.
 */
const CustomerEditLoader: FC = () => {
    const { id } = useParams();
    const { data: customer, isLoading } = useCustomer(Number(id));

    if (isLoading) {
        return (
            <>
                <Breadcrumbs separator={<NavigateNextIcon fontSize="small"/>}>
                    <Link underline="hover" component={RouterLink} to="/">
                        Home
                    </Link>
                    <Link underline="hover" component={RouterLink} to="/customers">
                        Customers
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

    if (!customer) {
        return <ErrorPage code={404} message={`Customer #${id} does not exist`}/>;
    }

    return <CustomerEdit customer={customer}/>;
};

export default CustomerEditLoader;