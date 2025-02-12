// src/components/recipes/RecipesTableRow.tsx
import React, {FC} from 'react';
import {Box, IconButton, Link, TableCell, TableRow, Tooltip} from '@mui/material';
import {BasicRecipeType} from 'src/api/recipes';
import {Link as RouterLink} from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import RecipeDeleteDialog from "src/components/recipes/RecipeDeleteDialog";
import {useAllergenRestrictions} from "src/api/allergenRestrictions";
import {useNutritionalCategories} from "src/api/nutritionalCategories";

interface RecipesTableRowProps {
    recipe: BasicRecipeType;
}

const RecipesTableRow: FC<RecipesTableRowProps> = (props) => {
    const { recipe } = props;

    // Fetch all categories and restrictions at once
    const { data: nutritionalCategories } = useNutritionalCategories();
    const { data: allergenRestrictions } = useAllergenRestrictions();

    // Filter the ones we need
    const recipeNutritionalCategories = nutritionalCategories?.items.filter(
        category => recipe.nutritionalCategoryIds.includes(category.id)
    ) ?? [];

    const recipeAllergenRestrictions = allergenRestrictions?.items.filter(
        restriction => recipe.allergenRestrictionIds.includes(restriction.id)
    ) ?? [];

    const formatPrice = (price?: number) => {
        if (price === undefined || price === null) return '';
        return price.toFixed(2);
    };

    return (
        <TableRow>
            <TableCell>
                <Link
                    underline="hover"
                    component={RouterLink}
                    to={`/recipes/${recipe.id}`}
                >
                    {recipe.id}
                </Link>
            </TableCell>
            <TableCell>{recipe.name}</TableCell>
            <TableCell>{formatPrice(recipe.netPrice)}</TableCell>
            <TableCell>{recipe.preparationTime} minutes</TableCell>
            <TableCell >
                {recipeNutritionalCategories.reverse().map((category, index) => (
                    <Box>
                        <React.Fragment key={category.id}>
                            <Link
                                underline="hover"
                                component={RouterLink}
                                to={`/nutrition/${category.id}`}
                            >
                                #{category.id} - {category.name}
                            </Link>
                            {index < recipeNutritionalCategories.length - 1 && ', '}
                        </React.Fragment>
                    </Box>
                ))}
            </TableCell>
            <TableCell>
                {recipeAllergenRestrictions.reverse().map((restriction, index) => (
                    <Box>
                        <React.Fragment key={restriction.id}>
                            <Link
                                underline="hover"
                                component={RouterLink}
                                to={`/allergies/${restriction.id}`}
                            >
                                #{restriction.id} - {restriction.name}
                            </Link>
                            {index < recipeAllergenRestrictions.length - 1}
                        </React.Fragment>
                    </Box>
                ))}
            </TableCell>
            <TableCell>
                <Tooltip title="Edit Recipe">
                    <IconButton
                        component={RouterLink}
                        to={`/recipes/${recipe.id}`}
                        color="primary"
                    >
                        <EditIcon/>
                    </IconButton>
                </Tooltip>
                <RecipeDeleteDialog recipe={recipe} />
            </TableCell>
        </TableRow>
    );
};

export default RecipesTableRow;