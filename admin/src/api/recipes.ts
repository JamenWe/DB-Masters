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

export type RecipeIngredientType = {
    ingredientId: number;
    quantity: number;
};

export type RecipeType = {
    id: number;
    name: string;
    netPrice: BigDecimal;
    preparationTime?: number;
    instructions?: string;
    ingredients: RecipeIngredientType[];
    nutritionalCategoryIds: number[];
    allergenRestrictionIds: number[];
};

export type BasicRecipeType = RecipeType;

export type RecipeCreationType = {
    name: string;
    netPrice: BigDecimal;
    preparationTime?: number;
    instructions?: string;
    ingredients: RecipeIngredientType[];
    nutritionalCategoryIds: number[];
    allergenRestrictionIds: number[];
};

export type RecipeUpdateType = Partial<Omit<RecipeType, 'id'>> & {
    id: number;
};

export type RecipeDeletionType = {
    id: number;
};

export type RecipeFilterSearchType = {
    id?: number;
    name?: string;
    netPrice?: BigDecimal;
    preparationTime?: number;
    instructions?: string;
    ingredientId?: number;
    nutritionalCategoryName?: string;
    allergenRestrictionName?: string;
};

export type RecipeFilterType = RecipeFilterSearchType & PageableFilterParamsType<RecipeType>;

const fetchRecipes = async (filter?: RecipeFilterType, config?: AxiosRequestConfig): Promise<PaginatedItemsType<RecipeType>> => {
    const response = await client.get('/internal/recipes', { ...config, params: filter });
    return {
        items: response.data.recipes,
        page: response.data.page
    };
};

export const useRecipes = (filter?: RecipeFilterType): UseQueryResult<PaginatedItemsType<RecipeType>, AxiosError<ErrorType, void>> => {
    return useQueryWithErrorNotification({
        queryKey: ['recipes', filter],
        queryFn: ({ signal }) => fetchRecipes(filter, { signal }),
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

const createRecipe = async (data: RecipeCreationType, config?: AxiosRequestConfig): Promise<RecipeType> => {
    const response = await client.post('/internal/recipes', data, { ...config });
    return response.data;
};

export const useCreateRecipe = (): UseMutationResult<RecipeType, AxiosError<ErrorType, RecipeCreationType>, RecipeCreationType> => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { dispatchShowNotification } = useNotification();

    return useMutation({
        mutationFn: createRecipe,
        onSuccess: async (createdRecipe: RecipeType) => {
            dispatchShowNotification('success', `Successfully created Recipe #${createdRecipe.id} ${createdRecipe.name}`);
            await queryClient.invalidateQueries({ queryKey: ['recipes'] });
            await queryClient.setQueryData(['recipes', createdRecipe.id], createdRecipe);
            return navigate(`/recipes/${createdRecipe.id}`);
        },
        onError: (error) => dispatchShowNotification('error', extractErrorMessage(error)),
    });
};

export const fetchRecipe = async (id?: number, config?: AxiosRequestConfig): Promise<RecipeType | undefined> => {
    const response = await client.get(`/internal/recipes/${id}`, { ...config });
    return response.data;
};

export const useRecipe = (id?: number): UseQueryResult<RecipeType | undefined, AxiosError<ErrorType, void>> => {
    return useQueryWithErrorNotification({
        queryKey: ['recipes', id],
        queryFn: ({ signal }) => fetchRecipe(id, { signal }),
        enabled: !!id,
    });
};

const updateRecipe = async (recipe: RecipeUpdateType, config?: AxiosRequestConfig): Promise<RecipeType> => {
    const response = await client.put(`/internal/recipes/${recipe.id}`, recipe, { ...config });
    return response.data;
};

export const useRecipeUpdate = (
    onSuccess: (savedRecipe: RecipeType) => void = () => {},
    onError: (error: AxiosError<ErrorType, RecipeUpdateType>) => void = () => {},
): UseMutationResult<RecipeType, AxiosError<ErrorType, RecipeUpdateType>, RecipeUpdateType> => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: updateRecipe,
        onSuccess: async (savedRecipe) => {
            onSuccess(savedRecipe);
            await queryClient.invalidateQueries({ queryKey: ['recipes'] });
            await queryClient.setQueryData(['recipes', savedRecipe.id], savedRecipe);
            return navigate('/recipes');
        },
        onError: (error) => onError(error),
    });
};

const deleteRecipe = async (recipeDeletionType: RecipeDeletionType, config?: AxiosRequestConfig): Promise<void | undefined> => {
    const response = await client.delete(`/internal/recipes/${recipeDeletionType.id}`, { ...config });
    return response.data;
};

export const useDeleteRecipe = (): UseMutationResult<void, AxiosError<ErrorType, RecipeDeletionType>, RecipeDeletionType> => {
    const queryClient = useQueryClient();
    const { dispatchShowNotification } = useNotification();

    return useMutation({
        mutationFn: deleteRecipe,
        onSuccess: async (_, { id }) => {
            dispatchShowNotification('success', `Successfully deleted Recipe #${id}`);
            await queryClient.invalidateQueries({ queryKey: ['recipes'] });
        },
        onError: (error) => dispatchShowNotification('error', extractErrorMessage(error)),
    });
};

// Additional helper endpoints
export const useRecipeIngredients = (ingredientId?: number): UseQueryResult<RecipeType[], AxiosError<ErrorType, void>> => {
    return useQueryWithErrorNotification({
        queryKey: ['recipeIngredients', ingredientId],
        queryFn: async ({ signal }) => {
            const response = await client.get('/internal/recipes', {
                signal,
                params: { ingredientId }
            });
            return response.data.recipes;
        },
        enabled: !!ingredientId
    });
};

export const useRecipesByNutritionalCategory = (categoryId?: number): UseQueryResult<RecipeType[], AxiosError<ErrorType, void>> => {
    return useQueryWithErrorNotification({
        queryKey: ['recipesByNutritionalCategory', categoryId],
        queryFn: async ({ signal }) => {
            if (!categoryId) return [];

            const response = await client.get('/internal/recipes', {
                signal
            });

            const filteredRecipes = response.data.recipes.filter((recipe: RecipeType) =>
                recipe.nutritionalCategoryIds.some(id => id === categoryId)
            );

            return filteredRecipes;
        },
        enabled: !!categoryId
    });
};

export const useRecipesByAllergenRestriction = (restrictionId?: number): UseQueryResult<RecipeType[], AxiosError<ErrorType, void>> => {
    return useQueryWithErrorNotification({
        queryKey: ['recipesByRestriction', restrictionId],
        queryFn: async ({ signal }) => {
            if (!restrictionId) return [];

            const response = await client.get('/internal/recipes', {
                signal
            });

            return response.data.recipes.filter((recipe: RecipeType) =>
                recipe.allergenRestrictionIds.some(id => id === restrictionId)
            );
        },
        enabled: !!restrictionId
    });
};


// Validation helpers
export const validateRecipeName = (name?: string): string | undefined => {
    if (!name) {
        return 'Recipe name is required';
    }
    if (name.length > 50) {
        return 'Recipe name must not be longer than 50 characters';
    }
    return undefined;
};

export const validateRecipePrice = (price?: BigDecimal): string | undefined => {
    if (!price && price !== 0) {
        return 'Price is required';
    }
    if (price < 0) {
        return 'Price cannot be negative';
    }
    return undefined;
};

export const validateRecipeIngredients = (ingredients?: RecipeIngredientType[]): string | undefined => {
    if (!ingredients || ingredients.length === 0) {
        return 'At least one ingredient is required';
    }
    return undefined;
};