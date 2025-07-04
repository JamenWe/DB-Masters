import {ChangeEvent, FC, useCallback, useMemo, useState} from 'react';
import {Add} from '@mui/icons-material';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField} from '@mui/material';
import {AllergenRestrictionCreationType, useCreateAllergenRestriction} from 'src/api/allergenRestrictions';
import useObjectMerge from 'src/hooks/useObjectMerge';

const INITIAL_EMPTY_ALLERGEN: AllergenRestrictionCreationType = {
    name: '',
};

const AllergenRestrictionCreationDialog: FC = () => {
    const [open, setOpen] = useState(false);
    const [tempAllergen, updateTempAllergen] = useObjectMerge<AllergenRestrictionCreationType>(INITIAL_EMPTY_ALLERGEN);
    const { mutate: createAllergen, isPending } = useCreateAllergenRestriction();

    const nameErrorText = useMemo(() => {
        if (!tempAllergen.name) {
            return 'Name is required';
        }
        if (tempAllergen.name.length > 50) {
            return 'Name must not be longer than 50 characters';
        }
        return undefined;
    }, [tempAllergen.name]);

    const handleClose = useCallback(() => {
        updateTempAllergen(INITIAL_EMPTY_ALLERGEN);
        setOpen(false);
    }, [updateTempAllergen]);

    const handleCreate = useCallback(() => {
        if (!nameErrorText) {
            createAllergen(tempAllergen);
            handleClose();
        }
    }, [createAllergen, handleClose, nameErrorText, tempAllergen]);

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                startIcon={<Add/>}
                variant="contained"
            >
                Create Allergen Restriction
            </Button>

            <Dialog
                fullWidth
                maxWidth="sm"
                open={open}
            >
                <DialogTitle>
                    Create new allergen restriction
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <TextField
                            label="Name"
                            required
                            fullWidth
                            value={tempAllergen.name}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                updateTempAllergen({ name: e.target.value })}
                            error={!!nameErrorText}
                            helperText={nameErrorText}
                            autoFocus
                        />
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
                        disabled={!!nameErrorText || isPending}
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

export default AllergenRestrictionCreationDialog;