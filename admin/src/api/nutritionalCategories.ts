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

export type NutritionalCategoryType = {
    id: number;
    name: string;
};

export type BasicNutritionalCategoryType = NutritionalCategoryType;

export type NutritionalCategoryCreationType = {
    name: string;
};

export type NutritionalCategoryUpdateType = Partial<Omit<NutritionalCategoryType, 'id'>> & {
    id: number;
};

export type NutritionalCategoryDeletionType = {
    id: number;
};

export type NutritionalCategoryFilterSearchType = {
    id?: number;
    name?: string;
};

export type NutritionalCategoryFilterType = NutritionalCategoryFilterSearchType & PageableFilterParamsType<NutritionalCategoryType>;

const fetchNutritionalCategories = async (filter?: NutritionalCategoryFilterType, config?: AxiosRequestConfig): Promise<PaginatedItemsType<NutritionalCategoryType>> => {
    const response = await client.get('/internal/nutrition', { ...config, params: filter });
    return {
        items: response.data.nutritionalCategories,
        page: response.data.page
    };
};

export const useNutritionalCategories = (filter?: NutritionalCategoryFilterType): UseQueryResult<PaginatedItemsType<NutritionalCategoryType>, AxiosError<ErrorType, void>> => {
    return useQueryWithErrorNotification({
        queryKey: ['nutritionalCategories', filter],
        queryFn: ({ signal }) => fetchNutritionalCategories(filter, { signal }),
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

const createNutritionalCategory = async (data: NutritionalCategoryCreationType, config?: AxiosRequestConfig): Promise<NutritionalCategoryType> => {
    const response = await client.post('/internal/nutrition', data, { ...config });
    return response.data;
};

export const useCreateNutritionalCategory = (): UseMutationResult<NutritionalCategoryType, AxiosError<ErrorType, NutritionalCategoryCreationType>, NutritionalCategoryCreationType> => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { dispatchShowNotification } = useNotification();

    return useMutation({
        mutationFn: createNutritionalCategory,
        onSuccess: async (createdCategory: NutritionalCategoryType) => {
            dispatchShowNotification('success', `Successfully created Nutritional Category #${createdCategory.id} ${createdCategory.name}`);
            await queryClient.invalidateQueries({ queryKey: ['nutritionalCategories'] });
            await queryClient.setQueryData(['nutritionalCategories', createdCategory.id], createdCategory);
            return navigate(`/nutrition/${createdCategory.id}`);
        },
        onError: (error) => dispatchShowNotification('error', extractErrorMessage(error)),
    });
};

export const fetchNutritionalCategory = async (id?: number, config?: AxiosRequestConfig): Promise<NutritionalCategoryType | undefined> => {
    const response = await client.get(`/internal/nutrition/${id}`, { ...config });
    return response.data;
};

export const useNutritionalCategory = (id?: number): UseQueryResult<NutritionalCategoryType | undefined, AxiosError<ErrorType, void>> => {
    return useQueryWithErrorNotification({
        queryKey: ['nutritionalCategories', id],
        queryFn: ({ signal }) => fetchNutritionalCategory(id, { signal }),
        enabled: !!id,
    });
};

const updateNutritionalCategory = async (category: NutritionalCategoryUpdateType, config?: AxiosRequestConfig): Promise<NutritionalCategoryType> => {
    const response = await client.put(`/internal/nutrition/${category.id}`, category, { ...config });
    return response.data;
};

export const useNutritionalCategoryUpdate = (
    onSuccess: (savedCategory: NutritionalCategoryType) => void = () => {},
    onError: (error: AxiosError<ErrorType, NutritionalCategoryUpdateType>) => void = () => {},
): UseMutationResult<NutritionalCategoryType, AxiosError<ErrorType, NutritionalCategoryUpdateType>, NutritionalCategoryUpdateType> => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: updateNutritionalCategory,
        onSuccess: async (savedCategory) => {
            onSuccess(savedCategory);
            await queryClient.invalidateQueries({ queryKey: ['nutritionalCategories'] });
            await queryClient.setQueryData(['nutritionalCategories', savedCategory.id], savedCategory);
            return navigate('/nutrition');
        },
        onError: (error) => onError(error),
    });
};

const deleteNutritionalCategory = async (categoryDeletionType: NutritionalCategoryDeletionType, config?: AxiosRequestConfig): Promise<void | undefined> => {
    const response = await client.delete(`/internal/nutrition/${categoryDeletionType.id}`, { ...config });
    return response.data;
};

export const useDeleteNutritionalCategory = (): UseMutationResult<void, AxiosError<ErrorType, NutritionalCategoryDeletionType>, NutritionalCategoryDeletionType> => {
    const queryClient = useQueryClient();
    const { dispatchShowNotification } = useNotification();

    return useMutation({
        mutationFn: deleteNutritionalCategory,
        onSuccess: async (_, { id }) => {
            dispatchShowNotification('success', `Successfully deleted Nutritional Category #${id}`);
            await queryClient.invalidateQueries({ queryKey: ['nutritionalCategories'] });
        },
        onError: (error) => dispatchShowNotification('error', extractErrorMessage(error)),
    });
};