import {AxiosError, AxiosRequestConfig} from 'axios';
import {
    ErrorType,
    extractErrorMessage,
    PageableFilterParamsType,
    PaginatedItemsType,
    useQueryWithErrorNotification
} from 'src/api/common';
import client from 'src/api/client';
import {useMutation, UseMutationResult, useQueryClient, UseQueryResult} from '@tanstack/react-query';
import {useNavigate} from 'react-router';
import {useNotification} from 'src/components/notifications/NotificationContextProvider';
import {BigDecimal} from 'src/types/common';

export type OrderIngredientType = {
    ingredientId: number;
    quantity: number;
};

export type OrderType = {
    id: number;
    customerId: number;
    orderDate: string;
    invoiceAmount?: BigDecimal;
    orderIngredients: OrderIngredientRequest[];
    orderRecipes: OrderRecipeRequest[];
};

export type BasicOrderType = OrderType;

export type OrderCreationType = {
    customerId: number;
    orderDate: string;
    invoiceAmount?: BigDecimal;
    orderIngredients: OrderIngredientRequest[];
    orderRecipes: OrderRecipeRequest[];
};

export type OrderIngredientRequest = {
    ingredientId: number;
    quantity: number;
};

export type OrderRecipeRequest = {
    recipeId: number;
    quantity: number;
};

export type OrderUpdateType = Partial<Omit<OrderType, 'id'>> & {
    id: number;
};

export type OrderDeletionType = {
    id: number;
};

export type OrderFilterSearchType = {
    id?: number;
    customerId?: number;
    orderDate?: string;
    invoiceAmount?: BigDecimal;
    ingredientId?: number;
    recipeId?: number;
};

export type OrderFilterType = OrderFilterSearchType & PageableFilterParamsType<OrderType>;

const fetchOrders = async (filter?: OrderFilterType, config?: AxiosRequestConfig): Promise<PaginatedItemsType<OrderType>> => {
    const response = await client.get('/internal/orders', { ...config, params: filter });
    return {
        items: response.data.orders,
        page: response.data.page
    };
};

export const useOrders = (filter?: OrderFilterType): UseQueryResult<PaginatedItemsType<OrderType>, AxiosError<ErrorType, void>> => {
    return useQueryWithErrorNotification({
        queryKey: ['orders', filter],
        queryFn: ({ signal }) => fetchOrders(filter, { signal }),
        placeholderData: {
            items: [],
            page: {
                offset: 0,
                limit: 50,
                total: 0
            }
        }
    });
};

const createOrder = async (data: OrderCreationType, config?: AxiosRequestConfig): Promise<OrderType> => {
    const response = await client.post('/internal/orders', data, { ...config });
    return response.data;
};

export const useCreateOrder = (): UseMutationResult<OrderType, AxiosError<ErrorType, OrderCreationType>, OrderCreationType> => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { dispatchShowNotification } = useNotification();

    return useMutation({
        mutationFn: createOrder,
        onSuccess: async (createdOrder: OrderType) => {
            dispatchShowNotification('success', `Successfully created Order #${createdOrder.id}`);
            await queryClient.invalidateQueries({ queryKey: ['orders'] });
            await queryClient.setQueryData(['orders', createdOrder.id], createdOrder);
            return navigate(`/orders/${createdOrder.id}`);
        },
        onError: (error) => dispatchShowNotification('error', extractErrorMessage(error)),
    });
};

export const fetchOrder = async (id?: number, config?: AxiosRequestConfig): Promise<OrderType | undefined> => {
    const response = await client.get(`/internal/orders/${id}`, { ...config });
    return response.data;
};

export const useOrder = (id?: number): UseQueryResult<OrderType | undefined, AxiosError<ErrorType, void>> => {
    return useQueryWithErrorNotification({
        queryKey: ['orders', id],
        queryFn: ({ signal }) => fetchOrder(id, { signal }),
        enabled: !!id,
    });
};

const updateOrder = async (order: OrderUpdateType, config?: AxiosRequestConfig): Promise<OrderType> => {
    const response = await client.put(`/internal/orders/${order.id}`, order, { ...config });
    return response.data;
};

export const useOrderUpdate = (
    onSuccess: (savedOrder: OrderType) => void = () => {},
    onError: (error: AxiosError<ErrorType, OrderUpdateType>) => void = () => {},
): UseMutationResult<OrderType, AxiosError<ErrorType, OrderUpdateType>, OrderUpdateType> => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: updateOrder,
        onSuccess: async (savedOrder) => {
            onSuccess(savedOrder);
            await queryClient.invalidateQueries({ queryKey: ['orders'] });
            await queryClient.setQueryData(['orders', savedOrder.id], savedOrder);
            return navigate('/orders');
        },
        onError: (error) => onError(error),
    });
};

const deleteOrder = async (orderDeletionType: OrderDeletionType, config?: AxiosRequestConfig): Promise<void | undefined> => {
    const response = await client.delete(`/internal/orders/${orderDeletionType.id}`, { ...config });
    return response.data;
};

export const useDeleteOrder = (): UseMutationResult<void, AxiosError<ErrorType, OrderDeletionType>, OrderDeletionType> => {
    const queryClient = useQueryClient();
    const { dispatchShowNotification } = useNotification();

    return useMutation({
        mutationFn: deleteOrder,
        onSuccess: async (_, { id }) => {
            dispatchShowNotification('success', `Successfully deleted Order #${id}`);
            await queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
        onError: (error) => dispatchShowNotification('error', extractErrorMessage(error)),
    });
};

// Validation helpers
export const validateOrder = (order: OrderCreationType | OrderUpdateType): string | undefined => {
    if (!order.customerId) {
        return 'Customer is required';
    }
    if (!order.orderDate) {
        return 'Order date is required';
    }
    if (order.orderIngredients?.length === 0 && order.orderRecipes?.length === 0) {
        return 'Order must contain at least one ingredient or recipe';
    }
    return undefined;
};