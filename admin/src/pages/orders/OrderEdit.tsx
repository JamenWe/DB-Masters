import React, {ChangeEvent, FC, useCallback, useMemo} from 'react';
import {Box, Breadcrumbs, Link, Paper, Stack, TextField, Typography,} from '@mui/material';
import {Link as RouterLink} from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {OrderType, useOrderUpdate} from 'src/api/orders';
import Grid2 from '@mui/material/Grid2';
import SaveIcon from '@mui/icons-material/Save';
import useObjectMerge from 'src/hooks/useObjectMerge';
import MultiActionButton from 'src/components/buttons/MultiActionButton';
import {useNotification} from 'src/components/notifications/NotificationContextProvider';
import {extractErrorMessage} from 'src/api/common';
import {DatePicker} from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import OrderIngredientsEditor from 'src/components/orders/OrderIngredientsEditor';
import OrderRecipesEditor from 'src/components/orders/OrderRecipesEditor';
import {useIngredients} from 'src/api/ingredients';
import {useRecipes} from 'src/api/recipes';

export type OrderEditProps = {
    order: OrderType;
};

const OrderEdit: FC<OrderEditProps> = (props) => {
    const { order } = props;
    const [tempOrder, updateTempOrder] = useObjectMerge(order);

    const { dispatchShowNotification } = useNotification();

    const { data: ingredientsData } = useIngredients();
    const { data: recipesData } = useRecipes();

    const availableIngredients = ingredientsData?.items ?? [];
    const availableRecipes = recipesData?.items ?? [];

    const { mutate: saveOrder, isPending: isSaving } = useOrderUpdate(
        (savedOrder) => dispatchShowNotification('success', `Successfully updated order #${savedOrder.id}`),
        (error) => dispatchShowNotification('error', extractErrorMessage(error)),
    );

    const handleSave = useCallback(() => {
        saveOrder(tempOrder);
    }, [saveOrder, tempOrder]);

    const orderDateErrorText = useMemo(() => {
        if (!tempOrder.orderDate) {
            return 'Order date is required';
        }
        return undefined;
    }, [tempOrder.orderDate]);

    const itemsErrorText = useMemo(() => {
        if (tempOrder.orderIngredients.length === 0 && tempOrder.orderRecipes.length === 0) {
            return 'At least one ingredient or recipe is required';
        }
        return undefined;
    }, [tempOrder.orderIngredients.length, tempOrder.orderRecipes.length]);

    const isValid = useMemo(() => {
        return !orderDateErrorText && !itemsErrorText;
    }, [orderDateErrorText, itemsErrorText]);

    return (
        <>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small"/>}>
                <Link underline="hover" component={RouterLink} to="/">
                    Home
                </Link>
                <Link underline="hover" component={RouterLink} to="/orders">
                    Orders
                </Link>
                <Typography color="text.primary">
                    #{order.id}
                </Typography>
            </Breadcrumbs>

            <Box sx={{ mt: 2 }}>
                <Stack spacing={2}>
                    <Typography variant="h4">
                        Edit Order #{order.id}
                    </Typography>

                    <Paper elevation={0} sx={{ p: 3 }}>
                        <Stack spacing={3}>
                            {/* Order Details */}
                            <Grid2 container spacing={3}>
                                <Grid2 flex={4}>
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
                                                required: true,
                                                error: !!orderDateErrorText,
                                                helperText: orderDateErrorText
                                            }
                                        }}
                                    />
                                </Grid2>
                                <Grid2 flex={4}>
                                    <TextField
                                        label="Invoice Amount"
                                        fullWidth
                                        type="number"
                                        value={tempOrder.invoiceAmount || ''}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                            updateTempOrder({ invoiceAmount: parseFloat(e.target.value) })}
                                        inputProps={{ step: "0.01" }}
                                    />
                                </Grid2>
                            </Grid2>

                            {/* Ingredients Editor */}
                            <Paper variant="outlined" sx={{ p: 2 }}>
                                <OrderIngredientsEditor
                                    availableIngredients={availableIngredients}
                                    selectedIngredients={tempOrder.orderIngredients}
                                    onChange={(ingredients) =>
                                        updateTempOrder({ orderIngredients: ingredients })}
                                />
                            </Paper>

                            {/* Recipes Editor */}
                            <Paper variant="outlined" sx={{ p: 2 }}>
                                <OrderRecipesEditor
                                    availableRecipes={availableRecipes}
                                    selectedRecipes={tempOrder.orderRecipes}
                                    onChange={(recipes) =>
                                        updateTempOrder({ orderRecipes: recipes })}
                                />
                            </Paper>

                            {itemsErrorText && (
                                <Typography color="error" variant="caption">
                                    {itemsErrorText}
                                </Typography>
                            )}

                            {/* Save Button */}
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <MultiActionButton
                                    size="small"
                                    startIcon={<SaveIcon/>}
                                    title="Save changes"
                                    color="primary"
                                    variant="contained"
                                    disabled={!isValid || isSaving}
                                    onClick={handleSave}
                                >
                                    Save Order
                                </MultiActionButton>
                            </Box>
                        </Stack>
                    </Paper>
                </Stack>
            </Box>
        </>
    );
};

export default OrderEdit;