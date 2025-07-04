import React, {ChangeEvent, FC, useCallback, useMemo} from 'react';
import {
    Box,
    Breadcrumbs,
    Divider,
    Link,
    List,
    ListItem,
    ListItemText,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import {Link as RouterLink} from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {AllergenRestrictionType, useAllergenRestrictionUpdate} from 'src/api/allergenRestrictions';
import Grid2 from '@mui/material/Grid2';
import SaveIcon from '@mui/icons-material/Save';
import useObjectMerge from 'src/hooks/useObjectMerge';
import MultiActionButton from 'src/components/buttons/MultiActionButton';
import {useNotification} from 'src/components/notifications/NotificationContextProvider';
import {extractErrorMessage} from 'src/api/common';
import {useRecipesByAllergenRestriction} from "src/api/recipes";

export type AllergenRestrictionEditProps = {
    allergen: AllergenRestrictionType;
};

const AllergenRestrictionEdit: FC<AllergenRestrictionEditProps> = (props) => {
    const { allergen } = props;
    const { data: associatedRecipes = [] } = useRecipesByAllergenRestriction(allergen.id);
    const [tempAllergen, updateTempAllergen] = useObjectMerge(allergen);

    const { dispatchShowNotification } = useNotification();

    const { mutate: saveAllergen, isPending: isSaving } = useAllergenRestrictionUpdate(
        (savedAllergen) => dispatchShowNotification('success', `Successfully updated allergen restriction #${savedAllergen.id}`),
        (error) => dispatchShowNotification('error', extractErrorMessage(error)),
    );

    const handleSave = useCallback(() => {
        saveAllergen(tempAllergen);
    }, [saveAllergen, tempAllergen]);

    const nameErrorText = useMemo(() => {
        if (!tempAllergen.name) {
            return 'Name is required';
        }
        if (tempAllergen.name.length > 50) {
            return 'Name must not be longer than 50 characters';
        }
        return undefined;
    }, [tempAllergen.name]);

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
                    #{allergen.id} - {allergen.name}
                </Typography>
            </Breadcrumbs>

            <Box sx={{ mt: 2 }}>
                <Stack spacing={2}>
                    <Typography variant="h4">
                        Edit Allergen Restriction #{allergen.id}
                    </Typography>

                    <Paper elevation={0} sx={{ p: 3 }}>
                        <Stack spacing={3}>
                            <Grid2 container spacing={3}>
                                <Grid2 flex={12}>
                                    <TextField
                                        label="Name"
                                        required
                                        fullWidth
                                        value={tempAllergen.name}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                            updateTempAllergen({ name: e.target.value })}
                                        error={!!nameErrorText}
                                        helperText={nameErrorText}
                                    />
                                </Grid2>
                            </Grid2>

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <MultiActionButton
                                    size="small"
                                    startIcon={<SaveIcon/>}
                                    title="Save changes"
                                    color="primary"
                                    variant="contained"
                                    disabled={!!nameErrorText || isSaving}
                                    onClick={handleSave}
                                >
                                    Save Allergen Restriction
                                </MultiActionButton>
                            </Box>
                        </Stack>
                    </Paper>

                    {/* Associated Recipes Section */}
                    {associatedRecipes && associatedRecipes.length > 0 && (
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Associated Recipes
                            </Typography>
                            <List>
                                {[...associatedRecipes].reverse().map((recipe, index) => (
                                    <React.Fragment key={recipe.id}>
                                        <ListItem>
                                            <ListItemText
                                                primary={
                                                    <>
                                                        <Link
                                                            component={RouterLink}
                                                            to={`/recipes/${recipe.id}`}
                                                            underline="hover"
                                                        >
                                                            #{recipe.id}
                                                        </Link>
                                                        {} - {recipe.name}
                                                    </>
                                                }
                                            />
                                        </ListItem>
                                        {index < associatedRecipes.length - 1 && (
                                            <Divider component="li" />
                                        )}
                                    </React.Fragment>
                                ))}
                            </List>
                        </Box>
                    )}

                </Stack>
            </Box>
        </>
    );
};

export default AllergenRestrictionEdit;