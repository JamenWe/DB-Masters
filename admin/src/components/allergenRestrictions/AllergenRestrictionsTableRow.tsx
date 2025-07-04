import {FC} from 'react';
import {IconButton, Link, TableCell, TableRow, Tooltip} from '@mui/material';
import {AllergenRestrictionType} from 'src/api/allergenRestrictions';
import {Link as RouterLink} from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import AllergenRestrictionDeleteDialog from 'src/components/allergenRestrictions/AllergenRestrictionDeleteDialog';

interface AllergenRestrictionsTableRowProps {
    allergen: AllergenRestrictionType;
}

const AllergenRestrictionsTableRow: FC<AllergenRestrictionsTableRowProps> = (props) => {
    const { allergen } = props;

    return (
        <TableRow>
            <TableCell>
                <Link
                    underline="hover"
                    component={RouterLink}
                    to={`/allergies/${allergen.id}`}
                >
                    {allergen.id}
                </Link>
            </TableCell>
            <TableCell>{allergen.name}</TableCell>
            <TableCell>
                <Tooltip title="Edit Allergen Restriction">
                    <IconButton
                        component={RouterLink}
                        to={`/allergies/${allergen.id}`}
                        color="primary"
                    >
                        <EditIcon/>
                    </IconButton>
                </Tooltip>
                <AllergenRestrictionDeleteDialog allergen={allergen} />
            </TableCell>
        </TableRow>
    );
};

export default AllergenRestrictionsTableRow;