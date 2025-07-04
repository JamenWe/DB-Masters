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

export type IngredientType = {
    id: number;
    name: string;
    unit?: string;
    netPrice?: BigDecimal;
    stock?: number;
    calories?: number;
    carbohydrates?: BigDecimal;
    protein?: BigDecimal;
    supplierId: number;
};

export type BasicIngredientType = IngredientType;

export type IngredientCreationType = {
    name: string;
    unit?: string;
    netPrice?: BigDecimal;
    stock?: number;
    calories?: number;
    carbohydrates?: BigDecimal;
    protein?: BigDecimal;
    supplierId: number;
};

export type IngredientUpdateType = Partial<Omit<IngredientType, 'id'>> & {
    id: number;
};

export type IngredientDeletionType = {
    id: number;
};

export type IngredientFilterSearchType = {
    id?: number;
    name?: string;
    unit?: string;
    netPrice?: BigDecimal;
    stock?: number;
    calories?: number;
    carbohydrates?: BigDecimal;
    protein?: BigDecimal;
    supplierName?: string;
};

export type IngredientFilterType = IngredientFilterSearchType & PageableFilterParamsType<IngredientType>;

const fetchIngredients = async (filter?: IngredientFilterType, config?: AxiosRequestConfig): Promise<PaginatedItemsType<IngredientType>> => {
    const response = await client.get('/internal/ingredients', { ...config, params: filter });
    return {
        items: response.data.ingredients,
        page: response.data.page
    };
};

export const useIngredients = (filter?: IngredientFilterType): UseQueryResult<PaginatedItemsType<IngredientType>, AxiosError<ErrorType, void>> => {
    return useQueryWithErrorNotification({
        queryKey: ['ingredients', filter],
        queryFn: ({ signal }) => fetchIngredients(filter, { signal }),
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

const createIngredient = async (data: IngredientCreationType, config?: AxiosRequestConfig): Promise<IngredientType> => {
    const response = await client.post('/internal/ingredients', data, { ...config });
    return response.data;
};

export const useCreateIngredient = (): UseMutationResult<IngredientType, AxiosError<ErrorType, IngredientCreationType>, IngredientCreationType> => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { dispatchShowNotification } = useNotification();

    return useMutation({
        mutationFn: createIngredient,
        onSuccess: async (createdIngredient: IngredientType) => {
            dispatchShowNotification('success', `Successfully created Ingredient #${createdIngredient.id} ${createdIngredient.name}`);
            await queryClient.invalidateQueries({ queryKey: ['ingredients'] });
            await queryClient.setQueryData(['ingredients', createdIngredient.id], createdIngredient);
            return navigate(`/ingredients/${createdIngredient.id}`);
        },
        onError: (error) => dispatchShowNotification('error', extractErrorMessage(error)),
    });
};

export const fetchIngredient = async (id?: number, config?: AxiosRequestConfig): Promise<IngredientType | undefined> => {
    const response = await client.get(`/internal/ingredients/${id}`, { ...config });
    return response.data;
};

export const useIngredient = (id?: number): UseQueryResult<IngredientType | undefined, AxiosError<ErrorType, void>> => {
    return useQueryWithErrorNotification({
        queryKey: ['ingredients', id],
        queryFn: ({ signal }) => fetchIngredient(id, { signal }),
        enabled: !!id,
    });
};

const updateIngredient = async (ingredient: IngredientUpdateType, config?: AxiosRequestConfig): Promise<IngredientType> => {
    const response = await client.put(`/internal/ingredients/${ingredient.id}`, ingredient, { ...config });
    return response.data;
};

export const useIngredientUpdate = (
    onSuccess: (savedIngredient: IngredientType) => void = () => {},
    onError: (error: AxiosError<ErrorType, IngredientUpdateType>) => void = () => {},
): UseMutationResult<IngredientType, AxiosError<ErrorType, IngredientUpdateType>, IngredientUpdateType> => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: updateIngredient,
        onSuccess: async (savedIngredient) => {
            onSuccess(savedIngredient);
            await queryClient.invalidateQueries({ queryKey: ['ingredients'] });
            await queryClient.setQueryData(['ingredients', savedIngredient.id], savedIngredient);
            return navigate('/ingredients');
        },
        onError: (error) => onError(error),
    });
};

const deleteIngredient = async (ingredientDeletionType: IngredientDeletionType, config?: AxiosRequestConfig): Promise<void | undefined> => {
    const response = await client.delete(`/internal/ingredients/${ingredientDeletionType.id}`, { ...config });
    return response.data;
};

export const useDeleteIngredient = (): UseMutationResult<void, AxiosError<ErrorType, IngredientDeletionType>, IngredientDeletionType> => {
    const queryClient = useQueryClient();
    const { dispatchShowNotification } = useNotification();

    return useMutation({
        mutationFn: deleteIngredient,
        onSuccess: async (_, { id }) => {
            dispatchShowNotification('success', `Successfully deleted Ingredient #${id}`);
            await queryClient.invalidateQueries({ queryKey: ['ingredients'] });
        },
        onError: (error) => dispatchShowNotification('error', extractErrorMessage(error)),
    });
};