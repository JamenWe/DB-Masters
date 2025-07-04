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
import {NutritionalCategoryType, useNutritionalCategoryUpdate} from 'src/api/nutritionalCategories';
import Grid2 from '@mui/material/Grid2';
import SaveIcon from '@mui/icons-material/Save';
import useObjectMerge from 'src/hooks/useObjectMerge';
import MultiActionButton from 'src/components/buttons/MultiActionButton';
import {useNotification} from 'src/components/notifications/NotificationContextProvider';
import {extractErrorMessage} from 'src/api/common';
import {useRecipesByNutritionalCategory} from "src/api/recipes";

export type NutritionalCategoryEditProps = {
    category: NutritionalCategoryType;
};

const NutritionalCategoryEdit: FC<NutritionalCategoryEditProps> = (props) => {
    const { category } = props;
    const { data: associatedRecipes = [] } = useRecipesByNutritionalCategory(category.id);
    const [tempCategory, updateTempCategory] = useObjectMerge(category);

    const { dispatchShowNotification } = useNotification();

    const { mutate: saveCategory, isPending: isSaving } = useNutritionalCategoryUpdate(
        (savedCategory) => dispatchShowNotification('success', `Successfully updated nutritional category #${savedCategory.id}`),
        (error) => dispatchShowNotification('error', extractErrorMessage(error)),
    );

    const handleSave = useCallback(() => {
        saveCategory(tempCategory);
    }, [saveCategory, tempCategory]);

    const nameErrorText = useMemo(() => {
        if (!tempCategory.name) {
            return 'Name is required';
        }
        if (tempCategory.name.length > 50) {
            return 'Name must not be longer than 50 characters';
        }
        return undefined;
    }, [tempCategory.name]);

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
                    #{category.id} - {category.name}
                </Typography>
            </Breadcrumbs>

            <Box sx={{ mt: 2 }}>
                <Stack spacing={2}>
                    <Typography variant="h4">
                        Edit Nutritional Category #{category.id} - {category.name}
                    </Typography>

                    <Paper elevation={0} sx={{ p: 3 }}>
                        <Stack spacing={3}>
                            <Grid2 container spacing={3}>
                                <Grid2 flex={12}>
                                    <TextField
                                        label="Name"
                                        required
                                        fullWidth
                                        value={tempCategory.name}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                            updateTempCategory({ name: e.target.value })}
                                        error={!!nameErrorText}
                                        helperText={nameErrorText}
                                    />
                                </Grid2>
                            </Grid2>

                            {/* Save Button */}
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
                                    Save Category
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

export default NutritionalCategoryEdit;