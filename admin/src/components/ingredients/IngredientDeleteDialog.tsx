import * as React from 'react';
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
import {IngredientType, useDeleteIngredient} from 'src/api/ingredients';
import {Delete} from '@mui/icons-material';
import {useRecipes} from 'src/api/recipes';

type IngredientDeleteDialogProps = {
    ingredient: IngredientType;
};

const IngredientDeleteDialog: FC<IngredientDeleteDialogProps> = (props) => {
    const { ingredient } = props;
    const [open, setOpen] = useState(false);
    const { mutate: deleteIngredient } = useDeleteIngredient();

    const { data: recipesData } = useRecipes({ ingredientId: ingredient.id });
    const isUsedInRecipe = recipesData && recipesData.page.total > 0;

    const handleDelete = useCallback(() => {
        deleteIngredient({ id: ingredient.id });
        setOpen(false);
    }, [deleteIngredient, ingredient.id]);

    const handleClose = (): void => {
        setOpen(false);
    };

    const deleteDisabled = isUsedInRecipe;
    const deleteTitle = deleteDisabled
        ? "Cannot delete ingredient that is used in recipes"
        : "Delete Ingredient";

    return (
        <>
            <Tooltip title={deleteTitle}>
                <span>
                    <IconButton
                        onClick={() => setOpen(true)}
                        disabled={deleteDisabled}
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
                <DialogTitle>Delete Ingredient #{ingredient.id}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete ingredient
                        #{ingredient.id} "{ingredient.name}"?
                        This action cannot be undone.
                    </DialogContentText>
                    {isUsedInRecipe && (
                        <DialogContentText color="error" sx={{ mt: 2 }}>
                            This ingredient cannot be deleted because it is used in
                            {recipesData?.page.total === 1
                                ? ' 1 recipe'
                                : ` ${recipesData?.page.total} recipes`}.
                        </DialogContentText>
                    )}
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
                        disabled={deleteDisabled}
                    >
                        Delete Ingredient
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default IngredientDeleteDialog;