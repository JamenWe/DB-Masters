import React, {ChangeEvent, FC, useCallback, useMemo} from 'react';
import {
    Box,
    Breadcrumbs,
    Button,
    Link,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import {Link as RouterLink} from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {CustomerOrderDto, CustomerType, useCustomerOrders, useCustomerUpdate} from 'src/api/customers';
import Grid2 from '@mui/material/Grid2';
import SaveIcon from '@mui/icons-material/Save';
import useObjectMerge from 'src/hooks/useObjectMerge';
import {useNotification} from 'src/components/notifications/NotificationContextProvider';
import {extractErrorMessage} from 'src/api/common';
import dayjs from "dayjs";

export type CustomerEditProps = {
    customer: CustomerType;
};

const CustomerEdit: FC<CustomerEditProps> = (props) => {
    const { customer } = props;
    const [tempCustomer, updateTempCustomer] = useObjectMerge(customer);
    const { data: customerOrders } = useCustomerOrders(customer.id);


    const { dispatchShowNotification } = useNotification();

    const { mutate: saveCustomer, isPending: isSaving } = useCustomerUpdate(
        (savedCustomer) => dispatchShowNotification('success', `Successfully updated customer #${savedCustomer.id}`),
        (error) => dispatchShowNotification('error', extractErrorMessage(error)),
    );

    const handleSave = useCallback(() => {
        saveCustomer(tempCustomer);
    }, [saveCustomer, tempCustomer]);

    const emailErrorText = useMemo(() => {
        if (tempCustomer.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tempCustomer.email)) {
            return 'Invalid email format';
        }
        return undefined;
    }, [tempCustomer.email]);

    const zipCodeErrorText = useMemo(() => {
        if (tempCustomer.zipCode && !/^\d{5}$/.test(tempCustomer.zipCode)) {
            return 'ZIP code must be 5 digits';
        }
        return undefined;
    }, [tempCustomer.zipCode]);

    return (
        <>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small"/>}>
                <Link underline="hover" component={RouterLink} to="/">
                    Home
                </Link>
                <Link underline="hover" component={RouterLink} to="/customers">
                    Customers
                </Link>
                <Typography color="text.primary">
                    #{customer.id} - {customer.firstName} {customer.lastName}
                </Typography>
            </Breadcrumbs>

            <Box sx={{ mt: 2 }}>
                <Stack spacing={2}>
                    <Typography variant="h4">
                        Edit Customer #{customer.id} - {customer.firstName} {customer.lastName}
                    </Typography>

                    <Paper elevation={0} sx={{ p: 3 }}>
                        <Stack spacing={3}>

                            {/* First Row - Contact */}
                            <Grid2 container spacing={3}>
                                <Grid2 flex={1}>
                                    <TextField
                                        label="Street"
                                        fullWidth
                                        value={tempCustomer.street || ''}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                            updateTempCustomer({ street: e.target.value })}
                                    />
                                </Grid2>

                                <Grid2 flex={1}>
                                    <TextField
                                        label="House Number"
                                        fullWidth
                                        value={tempCustomer.houseNumber || ''}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                            updateTempCustomer({ houseNumber: e.target.value })}
                                    />
                                </Grid2>

                                <Grid2 flex={1}>
                                    <TextField
                                        label="ZIP Code"
                                        fullWidth
                                        value={tempCustomer.zipCode || ''}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                            updateTempCustomer({ zipCode: e.target.value })}
                                        error={!!zipCodeErrorText}
                                        helperText={zipCodeErrorText}
                                    />
                                </Grid2>

                                <Grid2 flex={1}>
                                    <TextField
                                        label="City"
                                        fullWidth
                                        value={tempCustomer.city || ''}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                            updateTempCustomer({ city: e.target.value })}
                                    />
                                </Grid2>
                            </Grid2>

                            {/* Second Row */}
                            <Grid2 container spacing={3}>
                                <Grid2 flex={1}>
                                    <TextField
                                        label="Phone"
                                        fullWidth
                                        value={tempCustomer.phone || ''}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                            updateTempCustomer({ phone: e.target.value })}
                                    />
                                </Grid2>

                                <Grid2 flex={1}>
                                    <TextField
                                        label="Email"
                                        fullWidth
                                        value={tempCustomer.email || ''}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                            updateTempCustomer({ email: e.target.value })}
                                        error={!!emailErrorText}
                                        helperText={emailErrorText}
                                    />
                                </Grid2>
                            </Grid2>

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end'}}>
                                <Button
                                    size="small"
                                    startIcon={<SaveIcon/>}
                                    title="Save changes"
                                    color="primary"
                                    variant="contained"
                                    disabled={!!emailErrorText || !!zipCodeErrorText || isSaving}
                                    onClick={handleSave}
                                >
                                    Save Customer
                                </Button>
                            </Box>
                        </Stack>
                    </Paper>

                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Order History
                        </Typography>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Order ID</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Invoice Amount</TableCell>
                                    <TableCell>Recipes</TableCell>
                                    <TableCell>Ingredients</TableCell>
                                </TableRow>
                            </TableHead>
                            {customerOrders && customerOrders.length > 0 && (
                                <TableBody>
                                    {customerOrders.map((order: CustomerOrderDto) => (
                                        <TableRow key={order.orderId}>
                                            <TableCell>
                                                <Link
                                                    underline="hover"
                                                    component={RouterLink}
                                                    to={`/orders/${order.orderId}`}
                                                >
                                                    {order.orderId}
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                {dayjs(order.orderDate).format('DD / MM / YYYY')}
                                            </TableCell>
                                            <TableCell>
                                                {order.invoiceAmount
                                                    ? `${order.invoiceAmount.toFixed(2)} €`
                                                    : '-'}
                                            </TableCell>
                                            <TableCell>{order.recipes}</TableCell>
                                            <TableCell>{order.ingredients}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            )}
                        </Table>
                    </Box>
                </Stack>
            </Box>
        </>
    );
};

export default CustomerEdit;