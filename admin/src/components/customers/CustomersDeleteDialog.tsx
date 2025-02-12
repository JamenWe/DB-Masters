import * as React from 'react';
import {FC, useCallback, useState} from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Tooltip
} from '@mui/material';
import {CustomerType, useDeleteCustomer} from 'src/api/customers';
import {Delete} from '@mui/icons-material';

type CustomerDeleteDialogProps = {
    customer: CustomerType;
};

/**
 * A button component that opens a dialog to confirm deleting a customer.
 */
const CustomerDeleteDialog: FC<CustomerDeleteDialogProps> = (props) => {
    const { customer } = props;
    const [open, setOpen] = useState(false);

    const { mutate: deleteCustomer } = useDeleteCustomer();

    const handleDelete = useCallback(() => {
        deleteCustomer({ id: customer.id });
        setOpen(false);
    }, [deleteCustomer, customer.id]);

    const handleClose = (): void => {
        setOpen(false);
    };

    return (
        <>
            <Tooltip title="Delete Customer">
                <IconButton
                    data-test-id={'customer-delete-button'}
                    onClick={() => setOpen(true)}
                    color="warning"
                >
                    <Delete/>
                </IconButton>
            </Tooltip>
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth={'sm'}
            >
                <DialogTitle>Delete Customer #{customer.id}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete customer #{customer.id}
                        &quot;{customer.firstName} {customer.lastName}&quot;?
                        This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleClose}
                        autoFocus={true}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDelete}
                    >
                        Delete Customer
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default CustomerDeleteDialog;