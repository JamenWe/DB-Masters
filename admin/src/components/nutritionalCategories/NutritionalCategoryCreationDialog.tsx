import {ChangeEvent, FC, useCallback, useMemo, useState} from 'react';
import {Add} from '@mui/icons-material';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField} from '@mui/material';
import {NutritionalCategoryCreationType, useCreateNutritionalCategory} from 'src/api/nutritionalCategories';
import useObjectMerge from 'src/hooks/useObjectMerge';

const INITIAL_EMPTY_CATEGORY: NutritionalCategoryCreationType = {
    name: '',
};

const NutritionalCategoryCreationDialog: FC = () => {
    const [open, setOpen] = useState(false);
    const [tempCategory, updateTempCategory] = useObjectMerge<NutritionalCategoryCreationType>(INITIAL_EMPTY_CATEGORY);
    const { mutate: createCategory, isPending } = useCreateNutritionalCategory();

    const nameErrorText = useMemo(() => {
        if (!tempCategory.name) {
            return 'Name is required';
        }
        if (tempCategory.name.length > 50) {
            return 'Name must not be longer than 50 characters';
        }
        return undefined;
    }, [tempCategory.name]);

    const handleClose = useCallback(() => {
        updateTempCategory(INITIAL_EMPTY_CATEGORY);
        setOpen(false);
    }, [updateTempCategory]);

    const handleCreate = useCallback(() => {
        if (!nameErrorText) {
            createCategory(tempCategory);
            handleClose();
        }
    }, [createCategory, handleClose, nameErrorText, tempCategory]);

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                startIcon={<Add/>}
                variant="contained"
            >
                Create Nutritional Category
            </Button>

            <Dialog
                fullWidth
                maxWidth="sm"
                open={open}
            >
                <DialogTitle>
                    Create new nutritional category
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <TextField
                            label="Name"
                            required
                            fullWidth
                            value={tempCategory.name}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                updateTempCategory({ name: e.target.value })}
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

export default NutritionalCategoryCreationDialog;