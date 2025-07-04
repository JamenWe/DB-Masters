import {FC, useCallback, useState} from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Tooltip
} from '@mui/material';
import {AllergenRestrictionType, useDeleteAllergenRestriction} from 'src/api/allergenRestrictions';
import {Delete} from '@mui/icons-material';
import {useRecipes} from 'src/api/recipes';

type AllergenRestrictionDeleteDialogProps = {
    allergen: AllergenRestrictionType;
};

const AllergenRestrictionDeleteDialog: FC<AllergenRestrictionDeleteDialogProps> = (props) => {
    const { allergen } = props;
    const [open, setOpen] = useState(false);

    const { mutate: deleteAllergen } = useDeleteAllergenRestriction();
    const { data: recipesData } = useRecipes();

    const hasAssociatedRecipes = recipesData?.items.some(recipe =>
        recipe.allergenRestrictionIds.includes(allergen.id)
    ) ?? false;

    const handleDelete = useCallback(() => {
        deleteAllergen({ id: allergen.id });
        setOpen(false);
    }, [deleteAllergen, allergen.id]);

    const handleClose = (): void => {
        setOpen(false);
    };

    const deleteTitle = hasAssociatedRecipes
        ? "Cannot delete restriction that is used in a recipe"
        : "Delete Allergen Restriction";

    return (
        <>
            <Tooltip title={deleteTitle}>
                <span> {/* Wrap in span to make tooltip work when button is disabled */}
                    <IconButton
                        onClick={() => setOpen(true)}
                        disabled={hasAssociatedRecipes}
                        color="warning"
                    >
                        <Delete/>
                    </IconButton>
                </span>
            </Tooltip>
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="sm"
            >
                <DialogTitle>Delete Allergen Restriction #{allergen.id}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete allergen restriction
                        #{allergen.id} "{allergen.name}"?
                        This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleClose}
                        autoFocus={true}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDelete}
                        disabled={hasAssociatedRecipes}
                    >
                        Delete Allergen Restriction
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AllergenRestrictionDeleteDialog;