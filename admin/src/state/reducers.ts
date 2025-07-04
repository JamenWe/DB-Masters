import {CustomerFilterType} from 'src/api/customers';
import {SupplierFilterType} from "src/api/suppliers";
import {NutritionalCategoryFilterType} from "src/api/nutritionalCategories";
import {AllergenRestrictionFilterType} from "src/api/allergenRestrictions";
import {IngredientFilterType} from "src/api/ingredients";
import {RecipeFilterType} from "src/api/recipes";
import {OrderFilterType} from "src/api/orders";

export enum StoreActions {
    UpdateCustomerFilter = 'UPDATE_CUSTOMER_FILTER',
    ResetCustomerFilter = 'RESET_CUSTOMER_FILTER',
    UpdateSupplierFilter = 'UPDATE_SUPPLIER_FILTER',
    ResetSupplierFilter = 'RESET_SUPPLIER_FILTER',
    UpdateIngredientFilter = 'UPDATE_INGREDIENT_FILTER',
    ResetIngredientFilter = 'RESET_INGREDIENT_FILTER',
    UpdateRecipeFilter = 'UPDATE_RECIPE_FILTER',
    ResetRecipeFilter = 'RESET_RECIPE_FILTER',
    UpdateOrderFilter = 'UPDATE_ORDER_FILTER',
    ResetOrderFilter = 'RESET_ORDER_FILTER',
    UpdateNutritionalCategoryFilter = 'UPDATE_NUTRITIONAL_CATEGORY_FILTER',
    ResetNutritionalCategoryFilter = 'RESET_NUTRITIONAL_CATEGORY_FILTER',
    UpdateAllergenRestrictionFilter = 'UPDATE_ALLERGEN_RESTRICTION_FILTER',
    ResetAllergenRestrictionFilter = 'RESET_ALLERGEN_RESTRICTION_FILTER',
}

export type CustomerFilterActionType = {
    type: StoreActions.UpdateCustomerFilter | StoreActions.ResetCustomerFilter;
    payload?: CustomerFilterType;
};

export type SupplierFilterActionType = {
    type: StoreActions.UpdateSupplierFilter | StoreActions.ResetSupplierFilter;
    payload?: SupplierFilterType;
};

export type IngredientFilterActionType = {
    type: StoreActions.UpdateIngredientFilter | StoreActions.ResetIngredientFilter;
    payload?: IngredientFilterType;
};

export type RecipeFilterActionType = {
    type: StoreActions.UpdateRecipeFilter | StoreActions.ResetRecipeFilter;
    payload?: RecipeFilterType;
};

export type OrderFilterActionType = {
    type: StoreActions.UpdateOrderFilter | StoreActions.ResetOrderFilter;
    payload?: OrderFilterType;
};

export type NutritionalCategoryFilterActionType = {
    type: StoreActions.UpdateNutritionalCategoryFilter | StoreActions.ResetNutritionalCategoryFilter;
    payload?: NutritionalCategoryFilterType;
};

export type AllergenRestrictionFilterActionType = {
    type: StoreActions.UpdateAllergenRestrictionFilter | StoreActions.ResetAllergenRestrictionFilter;
    payload?: AllergenRestrictionFilterType;
};

export const customerFilterReducer = (state: CustomerFilterType, action: CustomerFilterActionType): CustomerFilterType => {
    switch (action.type) {
        case StoreActions.UpdateCustomerFilter:
            return {
                ...state,
                ...action.payload,
            };
        case StoreActions.ResetCustomerFilter:
            return {};
        default:
            return state;
    }
};

export const supplierFilterReducer = (state: SupplierFilterType, action: SupplierFilterActionType): SupplierFilterType => {
    switch (action.type) {
        case StoreActions.UpdateSupplierFilter:
            return {
                ...state,
                ...action.payload,
            };
        case StoreActions.ResetSupplierFilter:
            return {};
        default:
            return state;
    }
};

export const ingredientFilterReducer = (
    state: IngredientFilterType,
    action: IngredientFilterActionType
): IngredientFilterType => {
    switch (action.type) {
        case StoreActions.UpdateIngredientFilter:
            return {
                ...state,
                ...action.payload,
            };
        case StoreActions.ResetIngredientFilter:
            return {};
        default:
            return state;
    }
};

export const recipeFilterReducer = (state: RecipeFilterType, action: RecipeFilterActionType): RecipeFilterType => {
    switch (action.type) {
        case StoreActions.UpdateRecipeFilter:
            return {
                ...state,
                ...action.payload,
            };
        case StoreActions.ResetRecipeFilter:
            return {};
        default:
            return state;
    }
};

export const orderFilterReducer = (state: OrderFilterType, action: OrderFilterActionType): OrderFilterType => {
    switch (action.type) {
        case StoreActions.UpdateOrderFilter:
            return {
                ...state,
                ...action.payload,
            };
        case StoreActions.ResetOrderFilter:
            return {};
        default:
            return state;
    }
};

export const nutritionalCategoryFilterReducer = (
    state: NutritionalCategoryFilterType,
    action: NutritionalCategoryFilterActionType
): NutritionalCategoryFilterType => {
    switch (action.type) {
        case StoreActions.UpdateNutritionalCategoryFilter:
            return {
                ...state,
                ...action.payload,
            };
        case StoreActions.ResetNutritionalCategoryFilter:
            return {};
        default:
            return state;
    }
};

export const allergenRestrictionFilterReducer = (
    state: AllergenRestrictionFilterType,
    action: AllergenRestrictionFilterActionType
): AllergenRestrictionFilterType => {
    switch (action.type) {
        case StoreActions.UpdateAllergenRestrictionFilter:
            return {
                ...state,
                ...action.payload,
            };
        case StoreActions.ResetAllergenRestrictionFilter:
            return {};
        default:
            return state;
    }
};