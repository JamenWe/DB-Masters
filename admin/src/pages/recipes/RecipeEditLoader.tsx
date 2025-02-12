import {FC} from 'react';
import {Link as RouterLink, useParams} from 'react-router-dom';
import {Box, Breadcrumbs, CircularProgress, Link, Typography} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ErrorPage from 'src/pages/ErrorPage';
import {useRecipe} from 'src/api/recipes';
import RecipeEdit from "src/pages/recipes/RecipeEdit";

const RecipeEditLoader: FC = () => {
    const { id } = useParams();
    const { data: recipe, isLoading } = useRecipe(Number(id));

    if (isLoading) {
        return (
            <>
                <Breadcrumbs separator={<NavigateNextIcon fontSize="small"/>}>
                    <Link underline="hover" component={RouterLink} to="/">
                        Home
                    </Link>
                    <Link underline="hover" component={RouterLink} to="/recipes">
                        Recipes
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

    if (!recipe) {
        return <ErrorPage code={404} message={`Recipe #${id} does not exist`}/>;
    }

    return <RecipeEdit recipe={recipe}/>;
};

export default RecipeEditLoader;