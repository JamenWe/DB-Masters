// src/components/ingredients/IngredientsTableRow.tsx
import * as React from 'react';
import {FC} from 'react';
import {IconButton, Link, TableCell, TableRow, Tooltip} from '@mui/material';
import {IngredientType} from 'src/api/ingredients';
import {Link as RouterLink} from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import {useSupplier} from 'src/api/suppliers';
import IngredientDeleteDialog from "src/components/ingredients/IngredientDeleteDialog";

interface IngredientsTableRowProps {
    ingredient: IngredientType;
}

const IngredientsTableRow: FC<IngredientsTableRowProps> = (props) => {
    const { ingredient } = props;
    const { data: supplier } = useSupplier(ingredient.supplierId);

    const formatDecimal = (value?: number) => {
        if (value === undefined || value === null) return '';
        return value.toFixed(2);
    };

    return (
        <TableRow>
            <TableCell>
                <Link
                    underline="hover"
                    component={RouterLink}
                    to={`/ingredients/${ingredient.id}`}
                >
                    {ingredient.id}
                </Link>
            </TableCell>
            <TableCell>{ingredient.name}</TableCell>
            <TableCell>{ingredient.unit}</TableCell>
            <TableCell>{formatDecimal(ingredient.netPrice)}</TableCell>
            <TableCell>{ingredient.stock}</TableCell>
            <TableCell>{ingredient.calories}</TableCell>
            <TableCell>{formatDecimal(ingredient.carbohydrates)}</TableCell>
            <TableCell>{formatDecimal(ingredient.protein)}</TableCell>
            <TableCell>
                <Link
                    underline="hover"
                    component={RouterLink}
                    to={`/suppliers/${ingredient.supplierId}`}
                >
                    #{ingredient.supplierId} - {supplier?.name}
                </Link>
            </TableCell>
            <TableCell>
                <Tooltip title="Edit Ingredient">
                    <IconButton
                        component={RouterLink}
                        to={`/ingredients/${ingredient.id}`}
                        color="primary"
                    >
                        <EditIcon/>
                    </IconButton>
                </Tooltip>
                <IngredientDeleteDialog ingredient={ingredient} />
            </TableCell>
        </TableRow>
    );
};

export default IngredientsTableRow;