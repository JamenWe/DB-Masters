import React, {ChangeEvent, FC, useCallback, useMemo, useState} from 'react';
import {Add} from '@mui/icons-material';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField,} from '@mui/material';
import {SupplierCreationType, useCreateSupplier} from 'src/api/suppliers';
import useObjectMerge from 'src/hooks/useObjectMerge';

const INITIAL_EMPTY_SUPPLIER: SupplierCreationType = {
    name: '',
};

const SupplierCreationDialog: FC = () => {
    const [open, setOpen] = useState(false);
    const [tempSupplier, updateTempSupplier] = useObjectMerge<SupplierCreationType>(INITIAL_EMPTY_SUPPLIER);
    const { mutate: createSupplier, isPending } = useCreateSupplier();

    const nameErrorText = useMemo(() => {
        if (!tempSupplier.name) {
            return 'Name is required';
        }
        if (tempSupplier.name.length > 50) {
            return 'Name must not be longer than 50 characters';
        }
        return undefined;
    }, [tempSupplier.name]);

    const handleClose = useCallback(() => {
        updateTempSupplier(INITIAL_EMPTY_SUPPLIER);
        setOpen(false);
    }, [updateTempSupplier]);

    const handleCreate = useCallback(() => {
        if (!nameErrorText) {
            createSupplier(tempSupplier);
            handleClose();
        }
    }, [createSupplier, handleClose, nameErrorText, tempSupplier]);

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                startIcon={<Add/>}
                variant="contained"
            >
                Create Supplier
            </Button>

            <Dialog
                fullWidth
                maxWidth="sm"
                open={open}
            >
                <DialogTitle>
                    Create new supplier
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <TextField
                            label="Name"
                            required
                            fullWidth
                            value={tempSupplier.name}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                updateTempSupplier({ name: e.target.value })}
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

export default SupplierCreationDialog;