import * as React from 'react';
import {FC, useCallback} from 'react';
import {Button, TextField} from '@mui/material';
import {Clear} from '@mui/icons-material';
import {RecipeFilterType} from 'src/api/recipes';
import Grid2 from '@mui/material/Grid2';
import Grid2FilterBoxItemWrapper from 'src/components/wrappers/Grid2FilterBoxItemWrapper';
import {Stack} from '@mui/system';
import {hideNumberInputArrows} from "src/util/styles";

export type RecipesFilterBoxProps = {
    filter?: RecipeFilterType;
    fixedFilterKeys?: (keyof RecipeFilterType)[];
    onChange?: (filter: RecipeFilterType) => void;
    onClear?: () => void;
};

const RecipesFilterBox: FC<RecipesFilterBoxProps> = (props) => {
    const { filter, fixedFilterKeys, onChange, onClear } = props;

    const handleIdChange = useCallback((id?: string): void => {
        onChange?.({ ...filter, id: id ? parseInt(id) : undefined });
    }, [filter, onChange]);

    const handleNameChange = useCallback((name?: string): void => {
        onChange?.({ ...filter, name: name || undefined });
    }, [filter, onChange]);

    const handleNetPriceChange = useCallback((netPrice?: string): void => {
        onChange?.({ ...filter, netPrice: netPrice ? parseFloat(netPrice) : undefined });
    }, [filter, onChange]);

    const handlePreparationTimeChange = useCallback((preparationTime?: string): void => {
        onChange?.({ ...filter, preparationTime: preparationTime ? parseInt(preparationTime) : undefined });
    }, [filter, onChange]);

    const handleNutritionalCategoryNameChange = useCallback((name?: string): void => {
        onChange?.({ ...filter, nutritionalCategoryName: name || undefined });
    }, [filter, onChange]);

    const handleAllergenRestrictionNameChange = useCallback((name?: string): void => {
        onChange?.({ ...filter, allergenRestrictionName: name || undefined });
    }, [filter, onChange]);

    const handleReset = (): void => {
        onClear?.();
    };

    return (
        <Stack spacing={3}>

            {/* First Row */}
            <Grid2
                container
                spacing={3}
            >
                <Grid2FilterBoxItemWrapper>
                    <TextField
                        size="small"
                        label="ID"
                        value={filter?.id ?? ''}
                        onChange={(event) => handleIdChange(event.target.value)}
                        fullWidth
                        disabled={fixedFilterKeys?.includes('id')}
                        type="number"
                        sx={hideNumberInputArrows}
                    />
                </Grid2FilterBoxItemWrapper>

                <Grid2FilterBoxItemWrapper>
                    <TextField
                        size="small"
                        label="Name"
                        value={filter?.name ?? ''}
                        onChange={(event) => handleNameChange(event.target.value)}
                        fullWidth
                        disabled={fixedFilterKeys?.includes('name')}
                    />
                </Grid2FilterBoxItemWrapper>

                <Grid2FilterBoxItemWrapper>
                    <TextField
                        size="small"
                        label="Net Price"
                        value={filter?.netPrice ?? ''}
                        onChange={(event) => handleNetPriceChange(event.target.value)}
                        fullWidth
                        disabled={fixedFilterKeys?.includes('netPrice')}
                        type="number"
                        inputProps={{ step: "0.01" }}
                    />
                </Grid2FilterBoxItemWrapper>
            </Grid2>

            {/* Second Row */}
            <Grid2
                container
                spacing={3}
            >
                <Grid2FilterBoxItemWrapper>
                    <TextField
                        size="small"
                        label="Preparation Time"
                        value={filter?.preparationTime ?? ''}
                        onChange={(event) => handlePreparationTimeChange(event.target.value)}
                        fullWidth
                        disabled={fixedFilterKeys?.includes('preparationTime')}
                        type="number"
                        sx={hideNumberInputArrows}
                    />
                </Grid2FilterBoxItemWrapper>

                <Grid2FilterBoxItemWrapper>
                    <TextField
                        size="small"
                        label="Nutritional Category Name"
                        value={filter?.nutritionalCategoryName ?? ''}
                        onChange={(event) => handleNutritionalCategoryNameChange(event.target.value)}
                        fullWidth
                        disabled={fixedFilterKeys?.includes('nutritionalCategoryName')}
                    />
                </Grid2FilterBoxItemWrapper>

                <Grid2FilterBoxItemWrapper>
                    <TextField
                        size="small"
                        label="Allergen Restriction Name"
                        value={filter?.allergenRestrictionName ?? ''}
                        onChange={(event) => handleAllergenRestrictionNameChange(event.target.value)}
                        fullWidth
                        disabled={fixedFilterKeys?.includes('allergenRestrictionName')}
                    />
                </Grid2FilterBoxItemWrapper>
            </Grid2>

            {/* Third Row */}
            <Grid2
                container
                spacing={3}
            >
                <Grid2FilterBoxItemWrapper sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="outlined"
                        color="primary"
                        title="Clear filter"
                        startIcon={<Clear/>}
                        onClick={handleReset}
                    >
                        Clear
                    </Button>
                </Grid2FilterBoxItemWrapper>
            </Grid2>
        </Stack>
    );
};

export default RecipesFilterBox;