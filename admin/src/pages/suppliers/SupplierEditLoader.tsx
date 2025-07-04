import {FC} from 'react';
import {Link as RouterLink, useParams} from 'react-router-dom';
import {Box, Breadcrumbs, CircularProgress, Link, Typography} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ErrorPage from 'src/pages/ErrorPage';
import {useSupplier} from 'src/api/suppliers';
import SupplierEdit from './SupplierEdit';

const SupplierEditLoader: FC = () => {
    const { id } = useParams();
    const { data: supplier, isLoading } = useSupplier(Number(id));

    if (isLoading) {
        return (
            <>
                <Breadcrumbs separator={<NavigateNextIcon fontSize="small"/>}>
                    <Link underline="hover" component={RouterLink} to="/">
                        Home
                    </Link>
                    <Link underline="hover" component={RouterLink} to="/suppliers">
                        Suppliers
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

    if (!supplier) {
        return <ErrorPage code={404} message={`Supplier #${id} does not exist`}/>;
    }

    return <SupplierEdit supplier={supplier}/>;
};

export default SupplierEditLoader;