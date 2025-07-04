import {FC} from 'react';
import {Link as RouterLink, useParams} from 'react-router-dom';
import {Box, Breadcrumbs, CircularProgress, Link, Typography} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ErrorPage from 'src/pages/ErrorPage';
import {useAllergenRestriction} from 'src/api/allergenRestrictions';
import AllergenRestrictionEdit from './AllergenRestrictionEdit';

const AllergenRestrictionEditLoader: FC = () => {
    const { id } = useParams();
    const { data: allergen, isLoading } = useAllergenRestriction(Number(id));

    if (isLoading) {
        return (
            <>
                <Breadcrumbs separator={<NavigateNextIcon fontSize="small"/>}>
                    <Link underline="hover" component={RouterLink} to="/">
                        Home
                    </Link>
                    <Link underline="hover" component={RouterLink} to="/allergies">
                        Allergen Restrictions
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

    if (!allergen) {
        return <ErrorPage code={404} message={`Allergen Restriction #${id} does not exist`}/>;
    }

    return <AllergenRestrictionEdit allergen={allergen}/>;
};

export default AllergenRestrictionEditLoader;