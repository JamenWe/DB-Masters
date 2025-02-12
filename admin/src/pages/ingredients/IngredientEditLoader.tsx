import {FC} from 'react';
import {Link as RouterLink, useParams} from 'react-router-dom';
import {Box, Breadcrumbs, CircularProgress, Link, Typography} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ErrorPage from 'src/pages/ErrorPage';
import {useIngredient} from 'src/api/ingredients';
import IngredientEdit from 'src/pages/ingredients/IngredientEdit';

const IngredientEditLoader: FC = () => {
    const { id } = useParams();
    const { data: ingredient, isLoading } = useIngredient(Number(id));

    if (isLoading) {
        return (
            <>
                <Breadcrumbs separator={<NavigateNextIcon fontSize="small"/>}>
                    <Link underline="hover" component={RouterLink} to="/">
                        Home
                    </Link>
                    <Link underline="hover" component={RouterLink} to="/ingredients">
                        Ingredients
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

    if (!ingredient) {
        return <ErrorPage code={404} message={`Ingredient #${id} does not exist`}/>;
    }

    return <IngredientEdit ingredient={ingredient}/>;
};

export default IngredientEditLoader;