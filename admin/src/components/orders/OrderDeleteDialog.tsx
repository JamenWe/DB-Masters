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
import {OrderType, useDeleteOrder} from 'src/api/orders';
import {Delete} from '@mui/icons-material';
import {useCustomer} from 'src/api/customers';

type OrderDeleteDialogProps = {
    order: OrderType;
};

const OrderDeleteDialog: FC<OrderDeleteDialogProps> = (props) => {
    const { order } = props;
    const [open, setOpen] = useState(false);
    const { mutate: deleteOrder } = useDeleteOrder();
    const { data: customer } = useCustomer(order.customerId);

    const handleDelete = useCallback(() => {
        deleteOrder({ id: order.id });
        setOpen(false);
    }, [deleteOrder, order.id]);

    const handleClose = (): void => {
        setOpen(false);
    };

    const orderSummary = `Order #${order.id}`;
    const customerInfo = customer ? ` for ${customer.firstName} ${customer.lastName}` : '';

    return (
        <>
            <Tooltip title="Delete Order">
                <IconButton
                    onClick={() => setOpen(true)}
                    color="warning"
                >
                    <Delete/>
                </IconButton>
            </Tooltip>
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Delete {orderSummary}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete {orderSummary}{customerInfo}?
                    </DialogContentText>

                    <DialogContentText sx={{ mt: 2, color: 'error.main' }}>
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
                        Delete Order
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default OrderDeleteDialog;