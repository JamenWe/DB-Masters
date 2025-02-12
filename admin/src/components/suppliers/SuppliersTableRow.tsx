import * as React from 'react';
import {FC} from 'react';
import {IconButton, Link, TableCell, TableRow, Tooltip} from '@mui/material';
import {SupplierType} from 'src/api/suppliers';
import {Link as RouterLink} from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import SupplierDeleteDialog from './SupplierDeleteDialog';

interface SuppliersTableRowProps {
    supplier: SupplierType;
}

const SuppliersTableRow: FC<SuppliersTableRowProps> = (props) => {
    const { supplier } = props;

    const formatAddress = (supplier: SupplierType): string => {
        const addressParts = [];

        if (supplier.street || supplier.houseNumber) {
            addressParts.push(`${supplier.street || ''} ${supplier.houseNumber || ''}`.trim());
        }

        if (supplier.zipCode || supplier.city) {
            addressParts.push(`${supplier.zipCode || ''} ${supplier.city || ''}`.trim());
        }

        return addressParts.join(', ');
    };

    return (
        <TableRow>
            <TableCell>
                <Link
                    underline="hover"
                    component={RouterLink}
                    to={`/suppliers/${supplier.id}`}
                >
                    {supplier.id}
                </Link>
            </TableCell>
            <TableCell>{supplier.name}</TableCell>
            <TableCell>{formatAddress(supplier)}</TableCell>
            <TableCell>{supplier.phone}</TableCell>
            <TableCell>{supplier.email}</TableCell>
            <TableCell>
                <Tooltip title="Edit Supplier">
                    <IconButton
                        component={RouterLink}
                        to={`/suppliers/${supplier.id}`}
                        color="primary"
                    >
                        <EditIcon/>
                    </IconButton>
                </Tooltip>
                <SupplierDeleteDialog supplier={supplier} />
            </TableCell>
        </TableRow>
    );
};

export default SuppliersTableRow;