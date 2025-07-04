import {FC} from 'react';
import {IconButton, Link, TableCell, TableRow, Tooltip} from '@mui/material';
import {NutritionalCategoryType} from 'src/api/nutritionalCategories';
import {Link as RouterLink} from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import NutritionalCategoryDeleteDialog from './NutritionalCategoryDeleteDialog';

interface NutritionalCategoriesTableRowProps {
    category: NutritionalCategoryType;
}

const NutritionalCategoriesTableRow: FC<NutritionalCategoriesTableRowProps> = (props) => {
    const { category } = props;

    return (
        <TableRow>
            <TableCell>
                <Link
                    underline="hover"
                    component={RouterLink}
                    to={`/nutrition/${category.id}`}
                >
                    {category.id}
                </Link>
            </TableCell>
            <TableCell>{category.name}</TableCell>
            <TableCell>
                <Tooltip title="Edit Nutritional Category">
                    <IconButton
                        component={RouterLink}
                        to={`/nutrition/${category.id}`}
                        color="primary"
                    >
                        <EditIcon/>
                    </IconButton>
                </Tooltip>
                <NutritionalCategoryDeleteDialog category={category} />
            </TableCell>
        </TableRow>
    );
};

export default NutritionalCategoriesTableRow;