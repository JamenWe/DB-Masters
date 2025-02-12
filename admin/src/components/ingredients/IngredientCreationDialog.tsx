import React, {ChangeEvent, FC, useCallback, useMemo, useState} from 'react';
import {Add} from '@mui/icons-material';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid2,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import {IngredientCreationType, useCreateIngredient} from 'src/api/ingredients';
import useObjectMerge from 'src/hooks/useObjectMerge';
import {useSupplier} from 'src/api/suppliers';

const INITIAL_EMPTY_INGREDIENT: IngredientCreationType = {
    name: '',
    supplierId: 0,
};

const IngredientCreationDialog: FC = () => {
    const [open, setOpen] = useState(false);
    const [tempIngredient, updateTempIngredient] = useObjectMerge<IngredientCreationType>(INITIAL_EMPTY_INGREDIENT);
    const { mutate: createIngredient, isPending } = useCreateIngredient();

    // Fetch supplier details when supplierId is entered
    const { data: supplier } = useSupplier(
        tempIngredient.supplierId > 0 ? tempIngredient.supplierId : undefined
    );

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
        if (tempIngredient.supplierId > 0 && !supplier) {
            return 'Invalid supplier ID';
        }
        return undefined;
    }, [tempIngredient.supplierId, supplier]);

    const handleClose = useCallback(() => {
        updateTempIngredient(INITIAL_EMPTY_INGREDIENT);
        setOpen(false);
    }, [updateTempIngredient]);

    const handleCreate = useCallback(() => {
        if (!nameErrorText && !supplierErrorText) {
            createIngredient(tempIngredient);
            handleClose();
        }
    }, [createIngredient, handleClose, nameErrorText, supplierErrorText, tempIngredient]);

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                startIcon={<Add/>}
                variant="contained"
            >
                Create Ingredient
            </Button>

            <Dialog
                fullWidth
                maxWidth="sm"
                open={open}
            >
                <DialogTitle>
                    Create new ingredient
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <TextField
                            label="Name"
                            required
                            fullWidth
                            value={tempIngredient.name}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                updateTempIngredient({ name: e.target.value })}
                            error={!!nameErrorText}
                            helperText={nameErrorText}
                            autoFocus
                        />

                        <Grid2 container spacing={2} alignItems="center">
                            <Grid2 flex={4}>
                                <TextField
                                    label="Supplier ID"
                                    required
                                    fullWidth
                                    value={tempIngredient.supplierId || ''}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                        updateTempIngredient({
                                            supplierId: parseInt(e.target.value) || 0
                                        })}
                                    error={!!supplierErrorText}
                                    helperText={supplierErrorText}
                                />
                            </Grid2>
                            <Grid2 flex={8}>
                                {supplier && (
                                    <Typography
                                        variant="body1"
                                        color="text.secondary"
                                        sx={{ pl: 1 }}
                                    >
                                        {supplier.name}
                                    </Typography>
                                )}
                            </Grid2>
                        </Grid2>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleClose}
                        color="inherit"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCreate}
                        disabled={!!nameErrorText || !!supplierErrorText || isPending}
                        color="primary"
                        variant="contained"
                    >
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default IngredientCreationDialog;