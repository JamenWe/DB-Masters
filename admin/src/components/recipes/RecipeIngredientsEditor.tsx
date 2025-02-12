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
import {IngredientType} from 'src/api/ingredients';
import {RecipeIngredientType} from 'src/api/recipes';
import {hideNumberInputArrows} from "src/util/styles";
import {Link as RouterLink} from "react-router-dom";

interface RecipeIngredientsEditorProps {
    availableIngredients: IngredientType[];
    selectedIngredients: RecipeIngredientType[];
    onChange: (ingredients: RecipeIngredientType[]) => void;
}

const RecipeIngredientsEditor: FC<RecipeIngredientsEditorProps> = ({
        availableIngredients,
        selectedIngredients,
        onChange
    }) => {
    const [selectedIngredient, setSelectedIngredient] = React.useState<IngredientType | null>(null);
    const [quantity, setQuantity] = React.useState<string>('');

    const handleAdd = () => {
        if (selectedIngredient && quantity) {
            const newQuantity = parseInt(quantity);
            if (newQuantity > 0) {
                const newIngredients = [...selectedIngredients];
                const existingIndex = newIngredients.findIndex(
                    i => i.ingredientId === selectedIngredient.id
                );

                if (existingIndex >= 0) {
                    newIngredients[existingIndex] = {
                        ...newIngredients[existingIndex],
                        quantity: newQuantity
                    };
                } else {
                    newIngredients.push({
                        ingredientId: selectedIngredient.id,
                        quantity: newQuantity
                    });
                }

                onChange(newIngredients);
                setSelectedIngredient(null);
                setQuantity('');
            }
        }
    };

    const handleDelete = (ingredientId: number) => {
        onChange(selectedIngredients.filter(i => i.ingredientId !== ingredientId));
    };

    const availableIngredientsFiltered = availableIngredients.filter(
        ingredient => !selectedIngredients.some(si => si.ingredientId === ingredient.id)
    );

    return (
        <Box>
            <Typography variant="subtitle1" gutterBottom>
                Ingredients
            </Typography>

            {/* Add Ingredient Section */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Autocomplete
                    sx={{ flex: 1 }}
                    options={availableIngredientsFiltered}
                    getOptionLabel={(option) => `${option.name}${option.unit ? ` (${option.unit})` : ''}`}
                    value={selectedIngredient}
                    onChange={(_, newValue) => setSelectedIngredient(newValue)}
                    renderInput={(params) => (
                        <TextField {...params} label="Select Ingredient" size="small" />
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
                    disabled={!selectedIngredient || !quantity}
                >
                    <AddIcon />
                </IconButton>
            </Box>

            {/* Selected Ingredients Table */}
            {selectedIngredients.length > 0 && (
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Ingredient</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                            <TableCell align="right">Unit</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {selectedIngredients.map((ingredient) => {
                            const ingredientDetails = availableIngredients.find(
                                i => i.id === ingredient.ingredientId
                            );
                            return (
                                <TableRow key={ingredient.ingredientId}>
                                    <TableCell>
                                        <Link
                                            underline="hover"
                                            component={RouterLink}
                                            to={`/ingredients/${ingredientDetails?.id}`}
                                        >
                                            #{ingredientDetails?.id} - {ingredientDetails?.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell align="right">{ingredient.quantity}</TableCell>
                                    <TableCell align="right">{ingredientDetails?.unit}</TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => handleDelete(ingredient.ingredientId)}
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

export default RecipeIngredientsEditor;