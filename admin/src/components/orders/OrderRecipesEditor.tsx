import React, {FC} from 'react';
import {
    Autocomplete,
    Box,
    IconButton,
    Link,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import {Add as AddIcon, Delete as DeleteIcon} from '@mui/icons-material';
import {RecipeType} from 'src/api/recipes';
import {OrderRecipeRequest} from 'src/api/orders';
import {hideNumberInputArrows} from "src/util/styles";
import {Link as RouterLink} from "react-router-dom";

interface OrderRecipesEditorProps {
    availableRecipes: RecipeType[];
    selectedRecipes: OrderRecipeRequest[];
    onChange: (recipes: OrderRecipeRequest[]) => void;
}

const OrderRecipesEditor: FC<OrderRecipesEditorProps> = ({
    availableRecipes,
    selectedRecipes,
    onChange
}) => {
    const [selectedRecipe, setSelectedRecipe] = React.useState<RecipeType | null>(null);
    const [quantity, setQuantity] = React.useState<string>('');

    const handleAdd = () => {
        if (selectedRecipe && quantity) {
            const newQuantity = parseInt(quantity);
            if (newQuantity > 0) {
                const newRecipes = [...selectedRecipes];
                const existingIndex = newRecipes.findIndex(
                    r => r.recipeId === selectedRecipe.id
                );

                if (existingIndex >= 0) {
                    newRecipes[existingIndex] = {
                        ...newRecipes[existingIndex],
                        quantity: newQuantity
                    };
                } else {
                    newRecipes.push({
                        recipeId: selectedRecipe.id,
                        quantity: newQuantity
                    });
                }

                onChange(newRecipes);
                setSelectedRecipe(null);
                setQuantity('');
            }
        }
    };

    const handleDelete = (recipeId: number) => {
        onChange(selectedRecipes.filter(r => r.recipeId !== recipeId));
    };

    const availableRecipesFiltered = availableRecipes.filter(
        recipe => !selectedRecipes.some(sr => sr.recipeId === recipe.id)
    );

    const formatPrice = (price?: number) => {
        if (price === undefined || price === null) return '';
        return price.toFixed(2);
    };

    return (
        <Box>
            <Typography variant="subtitle1" gutterBottom>
                Order Recipes
            </Typography>

            {/* Add Recipe Section */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Autocomplete
                    sx={{ flex: 1 }}
                    options={availableRecipesFiltered}
                    getOptionLabel={(option) => `${option.name} (€${formatPrice(option.netPrice)})`}
                    value={selectedRecipe}
                    onChange={(_, newValue) => setSelectedRecipe(newValue)}
                    renderInput={(params) => (
                        <TextField {...params} label="Select Recipe" size="small" />
                    )}
                />
                <TextField
                    sx={{
                        width: 120,
                        ...hideNumberInputArrows
                    }}
                    label="Quantity"
                    type="number"
                    size="small"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    inputProps={{ min: 1 }}
                />
                <IconButton
                    color="primary"
                    onClick={handleAdd}
                    disabled={!selectedRecipe || !quantity}
                >
                    <AddIcon />
                </IconButton>
            </Box>

            {/* Selected Recipes Table */}
            {selectedRecipes.length > 0 && (
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Recipe</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                            <TableCell align="right">Price per Unit</TableCell>
                            <TableCell align="right">Total Price</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {selectedRecipes.map((recipe) => {
                            const recipeDetails = availableRecipes.find(
                                r => r.id === recipe.recipeId
                            );
                            const totalPrice = recipeDetails
                                ? recipeDetails.netPrice * recipe.quantity
                                : 0;

                            return (
                                <TableRow key={recipe.recipeId}>
                                    <TableCell>
                                        <Link
                                            underline="hover"
                                            component={RouterLink}
                                            to={`/recipes/${recipeDetails?.id}`}
                                        >
                                            #{recipeDetails?.id} - {recipeDetails?.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell align="right">{recipe.quantity}</TableCell>
                                    <TableCell align="right">
                                        €{formatPrice(recipeDetails?.netPrice)}
                                    </TableCell>
                                    <TableCell align="right">
                                        €{formatPrice(totalPrice)}
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => handleDelete(recipe.recipeId)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            )}
        </Box>
    );
};

export default OrderRecipesEditor;