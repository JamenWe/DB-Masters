import React, {createContext, FC, ReactNode, useReducer} from 'react';
import {CustomerFilterType} from 'src/api/customers';
import {
    AllergenRestrictionFilterActionType,
    allergenRestrictionFilterReducer,
    CustomerFilterActionType,
    customerFilterReducer,
    IngredientFilterActionType,
    ingredientFilterReducer,
    NutritionalCategoryFilterActionType,
    nutritionalCategoryFilterReducer,
    OrderFilterActionType,
    orderFilterReducer,
    RecipeFilterActionType,
    recipeFilterReducer,
    SupplierFilterActionType,
    supplierFilterReducer,
} from 'src/state/reducers';
import {SupplierFilterType} from "src/api/suppliers";
import {NutritionalCategoryFilterType} from "src/api/nutritionalCategories";
import {AllergenRestrictionFilterType} from "src/api/allergenRestrictions";
import {IngredientFilterType} from "src/api/ingredients";
import {RecipeFilterType} from "src/api/recipes";
import {OrderFilterType} from "src/api/orders";

export type AppStateType = {
    customerFilters: CustomerFilterType,
    supplierFilters: SupplierFilterType,
    ingredientFilters: IngredientFilterType;
    recipeFilters: RecipeFilterType;
    orderFilters: OrderFilterType;
    nutritionalCategoryFilters: NutritionalCategoryFilterType;
    allergenRestrictionFilters: AllergenRestrictionFilterType;
};

type AppContextProps = {
    children: ReactNode
};

type AppAction =
    | CustomerFilterActionType
    | SupplierFilterActionType
    | IngredientFilterActionType
    | RecipeFilterActionType
    | OrderFilterActionType
    | NutritionalCategoryFilterActionType
    | AllergenRestrictionFilterActionType;

const initialState: AppStateType = {
    customerFilters: {},
    supplierFilters: {},
    ingredientFilters: {},
    recipeFilters: {},
    orderFilters: {},
    nutritionalCategoryFilters: {},
    allergenRestrictionFilters: {},
};

const mainReducer = ({
        customerFilters,
        supplierFilters,
        ingredientFilters,
        recipeFilters,
        orderFilters,
        nutritionalCategoryFilters,
        allergenRestrictionFilters,
    }: AppStateType,
    action: AppAction
): AppStateType => ({
    customerFilters: customerFilterReducer(customerFilters, action as CustomerFilterActionType),
    supplierFilters: supplierFilterReducer(supplierFilters, action as SupplierFilterActionType),
    ingredientFilters: ingredientFilterReducer(ingredientFilters, action as IngredientFilterActionType),
    recipeFilters: recipeFilterReducer(recipeFilters, action as RecipeFilterActionType),
    orderFilters: orderFilterReducer(orderFilters, action as OrderFilterActionType),
    nutritionalCategoryFilters: nutritionalCategoryFilterReducer(
        nutritionalCategoryFilters,
        action as NutritionalCategoryFilterActionType
    ),
    allergenRestrictionFilters: allergenRestrictionFilterReducer(
        allergenRestrictionFilters,
        action as AllergenRestrictionFilterActionType
    ),
});

export const AppContext = createContext<{
    state: AppStateType;
    dispatch: React.Dispatch<AppAction>;
}>({
    state: initialState,
    dispatch: () => null,
});

const Store: FC<AppContextProps> = (props) => {
    const { children } = props;
    const [state, dispatch] = useReducer(mainReducer, initialState);
    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
};

export default Store;