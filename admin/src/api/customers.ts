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
import {createPageOf} from 'src/util/pagination';
import {useNavigate} from 'react-router';
import {useNotification} from 'src/components/notifications/NotificationContextProvider';

export type CustomerType = {
    id: number;
    lastName: string;
    firstName: string;
    dateOfBirth?: string | null;
    street?: string;
    houseNumber?: string;
    zipCode?: string;
    city?: string;
    phone?: string;
    email?: string;
};

export type BasicCustomerType = CustomerType;

export interface CustomerOrderDto {
    orderId: number;
    orderDate: string;
    invoiceAmount: number | null;
    recipes: string | null;
    ingredients: string | null;
}

export type CustomerCreationType = {
    lastName: string;
    firstName: string;
    dateOfBirth?: string;
    street?: string;
    houseNumber?: string;
    zipCode?: string;
    city?: string;
    phone?: string;
    email?: string;
};

export type CustomerUpdateType = Partial<Omit<CustomerType, 'id'>> & {
    id: number;
};

export type CustomerDeletionType = {
    id: number;
};

export type CustomerFilterSearchType = {
    id?: number;
    lastName?: string;
    firstName?: string;
    dateOfBirth?: string;
    street?: string;
    houseNumber?: string;
    zipCode?: string;
    city?: string;
    phone?: string;
    email?: string;
};

export type CustomerFilterType = CustomerFilterSearchType & PageableFilterParamsType<CustomerType>;

const fetchCustomers = async (filter?: CustomerFilterType, config?: AxiosRequestConfig): Promise<PaginatedItemsType<BasicCustomerType>> => {
    const response = await client.get('/internal/customers', { ...config, params: filter });
    return {
        items: response.data.customers,
        page: response.data.page
    };
};

/**
 * Fetch filtered customers from the backend
 */
export const useCustomers = (filter?: CustomerFilterType): UseQueryResult<PaginatedItemsType<BasicCustomerType>, AxiosError<ErrorType, void>> => {
    return useQueryWithErrorNotification({
        queryKey: ['customers', filter],
        queryFn: ({ signal }) => fetchCustomers(filter, { signal }),
        placeholderData: previousData => previousData ?? createPageOf<BasicCustomerType>([]),
    });
};

export const fetchCustomerOrders = async (customerId: number): Promise<CustomerOrderDto[]> => {
    const response = await client.get(`/internal/customers/${customerId}/orders`);
    return response.data;
};

export const useCustomerOrders = (customerId: number) => {
    return useQueryWithErrorNotification({
        queryKey: ['customerOrders', customerId],
        queryFn: () => fetchCustomerOrders(customerId),
        placeholderData: [],
    });
};

/**
 * Create new customer from the provided payload
 */
const createCustomer = async (data: CustomerCreationType, config?: AxiosRequestConfig): Promise<CustomerType> => {
    const response = await client.post('/internal/customers', data, { ...config });
    return response.data;
};

export const useCreateCustomer = (): UseMutationResult<CustomerType, AxiosError<ErrorType, CustomerCreationType>, CustomerCreationType> => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { dispatchShowNotification } = useNotification();

    return useMutation<CustomerType, AxiosError<ErrorType, CustomerCreationType>, CustomerCreationType>({
        mutationFn: createCustomer,
        onSuccess: async (createdCustomer: CustomerType) => {
            dispatchShowNotification('success', `Successfully created Customer #${createdCustomer.id} ${createdCustomer.firstName} ${createdCustomer.lastName}`);
            await queryClient.invalidateQueries({ queryKey: ['customers'] });
            await queryClient.setQueryData(['customers', createdCustomer.id], createdCustomer);
            return navigate(`/customers/${createdCustomer.id}`);
        },
        onError: (error) => dispatchShowNotification('error', extractErrorMessage(error)),
    });
};

export const fetchCustomer = async (id?: number, config?: AxiosRequestConfig): Promise<CustomerType | undefined> => {
    const response = await client.get(`/internal/customers/${id}`, { ...config });
    return response.data;
};

/**
 * Fetch a single customer by its ID
 */
export const useCustomer = (id?: number): UseQueryResult<CustomerType | undefined, AxiosError<ErrorType, void>> => {
    return useQueryWithErrorNotification<CustomerType | undefined, AxiosError<ErrorType, void>>({
        queryKey: ['customers', id],
        queryFn: ({ signal }) => fetchCustomer(id, { signal }),
        enabled: !!id,
    });
};

const updateCustomer = async (customer: CustomerUpdateType, config?: AxiosRequestConfig): Promise<CustomerType> => {
    const response = await client.put(`/internal/customers/${customer.id}`, customer, { ...config });
    return response.data;
};

/**
 * Update a single customer
 */
export const useCustomerUpdate = (
    onSuccess: (savedCustomer: CustomerType) => void = () => {},
    onError: (error: AxiosError<ErrorType, CustomerUpdateType>) => void = () => {},
): UseMutationResult<CustomerType, AxiosError<ErrorType, CustomerUpdateType>, CustomerUpdateType> => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation<CustomerType, AxiosError<ErrorType, CustomerUpdateType>, CustomerUpdateType>({
        mutationFn: updateCustomer,
        onSuccess: async (savedCustomer) => {
            onSuccess(savedCustomer);
            await queryClient.invalidateQueries({ queryKey: ['customers'] });
            await queryClient.setQueryData(['customers', savedCustomer.id], savedCustomer);
            return navigate('/customers');
        },
        onError: (error) => onError(error),
    });
};

/**
 * Delete a single customer by its ID
 */
const deleteCustomer = async (customerDeletionType: CustomerDeletionType, config?: AxiosRequestConfig): Promise<void | undefined> => {
    const response = await client.delete(`/internal/customers/${customerDeletionType.id}`, { ...config });
    return response.data;
};

export const useDeleteCustomer = (): UseMutationResult<void, AxiosError<ErrorType, CustomerDeletionType>, CustomerDeletionType> => {
    const queryClient = useQueryClient();
    const { dispatchShowNotification } = useNotification();

    return useMutation<void, AxiosError<ErrorType, CustomerDeletionType>, CustomerDeletionType>({
        mutationFn: deleteCustomer,
        onSuccess: async (_, { id }) => {
            dispatchShowNotification('success', `Successfully deleted Customer #${id}`);
            await queryClient.invalidateQueries({ queryKey: ['customers'] });
        },
        onError: (error) => dispatchShowNotification('error', extractErrorMessage(error)),
    });
};