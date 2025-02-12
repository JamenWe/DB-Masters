import React, {FC} from 'react';
import {CssBaseline, StyledEngineProvider} from '@mui/material';
import {HelmetProvider} from 'react-helmet-async';
import {Route, Routes} from 'react-router';
import {BrowserRouter} from 'react-router-dom';
import {NotFound} from 'src/pages/ErrorPage';
import Layout from 'src/pages/Layout';
import IndexPage from 'src/pages/IndexPage';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import NotificationContextProvider from 'src/components/notifications/NotificationContextProvider';
import Store from 'src/state/context';
import {LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import Customers from "src/pages/customer/Customers";
import CustomerEditLoader from "src/pages/customer/CustomerEditLoader";
import Suppliers from "src/pages/suppliers/Suppliers";
import SupplierEditLoader from "src/pages/suppliers/SupplierEditLoader";
import NutritionalCategories from "src/pages/nutritionalCategories/NutritionalCategories";
import NutritionalCategoryEditLoader from "src/pages/nutritionalCategories/NutritionalCategoryEditLoader";
import AllergenRestrictions from "src/pages/allergenRestrictions/AllergenRestrictions";
import AllergenRestrictionEditLoader from "src/pages/allergenRestrictions/AllergenRestrictionEditLoader";
import Ingredients from "src/pages/ingredients/Ingredients";
import IngredientEditLoader from "src/pages/ingredients/IngredientEditLoader";
import Recipes from "src/pages/recipes/Recipes";
import RecipeEditLoader from "src/pages/recipes/RecipeEditLoader";
import {ColorModeProvider} from "src/theme/ColorModeContext";
import Orders from "src/pages/orders/Orders";
import OrderEditLoader from "src/pages/orders/OrderEditLoader";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});

const App: FC = () => {
    return (
        <Store>
            <StyledEngineProvider injectFirst={true}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <ColorModeProvider>
                            <HelmetProvider>
                                <QueryClientProvider client={queryClient}>
                                    <NotificationContextProvider>
                                        <CssBaseline/>
                                        <BrowserRouter>
                                            <Routes>
                                                <Route path="/" element={<Layout/>}>
                                                    <Route path="" index={true} element={<IndexPage/>}/>
                                                    <Route path="customers" element={<Customers/>}/>
                                                    <Route path="customers/:id" element={<CustomerEditLoader/>}/>
                                                    <Route path="suppliers" element={<Suppliers/>}/>
                                                    <Route path="suppliers/:id" element={<SupplierEditLoader/>}/>
                                                    <Route path="ingredients" element={<Ingredients/>}/>
                                                    <Route path="ingredients/:id" element={<IngredientEditLoader/>}/>
                                                    <Route path="recipes" element={<Recipes/>}/>
                                                    <Route path="recipes/:id" element={<RecipeEditLoader/>}/>
                                                    <Route path="orders" element={<Orders/>}/>
                                                    <Route path="orders/:id" element={<OrderEditLoader/>}/>
                                                    <Route path="nutrition" element={<NutritionalCategories/>}/>
                                                    <Route path="nutrition/:id" element={<NutritionalCategoryEditLoader/>}/>
                                                    <Route path="allergies" element={<AllergenRestrictions/>}/>
                                                    <Route path="allergies/:id" element={<AllergenRestrictionEditLoader/>}/>
                                                    <Route path="*" element={<NotFound/>}/>
                                                </Route>
                                            </Routes>
                                        </BrowserRouter>
                                    </NotificationContextProvider>
                                </QueryClientProvider>
                            </HelmetProvider>
                        </ColorModeProvider>
                    </LocalizationProvider>
            </StyledEngineProvider>
        </Store>
    );
};

export default App;