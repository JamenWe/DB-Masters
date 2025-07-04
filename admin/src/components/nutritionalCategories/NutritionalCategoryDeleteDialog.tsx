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
import {NutritionalCategoryType, useDeleteNutritionalCategory} from 'src/api/nutritionalCategories';
import {Delete} from '@mui/icons-material';
import {useRecipes} from "src/api/recipes";

type NutritionalCategoryDeleteDialogProps = {
    category: NutritionalCategoryType;
};

const NutritionalCategoryDeleteDialog: FC<NutritionalCategoryDeleteDialogProps> = (props) => {
    const { category } = props;
    const [open, setOpen] = useState(false);

    const { mutate: deleteCategory } = useDeleteNutritionalCategory();
    const { data: recipesData } = useRecipes();

    const hasAssociatedRecipes = recipesData?.items.some(recipe =>
        recipe.nutritionalCategoryIds.includes(category.id)
    ) ?? false;

    const handleDelete = useCallback(() => {
        deleteCategory({ id: category.id });
        setOpen(false);
    }, [deleteCategory, category.id]);

    const handleClose = (): void => {
        setOpen(false);
    };

    const deleteTitle = hasAssociatedRecipes
        ? "Cannot delete category that is used in a recipe"
        : "Delete Nutritional Category";

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
                <DialogTitle>Delete Nutritional Category #{category.id}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the nutritional category
                        #{category.id} "{category.name}"?
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
                        Delete Category
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default NutritionalCategoryDeleteDialog;