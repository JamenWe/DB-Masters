import React, {ChangeEvent, FC, useCallback, useMemo} from 'react';
import {Box, Breadcrumbs, Link, Paper, Stack, TextField, Typography,} from '@mui/material';
import {Link as RouterLink} from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {IngredientType, useIngredientUpdate} from 'src/api/ingredients';
import Grid2 from '@mui/material/Grid2';
import SaveIcon from '@mui/icons-material/Save';
import useObjectMerge from 'src/hooks/useObjectMerge';
import MultiActionButton from 'src/components/buttons/MultiActionButton';
import {useNotification} from 'src/components/notifications/NotificationContextProvider';
import {extractErrorMessage} from 'src/api/common';
import {useSupplier} from 'src/api/suppliers';

export type IngredientEditProps = {
    ingredient: IngredientType;
};

const IngredientEdit: FC<IngredientEditProps> = (props) => {
    const { ingredient } = props;
    const [tempIngredient, updateTempIngredient] = useObjectMerge(ingredient);
    const { data: supplier } = useSupplier(tempIngredient.supplierId);

    const { dispatchShowNotification } = useNotification();

    const { mutate: saveIngredient, isPending: isSaving } = useIngredientUpdate(
        (savedIngredient) => dispatchShowNotification('success', `Successfully updated ingredient #${savedIngredient.id}`),
        (error) => dispatchShowNotification('error', extractErrorMessage(error)),
    );

    const handleSave = useCallback(() => {
        saveIngredient(tempIngredient);
    }, [saveIngredient, tempIngredient]);

    const nameErrorText = useMemo(() => {
        if (!tempIngredient.name) {
            return 'Name is required';
        }
        if (tempIngredient.name.length > 50) {
            return 'Name must not be longer than 50 characters';
        }
        return undefined;
    }, [tempIngredient.name]);

    const supplierErrorText = useMemo(() => {
        if (!tempIngredient.supplierId) {
            return 'Supplier is required';
        }
        if (!supplier) {
            return 'Invalid supplier ID';
        }
        return undefined;
    }, [tempIngredient.supplierId, supplier]);

    const isValid = !nameErrorText && !supplierErrorText;

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
                    #{ingredient.id} - {ingredient.name}
                </Typography>
            </Breadcrumbs>

            <Box sx={{ mt: 2 }}>
                <Stack spacing={2}>
                    <Typography variant="h4">
                        Edit Ingredient #{ingredient.id} - {ingredient.name}
                    </Typography>

                    <Paper elevation={0} sx={{ p: 3 }}>
                        <Stack spacing={3}>

                            {/* First Row */}
                            <Grid2 container spacing={3}>
                                <Grid2 flex={1}>
                                    <TextField
                                        label="Name"
                                        required
                                        fullWidth
                                        value={tempIngredient.name}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                            updateTempIngredient({ name: e.target.value })}
                                        error={!!nameErrorText}
                                        helperText={nameErrorText}
                                    />
                                </Grid2>
                                <Grid2 flex={1}>
                                    <TextField
                                        label="Unit"
                                        fullWidth
                                        value={tempIngredient.unit || ''}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                            updateTempIngredient({ unit: e.target.value })}
                                    />
                                </Grid2>

                                <Grid2 flex={1}>
                                    <TextField
                                        label="Net Price"
                                        fullWidth
                                        type="number"
                                        value={tempIngredient.netPrice || ''}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                            updateTempIngredient({ netPrice: parseFloat(e.target.value) })}
                                        inputProps={{ step: "0.01" }}
                                    />
                                </Grid2>

                                <Grid2 flex={1}>
                                    <TextField
                                        label="Stock"
                                        fullWidth
                                        value={tempIngredient.stock || ''}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                            updateTempIngredient({ stock: parseInt(e.target.value) })}
                                    />
                                </Grid2>
                            </Grid2>

                            {/* Second Row */}
                            <Grid2 container spacing={3}>
                                <Grid2 flex={1}>
                                    <TextField
                                        label="Calories"
                                        fullWidth
                                        value={tempIngredient.calories || ''}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                            updateTempIngredient({ calories: parseInt(e.target.value) })}
                                    />
                                </Grid2>

                                <Grid2 flex={1}>
                                    <TextField
                                        label="Carbohydrates"
                                        fullWidth
                                        type="number"
                                        value={tempIngredient.carbohydrates || ''}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                            updateTempIngredient({ carbohydrates: parseFloat(e.target.value) })}
                                        inputProps={{ step: "0.01" }}
                                    />
                                </Grid2>

                                <Grid2 flex={1}>
                                    <TextField
                                        label="Protein"
                                        fullWidth
                                        type="number"
                                        value={tempIngredient.protein || ''}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                            updateTempIngredient({ protein: parseFloat(e.target.value) })}
                                        inputProps={{ step: "0.01" }}
                                    />
                                </Grid2>

                                <Grid2 flex={1}>
                                    <TextField
                                        label="Supplier ID"
                                        required
                                        fullWidth
                                        type="number"
                                        value={tempIngredient.supplierId}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                            updateTempIngredient({ supplierId: parseInt(e.target.value) })}
                                        error={!!supplierErrorText}
                                        helperText={supplierErrorText || supplier?.name}
                                        sx={{
                                            "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                                                display: "none",
                                            }
                                        }}
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
                                    disabled={!isValid || isSaving}
                                    onClick={handleSave}
                                >
                                    Save Ingredient
                                </MultiActionButton>
                            </Box>
                        </Stack>
                    </Paper>
                </Stack>
            </Box>
        </>
    );
};

export default IngredientEdit;