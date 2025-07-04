import {FC} from 'react';
import {Chip, IconButton, Link, Stack, TableCell, TableRow, Tooltip} from '@mui/material';
import {OrderType} from 'src/api/orders';
import {Link as RouterLink} from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import {useCustomer} from 'src/api/customers';
import dayjs from 'dayjs';
import OrderDeleteDialog from './OrderDeleteDialog';

interface OrdersTableRowProps {
    order: OrderType;
}

const OrdersTableRow: FC<OrdersTableRowProps> = (props) => {
    const { order } = props;
    const { data: customer } = useCustomer(order.customerId);

    const formatAmount = (amount?: number) => {
        if (amount === undefined || amount === null) return '';
        return amount.toFixed(2);
    };

    return (
        <TableRow>
            <TableCell>
                <Link
                    underline="hover"
                    component={RouterLink}
                    to={`/orders/${order.id}`}
                >
                    {order.id}
                </Link>
            </TableCell>
            <TableCell>
                {dayjs(order.orderDate).format('DD / MM / YYYY')}
            </TableCell>
            <TableCell>
                {customer && (
                    <Link
                        underline="hover"
                        component={RouterLink}
                        to={`/customers/${customer.id}`}
                    >
                        {customer.firstName} {customer.lastName}
                    </Link>
                )}
            </TableCell>
            <TableCell>{formatAmount(order.invoiceAmount)}€</TableCell>
            <TableCell>
                <Stack direction="row" spacing={1}>
                    {order.orderIngredients.map((item, index) => (
                        <Chip
                            key={index}
                            size="small"
                            label={`${item.quantity}x #${item.ingredientId}`}
                        />
                    ))}
                </Stack>
            </TableCell>
            <TableCell>
                <Stack direction="row" spacing={1}>
                    {order.orderRecipes.map((item, index) => (
                        <Chip
                            key={index}
                            size="small"
                            label={`${item.quantity}x #${item.recipeId}`}
                        />
                    ))}
                </Stack>
            </TableCell>
            <TableCell>
                <Tooltip title="Edit Order">
                    <IconButton
                        component={RouterLink}
                        to={`/orders/${order.id}`}
                        color="primary"
                    >
                        <EditIcon/>
                    </IconButton>
                </Tooltip>
                <OrderDeleteDialog order={order} />
            </TableCell>
        </TableRow>
    );
};

export default OrdersTableRow;