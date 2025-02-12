import * as React from 'react';
import {FC, useCallback} from 'react';
import {Box, Button, TextField} from '@mui/material';
import {Clear} from '@mui/icons-material';
import {OrderFilterType} from 'src/api/orders';
import Grid2 from '@mui/material/Grid2';
import Grid2FilterBoxItemWrapper from 'src/components/wrappers/Grid2FilterBoxItemWrapper';
import {Stack} from '@mui/system';
import {DatePicker} from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import {useCustomer} from 'src/api/customers';
import {useIngredient} from 'src/api/ingredients';
import {useRecipe} from 'src/api/recipes';
import {hideNumberInputArrows} from "src/util/styles";

export type OrdersFilterBoxProps = {
    filter?: OrderFilterType;
    fixedFilterKeys?: (keyof OrderFilterType)[];
    onChange?: (filter: OrderFilterType) => void;
    onClear?: () => void;
};

const OrdersFilterBox: FC<OrdersFilterBoxProps> = (props) => {
    const { filter, fixedFilterKeys, onChange, onClear } = props;

    // Fetch customer name if customerId is set
    const { data: customer } = useCustomer(
        filter?.customerId ? filter.customerId : undefined
    );

    // Fetch ingredient name if ingredientId is set
    const { data: ingredient } = useIngredient(
        filter?.ingredientId ? filter.ingredientId : undefined
    );

    // Fetch recipe name if recipeId is set
    const { data: recipe } = useRecipe(
        filter?.recipeId ? filter.recipeId : undefined
    );

    const handleIdChange = useCallback((id?: string): void => {
        onChange?.({ ...filter, id: id ? parseInt(id) : undefined });
    }, [filter, onChange]);

    const handleCustomerIdChange = useCallback((customerId?: string): void => {
        onChange?.({ ...filter, customerId: customerId ? parseInt(customerId) : undefined });
    }, [filter, onChange]);

    const handleOrderDateChange = useCallback((date: dayjs.Dayjs | null): void => {
        onChange?.({ ...filter, orderDate: date ? date.format('YYYY-MM-DD') : undefined });
    }, [filter, onChange]);

    const handleInvoiceAmountChange = useCallback((invoiceAmount?: string): void => {
        onChange?.({ ...filter, invoiceAmount: invoiceAmount ? parseFloat(invoiceAmount) : undefined
        });
    }, [filter, onChange]);

    const handleIngredientIdChange = useCallback((ingredientId?: string): void => {
        onChange?.({ ...filter, ingredientId: ingredientId ? parseInt(ingredientId) : undefined });
    }, [filter, onChange]);

    const handleRecipeIdChange = useCallback((recipeId?: string): void => {
        onChange?.({ ...filter, recipeId: recipeId ? parseInt(recipeId) : undefined });
    }, [filter, onChange]);

    const handleReset = (): void => {
        onClear?.();
    };

    return (
        <Stack spacing={3}>
            {/* First Row */}
            <Grid2
                container
                spacing={3}
            >
                <Grid2FilterBoxItemWrapper>
                    <TextField
                        size="small"
                        label="Order ID"
                        value={filter?.id ?? ''}
                        onChange={(event) => handleIdChange(event.target.value)}
                        fullWidth
                        disabled={fixedFilterKeys?.includes('id')}
                        type="number"
                        sx={hideNumberInputArrows}
                    />
                </Grid2FilterBoxItemWrapper>

                <Grid2FilterBoxItemWrapper>
                    <TextField
                        size="small"
                        label="Customer ID"
                        value={filter?.customerId ?? ''}
                        onChange={(event) => handleCustomerIdChange(event.target.value)}
                        fullWidth
                        disabled={fixedFilterKeys?.includes('customerId')}
                        type="number"
                        sx={hideNumberInputArrows}
                        helperText={customer ? `${customer.firstName} ${customer.lastName}` : undefined}
                    />
                </Grid2FilterBoxItemWrapper>

                <Grid2FilterBoxItemWrapper>
                    <DatePicker
                        label="Order Date"
                        value={filter?.orderDate ? dayjs(filter.orderDate) : null}
                        onChange={handleOrderDateChange}
                        slotProps={{
                            textField: {
                                size: 'small',
                                fullWidth: true,
                                disabled: fixedFilterKeys?.includes('orderDate')
                            }
                        }}
                    />
                </Grid2FilterBoxItemWrapper>

                <Grid2FilterBoxItemWrapper>
                    <TextField
                        size="small"
                        label="Invoice Amount"
                        value={filter?.invoiceAmount ?? ''}
                        onChange={(event) => handleInvoiceAmountChange(event.target.value)}
                        fullWidth
                        disabled={fixedFilterKeys?.includes('invoiceAmount')}
                        type="number"
                        inputProps={{ step: "0.01" }}
                    />
                </Grid2FilterBoxItemWrapper>
            </Grid2>

            {/* Second Row */}
            <Grid2
                container
                spacing={3}
                sx={{ minHeight: '65px' }}
            >
                <Grid2FilterBoxItemWrapper>
                    <Stack spacing={1}>
                        <TextField
                            size="small"
                            label="Ingredient ID"
                            value={filter?.ingredientId ?? ''}
                            onChange={(event) => handleIngredientIdChange(event.target.value)}
                            fullWidth
                            disabled={fixedFilterKeys?.includes('ingredientId')}
                            type="number"
                            sx={hideNumberInputArrows}
                            helperText={ingredient?.name}
                        />
                    </Stack>
                </Grid2FilterBoxItemWrapper>

                <Grid2FilterBoxItemWrapper>
                    <Stack spacing={1}>
                        <TextField
                            size="small"
                            label="Recipe ID"
                            value={filter?.recipeId ?? ''}
                            onChange={(event) => handleRecipeIdChange(event.target.value)}
                            fullWidth
                            disabled={fixedFilterKeys?.includes('recipeId')}
                            type="number"
                            sx={hideNumberInputArrows}
                            helperText={recipe?.name}
                        />
                    </Stack>
                </Grid2FilterBoxItemWrapper>

                <Grid2FilterBoxItemWrapper>
                    {/* Empty spacer */}
                </Grid2FilterBoxItemWrapper>

                <Grid2FilterBoxItemWrapper sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Box>
                        <Button
                            variant="outlined"
                            color="primary"
                            title="Clear filter"
                            startIcon={<Clear/>}
                            onClick={handleReset}
                        >
                            Clear
                        </Button>
                    </Box>
                </Grid2FilterBoxItemWrapper>
            </Grid2>
        </Stack>
    );
};

export default OrdersFilterBox;