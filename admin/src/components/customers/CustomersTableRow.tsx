import * as React from 'react';
import {FC} from 'react';
import {IconButton, Link, TableCell, TableRow, Tooltip} from '@mui/material';
import {CustomerType} from 'src/api/customers';
import {Link as RouterLink} from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import dayjs from 'dayjs';
import CustomerDeleteDialog from "src/components/customers/CustomersDeleteDialog";

interface CustomersTableRowProps {
    customer: CustomerType;
}

const CustomersTableRow: FC<CustomersTableRowProps> = (props) => {
    const { customer } = props;

    const formatAddress = (customer: CustomerType): string => {
        const addressParts = [];

        if (customer.street || customer.houseNumber) {
            addressParts.push(`${customer.street || ''} ${customer.houseNumber || ''}`.trim());
        }

        if (customer.zipCode || customer.city) {
            addressParts.push(`${customer.zipCode || ''} ${customer.city || ''}`.trim());
        }

        return addressParts.join(', ');
    };

    return (
        <TableRow>
            <TableCell>
                <Link
                    underline="hover"
                    component={RouterLink}
                    to={`/customers/${customer.id}`}
                >
                    {customer.id}
                </Link>
            </TableCell>
            <TableCell>{customer.lastName}</TableCell>
            <TableCell>{customer.firstName}</TableCell>
            <TableCell>
                {customer.dateOfBirth ? dayjs(customer.dateOfBirth).format('DD / MM / YYYY') : ''}
            </TableCell>
            <TableCell>{formatAddress(customer)}</TableCell>
            <TableCell>{customer.phone}</TableCell>
            <TableCell>{customer.email}</TableCell>
            <TableCell>
                <Tooltip title="Edit Customer">
                    <IconButton
                        component={RouterLink}
                        to={`/customers/${customer.id}`}
                        color="primary"
                    >
                        <EditIcon/>
                    </IconButton>
                </Tooltip>
                <CustomerDeleteDialog customer={customer} />
            </TableCell>
        </TableRow>
    );
};

export default CustomersTableRow;