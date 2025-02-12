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
import {SupplierType, useDeleteSupplier} from 'src/api/suppliers';
import {Delete} from '@mui/icons-material';

type SupplierDeleteDialogProps = {
    supplier: SupplierType;
};

const SupplierDeleteDialog: FC<SupplierDeleteDialogProps> = (props) => {
    const { supplier } = props;
    const [open, setOpen] = useState(false);

    const { mutate: deleteSupplier } = useDeleteSupplier();

    const handleDelete = useCallback(() => {
        deleteSupplier({ id: supplier.id });
        setOpen(false);
    }, [deleteSupplier, supplier.id]);

    const handleClose = (): void => {
        setOpen(false);
    };

    const deleteDisabled = supplier.ingredientIds.length > 0;
    const deleteTitle = deleteDisabled
        ? "Cannot delete supplier with associated ingredients"
        : "Delete Supplier";

    return (
        <>
            <Tooltip title={deleteTitle}>
                <span>
                    <IconButton
                        onClick={() => setOpen(true)}
                        disabled={deleteDisabled}
                        color="warning"
                    >
                        <Delete/>
                    </IconButton>
                </span>
            </Tooltip>
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="sm"
            >
                <DialogTitle>Delete Supplier #{supplier.id}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete supplier
                        #{supplier.id} "{supplier.name}"?
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
                        Delete Supplier
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default SupplierDeleteDialog;