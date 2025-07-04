import {FC} from 'react';
import {Autocomplete, TextField} from '@mui/material';
import {CustomerType, useCustomers} from 'src/api/customers';

interface CustomerSelectProps {
    value?: number;
    onChange: (customerId: number) => void;
    error?: boolean;
    helperText?: string;
}

const CustomerSelect: FC<CustomerSelectProps> = ({
    value,
    onChange,
    error,
    helperText
}) => {
    const { data: customersData } = useCustomers({ limit: 1000 });
    const customers = customersData?.items ?? [];

    const selectedCustomer = customers.find((customer: CustomerType) => customer.id === value);

    return (
        <Autocomplete<CustomerType>  // Add explicit type parameter
            options={customers}
            getOptionLabel={(option: CustomerType) => `#${option.id} - ${option.firstName} ${option.lastName}`}
            value={selectedCustomer || null}
            onChange={(_, newValue: CustomerType | null) => {
                if (newValue) {
                    onChange(newValue.id);
                }
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Customer"
                    required
                    error={error}
                    helperText={helperText}
                />
            )}
            isOptionEqualToValue={(option: CustomerType, value: CustomerType) => option.id === value.id}
        />
    );
};

export default CustomerSelect;