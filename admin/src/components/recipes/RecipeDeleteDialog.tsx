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
import {RecipeType, useDeleteRecipe} from 'src/api/recipes';
import {Delete} from '@mui/icons-material';

type RecipeDeleteDialogProps = {
    recipe: RecipeType;
};

const RecipeDeleteDialog: FC<RecipeDeleteDialogProps> = (props) => {
    const { recipe } = props;
    const [open, setOpen] = useState(false);

    const { mutate: deleteRecipe } = useDeleteRecipe();

    const handleDelete = useCallback(() => {
        deleteRecipe({ id: recipe.id });
        setOpen(false);
    }, [deleteRecipe, recipe.id]);

    const handleClose = (): void => {
        setOpen(false);
    };

    return (
        <>
            <Tooltip title="Delete Recipe">
                <IconButton
                    onClick={() => setOpen(true)}
                    color="warning"
                >
                    <Delete />
                </IconButton>
            </Tooltip>
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="sm"
            >
                <DialogTitle>Delete Recipe #{recipe.id}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete recipe
                        #{recipe.id} "{recipe.name}"?
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
                    >
                        Delete Recipe
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default RecipeDeleteDialog;