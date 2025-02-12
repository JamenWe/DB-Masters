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

export type AllergenRestrictionType = {
    id: number;
    name: string;
};

export type BasicAllergenRestrictionType = AllergenRestrictionType;

export type AllergenRestrictionCreationType = {
    name: string;
};

export type AllergenRestrictionUpdateType = Partial<Omit<AllergenRestrictionType, 'id'>> & {
    id: number;
};

export type AllergenRestrictionDeletionType = {
    id: number;
};

export type AllergenRestrictionFilterSearchType = {
    id?: number;
    name?: string;
};

export type AllergenRestrictionFilterType = AllergenRestrictionFilterSearchType & PageableFilterParamsType<AllergenRestrictionType>;

const fetchAllergenRestrictions = async (filter?: AllergenRestrictionFilterType, config?: AxiosRequestConfig): Promise<PaginatedItemsType<AllergenRestrictionType>> => {
    const response = await client.get('/internal/allergies', { ...config, params: filter });
    return {
        items: response.data.allergenRestrictions,
        page: response.data.page
    };
};

export const useAllergenRestrictions = (filter?: AllergenRestrictionFilterType): UseQueryResult<PaginatedItemsType<AllergenRestrictionType>, AxiosError<ErrorType, void>> => {
    return useQueryWithErrorNotification({
        queryKey: ['allergenRestrictions', filter],
        queryFn: ({ signal }) => fetchAllergenRestrictions(filter, { signal }),
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

const createAllergenRestriction = async (data: AllergenRestrictionCreationType, config?: AxiosRequestConfig): Promise<AllergenRestrictionType> => {
    const response = await client.post('/internal/allergies', data, { ...config });
    return response.data;
};

export const useCreateAllergenRestriction = (): UseMutationResult<AllergenRestrictionType, AxiosError<ErrorType, AllergenRestrictionCreationType>, AllergenRestrictionCreationType> => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { dispatchShowNotification } = useNotification();

    return useMutation({
        mutationFn: createAllergenRestriction,
        onSuccess: async (createdAllergen: AllergenRestrictionType) => {
            dispatchShowNotification('success', `Successfully created Allergen Restriction #${createdAllergen.id} ${createdAllergen.name}`);
            await queryClient.invalidateQueries({ queryKey: ['allergenRestrictions'] });
            await queryClient.setQueryData(['allergenRestrictions', createdAllergen.id], createdAllergen);
            return navigate(`/allergies/${createdAllergen.id}`);
        },
        onError: (error) => dispatchShowNotification('error', extractErrorMessage(error)),
    });
};

export const fetchAllergenRestriction = async (id?: number, config?: AxiosRequestConfig): Promise<AllergenRestrictionType | undefined> => {
    const response = await client.get(`/internal/allergies/${id}`, { ...config });
    return response.data;
};

export const useAllergenRestriction = (id?: number): UseQueryResult<AllergenRestrictionType | undefined, AxiosError<ErrorType, void>> => {
    return useQueryWithErrorNotification({
        queryKey: ['allergenRestrictions', id],
        queryFn: ({ signal }) => fetchAllergenRestriction(id, { signal }),
        enabled: !!id,
    });
};

const updateAllergenRestriction = async (allergen: AllergenRestrictionUpdateType, config?: AxiosRequestConfig): Promise<AllergenRestrictionType> => {
    const response = await client.put(`/internal/allergies/${allergen.id}`, allergen, { ...config });
    return response.data;
};

export const useAllergenRestrictionUpdate = (
    onSuccess: (savedAllergen: AllergenRestrictionType) => void = () => {},
    onError: (error: AxiosError<ErrorType, AllergenRestrictionUpdateType>) => void = () => {},
): UseMutationResult<AllergenRestrictionType, AxiosError<ErrorType, AllergenRestrictionUpdateType>, AllergenRestrictionUpdateType> => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: updateAllergenRestriction,
        onSuccess: async (savedAllergen) => {
            onSuccess(savedAllergen);
            await queryClient.invalidateQueries({ queryKey: ['allergenRestrictions'] });
            await queryClient.setQueryData(['allergenRestrictions', savedAllergen.id], savedAllergen);
            return navigate('/allergies');
        },
        onError: (error) => onError(error),
    });
};

const deleteAllergenRestriction = async (allergenDeletionType: AllergenRestrictionDeletionType, config?: AxiosRequestConfig): Promise<void | undefined> => {
    const response = await client.delete(`/internal/allergies/${allergenDeletionType.id}`, { ...config });
    return response.data;
};

export const useDeleteAllergenRestriction = (): UseMutationResult<void, AxiosError<ErrorType, AllergenRestrictionDeletionType>, AllergenRestrictionDeletionType> => {
    const queryClient = useQueryClient();
    const { dispatchShowNotification } = useNotification();

    return useMutation({
        mutationFn: deleteAllergenRestriction,
        onSuccess: async (_, { id }) => {
            dispatchShowNotification('success', `Successfully deleted Allergen Restriction #${id}`);
            await queryClient.invalidateQueries({ queryKey: ['allergenRestrictions'] });
        },
        onError: (error) => dispatchShowNotification('error', extractErrorMessage(error)),
    });
};