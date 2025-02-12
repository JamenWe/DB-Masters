import {FC} from 'react';
import {Link as RouterLink, useParams} from 'react-router-dom';
import {Box, Breadcrumbs, CircularProgress, Link, Typography} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ErrorPage from 'src/pages/ErrorPage';
import {useNutritionalCategory} from 'src/api/nutritionalCategories';
import NutritionalCategoryEdit from './NutritionalCategoryEdit';

const NutritionalCategoryEditLoader: FC = () => {
    const { id } = useParams();
    const { data: category, isLoading } = useNutritionalCategory(Number(id));

    if (isLoading) {
        return (
            <>
                <Breadcrumbs separator={<NavigateNextIcon fontSize="small"/>}>
                    <Link underline="hover" component={RouterLink} to="/">
                        Home
                    </Link>
                    <Link underline="hover" component={RouterLink} to="/nutrition">
                        Nutritional Categories
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

    if (!category) {
        return <ErrorPage code={404} message={`Nutritional Category #${id} does not exist`}/>;
    }

    return <NutritionalCategoryEdit category={category}/>;
};

export default NutritionalCategoryEditLoader;