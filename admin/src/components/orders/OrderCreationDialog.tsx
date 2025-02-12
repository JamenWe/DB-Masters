// src/components/orders/OrderCreationDialog.tsx
import React, {FC, useCallback, useMemo, useState} from 'react';
import {Add} from '@mui/icons-material';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography} from '@mui/material';
import {OrderCreationType, useCreateOrder} from 'src/api/orders';
import useObjectMerge from 'src/hooks/useObjectMerge';
import {DatePicker} from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import OrderIngredientsEditor from './OrderIngredientsEditor';
import OrderRecipesEditor from './OrderRecipesEditor';
import {useIngredients} from 'src/api/ingredients';
import {useRecipes} from 'src/api/recipes';
import CustomerSelect from "src/components/customers/CustomerSelect";

const INITIAL_EMPTY_ORDER: OrderCreationType = {
    customerId: 0,
    orderDate: dayjs().format('YYYY-MM-DD'),
    invoiceAmount: 0,
    orderIngredients: [],
    orderRecipes: []
};

const OrderCreationDialog: FC = () => {
    const [open, setOpen] = useState(false);
    const [tempOrder, updateTempOrder] = useObjectMerge<OrderCreationType>(INITIAL_EMPTY_ORDER);
    const { mutate: createOrder, isPending } = useCreateOrder();

    const { data: ingredientsData } = useIngredients();
    const { data: recipesData } = useRecipes();

    const availableIngredients = ingredientsData?.items ?? [];
    const availableRecipes = recipesData?.items ?? [];

    const handleClose = useCallback(() => {
        updateTempOrder(INITIAL_EMPTY_ORDER);
        setOpen(false);
    }, [updateTempOrder]);

    const isValid = useMemo(() => {
        return tempOrder.orderDate &&
            tempOrder.customerId > 0 && // Added customer validation
            (tempOrder.orderIngredients.length > 0 || tempOrder.orderRecipes.length > 0);
    }, [
        tempOrder.orderDate,
        tempOrder.customerId,
        tempOrder.orderIngredients.length,
        tempOrder.orderRecipes.length
    ]);

    const handleCreate = useCallback(() => {
        if (isValid) {
            createOrder(tempOrder);
            handleClose();
        }
    }, [createOrder, handleClose, isValid, tempOrder]);

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                startIcon={<Add/>}
                variant="contained"
            >
                Create Order
            </Button>

            <Dialog
                fullWidth
                maxWidth="md"
                open={open}
            >
                <DialogTitle>
                    Create new order
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        {/* Customer Selector */}
                        <CustomerSelect
                            value={tempOrder.customerId}
                            onChange={(customerId) => updateTempOrder({ customerId })}
                            error={open && tempOrder.customerId === 0}
                            helperText={open && tempOrder.customerId === 0 ? "Please select a customer" : undefined}
                        />

                        {/* Order Date */}
                        <DatePicker
                            label="Order Date"
                            value={tempOrder.orderDate ? dayjs(tempOrder.orderDate) : null}
                            onChange={(newValue) =>
                                updateTempOrder({
                                    orderDate: newValue ? newValue.format('YYYY-MM-DD') : undefined
                                })}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    required: true
                                }
                            }}
                        />

                        {/* Ingredients Editor */}
                        <OrderIngredientsEditor
                            availableIngredients={availableIngredients}
                            selectedIngredients={tempOrder.orderIngredients}
                            onChange={(ingredients) =>
                                updateTempOrder({ orderIngredients: ingredients })}
                        />

                        {/* Recipes Editor */}
                        <OrderRecipesEditor
                            availableRecipes={availableRecipes}
                            selectedRecipes={tempOrder.orderRecipes}
                            onChange={(recipes) =>
                                updateTempOrder({ orderRecipes: recipes })}
                        />

                        {!isValid && (
                            <Typography color="error" variant="caption">
                                Please select a customer, order date, and at least one ingredient or recipe
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
                        disabled={!isValid || isPending}
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

export default OrderCreationDialog;