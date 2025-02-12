// src/pages/recipes/RecipeEdit.tsx
import React, {ChangeEvent, FC, useCallback, useMemo} from 'react';
import {Autocomplete, Box, Breadcrumbs, Chip, Link, Paper, Stack, TextField, Typography,} from '@mui/material';
import {Link as RouterLink} from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {RecipeType, useRecipeUpdate} from 'src/api/recipes';
import Grid2 from '@mui/material/Grid2';
import SaveIcon from '@mui/icons-material/Save';
import useObjectMerge from 'src/hooks/useObjectMerge';
import MultiActionButton from 'src/components/buttons/MultiActionButton';
import {useNotification} from 'src/components/notifications/NotificationContextProvider';
import {extractErrorMessage} from 'src/api/common';
import {useIngredients} from 'src/api/ingredients';
import {useAllergenRestrictions} from 'src/api/allergenRestrictions';
import {useNutritionalCategories} from 'src/api/nutritionalCategories';
import RecipeIngredientsEditor from "src/components/recipes/RecipeIngredientsEditor";
import {hideNumberInputArrows} from "src/util/styles";

export type RecipeEditProps = {
    recipe: RecipeType;
};

const RecipeEdit: FC<RecipeEditProps> = (props) => {
    const { recipe } = props;
    const [tempRecipe, updateTempRecipe] = useObjectMerge(recipe);

    const { dispatchShowNotification } = useNotification();

    // Fetch all available options
    const { data: ingredientsData } = useIngredients({ limit: 1000 });
    const { data: nutritionalCategoriesData } = useNutritionalCategories();
    const { data: allergenRestrictionsData } = useAllergenRestrictions();

    const ingredients = ingredientsData?.items ?? [];
    const nutritionalCategories = nutritionalCategoriesData?.items ?? [];
    const allergenRestrictions = allergenRestrictionsData?.items ?? [];

    const { mutate: saveRecipe, isPending: isSaving } = useRecipeUpdate(
        (savedRecipe) => dispatchShowNotification('success', `Successfully updated recipe #${savedRecipe.id}`),
        (error) => dispatchShowNotification('error', extractErrorMessage(error)),
    );

    const handleSave = useCallback(() => {
        saveRecipe(tempRecipe);
    }, [saveRecipe, tempRecipe]);

    const nameErrorText = useMemo(() => {
        if (!tempRecipe.name) {
            return 'Name is required';
        }
        if (tempRecipe.name.length > 50) {
            return 'Name must not be longer than 50 characters';
        }
        return undefined;
    }, [tempRecipe.name]);

    const priceErrorText = useMemo(() => {
        if (tempRecipe.netPrice === undefined) {
            return 'Price is required';
        }
        if (tempRecipe.netPrice < 0) {
            return 'Price cannot be negative';
        }
        return undefined;
    }, [tempRecipe.netPrice]);

    const isValid = !nameErrorText && !priceErrorText;

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
                    #{recipe.id} - {recipe.name}
                </Typography>
            </Breadcrumbs>

            <Box sx={{ mt: 2 }}>
                <Stack spacing={2}>
                    <Typography variant="h4">
                        Edit Recipe #{recipe.id} - {recipe.name}
                    </Typography>

                    <Paper elevation={0} sx={{ p: 3 }}>
                        <Stack spacing={3}>
                            {/* First Row - Basic Info */}
                            <Grid2 container spacing={3}>
                                <Grid2 flex={6}>
                                    <TextField
                                        label="Name"
                                        required
                                        fullWidth
                                        value={tempRecipe.name}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                            updateTempRecipe({ name: e.target.value })}
                                        error={!!nameErrorText}
                                        helperText={nameErrorText}
                                    />
                                </Grid2>
                                <Grid2 flex={3}>
                                    <TextField
                                        label="Net Price"
                                        required
                                        fullWidth
                                        type="number"
                                        inputProps={{ step: "0.01" }}
                                        value={tempRecipe.netPrice}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                            updateTempRecipe({ netPrice: parseFloat(e.target.value) })}
                                        error={!!priceErrorText}
                                        helperText={priceErrorText}
                                    />
                                </Grid2>
                                <Grid2 flex={3}>
                                    <TextField
                                        label="Preparation Time (minutes)"
                                        fullWidth
                                        type="number"
                                        value={tempRecipe.preparationTime || ''}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                            updateTempRecipe({ preparationTime: parseInt(e.target.value) })}
                                        sx={hideNumberInputArrows}
                                    />
                                </Grid2>
                            </Grid2>

                            {/* Second Row - Instructions */}
                            <Grid2 container spacing={3}>
                                <Grid2 flex={12}>
                                    <TextField
                                        label="Instructions"
                                        fullWidth
                                        multiline
                                        rows={4}
                                        value={tempRecipe.instructions || ''}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                            updateTempRecipe({ instructions: e.target.value })}
                                    />
                                </Grid2>
                            </Grid2>

                            {/* Third Row - Categories and Restrictions */}
                            <Grid2 container spacing={3}>
                                <Grid2 flex={6}>
                                    <Autocomplete
                                        multiple
                                        options={nutritionalCategories}
                                        getOptionLabel={(option) => option.name}
                                        value={nutritionalCategories.filter(cat =>
                                            tempRecipe.nutritionalCategoryIds.includes(cat.id))}
                                        onChange={(_, newValue) => {
                                            updateTempRecipe({
                                                nutritionalCategoryIds: newValue.map(v => v.id)
                                            });
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Nutritional Categories"
                                                fullWidth
                                            />
                                        )}
                                        renderTags={(value, getTagProps) =>
                                            value.map((option, index) => (
                                                <Chip
                                                    label={option.name}
                                                    {...getTagProps({ index })}
                                                />
                                            ))
                                        }
                                    />
                                </Grid2>
                                <Grid2 flex={6}>
                                    <Autocomplete
                                        multiple
                                        options={allergenRestrictions}
                                        getOptionLabel={(option) => option.name}
                                        value={allergenRestrictions.filter(rest =>
                                            tempRecipe.allergenRestrictionIds.includes(rest.id))}
                                        onChange={(_, newValue) => {
                                            updateTempRecipe({
                                                allergenRestrictionIds: newValue.map(v => v.id)
                                            });
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Allergen Restrictions"
                                                fullWidth
                                            />
                                        )}
                                        renderTags={(value, getTagProps) =>
                                            value.map((option, index) => (
                                                <Chip
                                                    label={option.name}
                                                    {...getTagProps({ index })}
                                                />
                                            ))
                                        }
                                    />
                                </Grid2>
                            </Grid2>

                            {/* Fourth Row - Ingredients */}
                            <Paper variant="outlined" sx={{ p: 2 }}>
                                    <RecipeIngredientsEditor
                                        availableIngredients={ingredients}
                                        selectedIngredients={tempRecipe.ingredients}
                                        onChange={(newIngredients) => updateTempRecipe({ ingredients: newIngredients })}
                                    />
                            </Paper>

                            {/* Save Button */}
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <MultiActionButton
                                    size="small"
                                    startIcon={<SaveIcon/>}
                                    title="Save changes"
                                    color="primary"
                                    variant="contained"
                                    disabled={!isValid || isSaving}
                                    onClick={handleSave}
                                >
                                    Save Recipe
                                </MultiActionButton>
                            </Box>
                        </Stack>
                    </Paper>
                </Stack>
            </Box>
        </>
    );
};

export default RecipeEdit;