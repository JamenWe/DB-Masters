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

export type SupplierType = {
    id: number;
    name: string;
    street?: string;
    houseNumber?: string;
    zipCode?: string;
    city?: string;
    phone?: string;
    email?: string;
    ingredientIds: number[];
};

export type BasicSupplierType = SupplierType;

export type SupplierCreationType = {
    name: string;
    street?: string;
    houseNumber?: string;
    zipCode?: string;
    city?: string;
    phone?: string;
    email?: string;
};

export type SupplierUpdateType = Partial<Omit<SupplierType, 'id'>> & {
    id: number;
};

export type SupplierDeletionType = {
    id: number;
};

export type SupplierFilterSearchType = {
    id?: number;
    name?: string;
    street?: string;
    houseNumber?: string;
    zipCode?: string;
    city?: string;
    phone?: string;
    email?: string;
};

export type SupplierFilterType = SupplierFilterSearchType & PageableFilterParamsType<SupplierType>;

const fetchSuppliers = async (filter?: SupplierFilterType, config?: AxiosRequestConfig): Promise<PaginatedItemsType<SupplierType>> => {
    const response = await client.get('/internal/suppliers', { ...config, params: filter });
    return {
        items: response.data.suppliers,
        page: response.data.page
    };
};

export const useSuppliers = (filter?: SupplierFilterType): UseQueryResult<PaginatedItemsType<SupplierType>, AxiosError<ErrorType, void>> => {
    return useQueryWithErrorNotification({
        queryKey: ['suppliers', filter],
        queryFn: ({ signal }) => fetchSuppliers(filter, { signal }),
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

const createSupplier = async (data: SupplierCreationType, config?: AxiosRequestConfig): Promise<SupplierType> => {
    const response = await client.post('/internal/suppliers', data, { ...config });
    return response.data;
};

export const useCreateSupplier = (): UseMutationResult<SupplierType, AxiosError<ErrorType, SupplierCreationType>, SupplierCreationType> => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { dispatchShowNotification } = useNotification();

    return useMutation({
        mutationFn: createSupplier,
        onSuccess: async (createdSupplier: SupplierType) => {
            dispatchShowNotification('success', `Successfully created Supplier #${createdSupplier.id} ${createdSupplier.name}`);
            await queryClient.invalidateQueries({ queryKey: ['suppliers'] });
            await queryClient.setQueryData(['suppliers', createdSupplier.id], createdSupplier);
            return navigate(`/suppliers/${createdSupplier.id}`);
        },
        onError: (error) => dispatchShowNotification('error', extractErrorMessage(error)),
    });
};

export const fetchSupplier = async (id?: number, config?: AxiosRequestConfig): Promise<SupplierType | undefined> => {
    const response = await client.get(`/internal/suppliers/${id}`, { ...config });
    return response.data;
};

export const useSupplier = (id?: number): UseQueryResult<SupplierType | undefined, AxiosError<ErrorType, void>> => {
    return useQueryWithErrorNotification({
        queryKey: ['suppliers', id],
        queryFn: ({ signal }) => fetchSupplier(id, { signal }),
        enabled: !!id,
    });
};

const updateSupplier = async (supplier: SupplierUpdateType, config?: AxiosRequestConfig): Promise<SupplierType> => {
    const response = await client.put(`/internal/suppliers/${supplier.id}`, supplier, { ...config });
    return response.data;
};

export const useSupplierUpdate = (
    onSuccess: (savedSupplier: SupplierType) => void = () => {},
    onError: (error: AxiosError<ErrorType, SupplierUpdateType>) => void = () => {},
): UseMutationResult<SupplierType, AxiosError<ErrorType, SupplierUpdateType>, SupplierUpdateType> => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: updateSupplier,
        onSuccess: async (savedSupplier) => {
            onSuccess(savedSupplier);
            await queryClient.invalidateQueries({ queryKey: ['suppliers'] });
            await queryClient.setQueryData(['suppliers', savedSupplier.id], savedSupplier);
            return navigate('/suppliers');
        },
        onError: (error) => onError(error),
    });
};

const deleteSupplier = async (supplierDeletionType: SupplierDeletionType, config?: AxiosRequestConfig): Promise<void | undefined> => {
    const response = await client.delete(`/internal/suppliers/${supplierDeletionType.id}`, { ...config });
    return response.data;
};

export const useDeleteSupplier = (): UseMutationResult<void, AxiosError<ErrorType, SupplierDeletionType>, SupplierDeletionType> => {
    const queryClient = useQueryClient();
    const { dispatchShowNotification } = useNotification();

    return useMutation({
        mutationFn: deleteSupplier,
        onSuccess: async (_, { id }) => {
            dispatchShowNotification('success', `Successfully deleted Supplier #${id}`);
            await queryClient.invalidateQueries({ queryKey: ['suppliers'] });
        },
        onError: (error) => dispatchShowNotification('error', extractErrorMessage(error)),
    });
};