import React, {ChangeEvent, FC, useCallback, useMemo, useState} from 'react';
import {Add} from '@mui/icons-material';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid2, Stack, TextField,} from '@mui/material';
import {RecipeCreationType, useCreateRecipe} from 'src/api/recipes';
import useObjectMerge from 'src/hooks/useObjectMerge';

const INITIAL_EMPTY_RECIPE: RecipeCreationType = {
    name: '',
    netPrice: undefined as unknown as number,
    ingredients: [],
    nutritionalCategoryIds: [],
    allergenRestrictionIds: []
};

const RecipeCreationDialog: FC = () => {
    const [open, setOpen] = useState(false);
    const [tempRecipe, updateTempRecipe] = useObjectMerge<RecipeCreationType>(INITIAL_EMPTY_RECIPE);
    const { mutate: createRecipe, isPending } = useCreateRecipe();

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

    const handleClose = useCallback(() => {
        updateTempRecipe(INITIAL_EMPTY_RECIPE);
        setOpen(false);
    }, [updateTempRecipe]);

    const handleCreate = useCallback(() => {
        if (!nameErrorText && !priceErrorText) {
            createRecipe(tempRecipe);
            handleClose();
        }
    }, [createRecipe, handleClose, nameErrorText, priceErrorText, tempRecipe]);

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                startIcon={<Add/>}
                variant="contained"
            >
                Create Recipe
            </Button>

            <Dialog
                fullWidth
                maxWidth="sm"
                open={open}
            >
                <DialogTitle>
                    Create new recipe
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <Grid2 container spacing={3}>
                            <Grid2 flex={1}>
                                <TextField
                                    label="Name"
                                    required
                                    fullWidth
                                    value={tempRecipe.name}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                        updateTempRecipe({ name: e.target.value })}
                                    error={!!nameErrorText}
                                    helperText={nameErrorText}
                                    autoFocus
                                />
                            </Grid2>

                            <Grid2 flex={1}>
                                <TextField
                                    label="Net Price"
                                    required
                                    fullWidth
                                    type="number"
                                    inputProps={{ step: "0.01" }}
                                    value={tempRecipe.netPrice ?? ''} // Change this line
                                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                        updateTempRecipe({
                                            netPrice: e.target.value === ''
                                                ? undefined as unknown as number
                                                : parseFloat(e.target.value)
                                        })}
                                    error={!!priceErrorText}
                                    helperText={priceErrorText}
                                />
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
                        disabled={!!nameErrorText || !!priceErrorText || isPending}
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

export default RecipeCreationDialog;