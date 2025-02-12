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
import {CustomerCreationType, useCreateCustomer} from 'src/api/customers';
import useObjectMerge from 'src/hooks/useObjectMerge';

const INITIAL_EMPTY_CUSTOMER: CustomerCreationType = {
    lastName: '',
    firstName: '',
    dateOfBirth: undefined,
    street: undefined,
    houseNumber: undefined,
    zipCode: undefined,
    city: undefined,
    phone: undefined,
    email: undefined,
};

const CustomerCreationDialog: FC = () => {
    const [open, setOpen] = useState(false);
    const [tempCustomer, updateTempCustomer] = useObjectMerge<CustomerCreationType>(INITIAL_EMPTY_CUSTOMER);
    const { mutate: createCustomer, isPending } = useCreateCustomer();

    const nameErrorText = useMemo(() => {
        if (!tempCustomer.firstName || !tempCustomer.lastName) {
            return 'First name and last name are required';
        }
        if (tempCustomer.firstName.length > 50 || tempCustomer.lastName.length > 50) {
            return 'Names must not be longer than 50 characters';
        }
        return undefined;
    }, [tempCustomer.firstName, tempCustomer.lastName]);

    const handleClose = useCallback(() => {
        updateTempCustomer({
            firstName: '',
            lastName: '',
        });
        setOpen(false);
    }, [updateTempCustomer]);

    const handleCreate = useCallback(() => {
        if (!nameErrorText) {
            createCustomer(tempCustomer);
            handleClose();
        }
    }, [createCustomer, handleClose, nameErrorText, tempCustomer]);


    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                startIcon={<Add/>}
                variant="contained"
            >
                Create Customer
            </Button>

            <Dialog
                fullWidth
                maxWidth="sm"
                open={open}
            >
                <DialogTitle>
                    Create new customer
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <Grid2 container spacing={3}>
                            <Grid2 flex={6}>
                                <TextField
                                    label="Last Name"
                                    required
                                    fullWidth
                                    value={tempCustomer.lastName}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                        updateTempCustomer({ lastName: e.target.value })}
                                    error={!!nameErrorText}
                                />
                            </Grid2>
                            <Grid2 flex={6}>
                                <TextField
                                    label="First Name"
                                    required
                                    fullWidth
                                    value={tempCustomer.firstName}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                        updateTempCustomer({ firstName: e.target.value })}
                                    error={!!nameErrorText}
                                />
                            </Grid2>
                        </Grid2>
                        {nameErrorText && (
                            <Typography color="error" variant="caption">
                                {nameErrorText}
                            </Typography>
                        )}
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

export default CustomerCreationDialog;