import * as React from 'react';
import {FC, useCallback} from 'react';
import {Button, TextField} from '@mui/material';
import {Clear} from '@mui/icons-material';
import {IngredientFilterType} from 'src/api/ingredients';
import Grid2 from '@mui/material/Grid2';
import Grid2FilterBoxItemWrapper from 'src/components/wrappers/Grid2FilterBoxItemWrapper';
import {Stack} from '@mui/system';
import {hideNumberInputArrows} from "src/util/styles";

export type IngredientsFilterBoxProps = {
    filter?: IngredientFilterType;
    fixedFilterKeys?: (keyof IngredientFilterType)[];
    onChange?: (filter: IngredientFilterType) => void;
    onClear?: () => void;
};

const IngredientsFilterBox: FC<IngredientsFilterBoxProps> = (props) => {
    const { filter, fixedFilterKeys, onChange, onClear } = props;

    const handleIdChange = useCallback((id?: string): void => {
        onChange?.({ ...filter, id: id ? parseInt(id) : undefined });
    }, [filter, onChange]);

    const handleNameChange = useCallback((name?: string): void => {
        onChange?.({ ...filter, name: name || undefined });
    }, [filter, onChange]);

    const handleUnitChange = useCallback((unit?: string): void => {
        onChange?.({ ...filter, unit: unit || undefined });
    }, [filter, onChange]);

    const handleNetPriceChange = useCallback((netPrice?: string): void => {
        onChange?.({ ...filter, netPrice: netPrice ? parseFloat(netPrice) : undefined });
    }, [filter, onChange]);

    const handleStockChange = useCallback((stock?: string): void => {
        onChange?.({ ...filter, stock: stock ? parseInt(stock) : undefined });
    }, [filter, onChange]);

    const handleCaloriesChange = useCallback((calories?: string): void => {
        onChange?.({ ...filter, calories: calories ? parseInt(calories) : undefined });
    }, [filter, onChange]);

    const handleCarbohydratesChange = useCallback((carbohydrates?: string): void => {
        onChange?.({ ...filter, carbohydrates: carbohydrates ? parseFloat(carbohydrates) : undefined });
    }, [filter, onChange]);

    const handleProteinChange = useCallback((protein?: string): void => {
        onChange?.({ ...filter, protein: protein ? parseFloat(protein) : undefined });
    }, [filter, onChange]);

    const handleSupplierNameChange = useCallback((supplierName?: string): void => {
        onChange?.({ ...filter, supplierName: supplierName || undefined });
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
                        label="Unit"
                        value={filter?.unit ?? ''}
                        onChange={(event) => handleUnitChange(event.target.value)}
                        fullWidth
                        disabled={fixedFilterKeys?.includes('unit')}
                    />
                </Grid2FilterBoxItemWrapper>

                <Grid2FilterBoxItemWrapper>
                    <TextField
                        size="small"
                        label="Price"
                        value={filter?.netPrice ?? ''}
                        onChange={(event) => handleNetPriceChange(event.target.value)}
                        fullWidth
                        disabled={fixedFilterKeys?.includes('netPrice')}
                        type="number"
                        sx={hideNumberInputArrows}
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
                        label="Stock"
                        value={filter?.stock ?? ''}
                        onChange={(event) => handleStockChange(event.target.value)}
                        fullWidth
                        disabled={fixedFilterKeys?.includes('stock')}
                        type="number"
                        sx={hideNumberInputArrows}
                    />
                </Grid2FilterBoxItemWrapper>

                <Grid2FilterBoxItemWrapper>
                    <TextField
                        size="small"
                        label="Calories"
                        value={filter?.calories ?? ''}
                        onChange={(event) => handleCaloriesChange(event.target.value)}
                        fullWidth
                        disabled={fixedFilterKeys?.includes('calories')}
                        type="number"
                        sx={hideNumberInputArrows}
                    />
                </Grid2FilterBoxItemWrapper>

                <Grid2FilterBoxItemWrapper>
                    <TextField
                        size="small"
                        label="Carbs"
                        value={filter?.carbohydrates ?? ''}
                        onChange={(event) => handleCarbohydratesChange(event.target.value)}
                        fullWidth
                        disabled={fixedFilterKeys?.includes('carbohydrates')}
                        type="number"
                        sx={hideNumberInputArrows}
                    />
                </Grid2FilterBoxItemWrapper>

                <Grid2FilterBoxItemWrapper>
                    <TextField
                        size="small"
                        label="Protein"
                        value={filter?.protein ?? ''}
                        onChange={(event) => handleProteinChange(event.target.value)}
                        fullWidth
                        disabled={fixedFilterKeys?.includes('protein')}
                        type="number"
                        sx={hideNumberInputArrows}
                    />
                </Grid2FilterBoxItemWrapper>
            </Grid2>

            {/* Third Row */}
            <Grid2
                container
                spacing={3}
            >
                <Grid2FilterBoxItemWrapper>
                    <TextField
                        size="small"
                        label="Supplier Name"
                        value={filter?.supplierName ?? ''}
                        onChange={(event) => handleSupplierNameChange(event.target.value)}
                        fullWidth
                        disabled={fixedFilterKeys?.includes('supplierName')}
                    />
                </Grid2FilterBoxItemWrapper>

                <Grid2FilterBoxItemWrapper>
                    {/* Empty spacer */}
                </Grid2FilterBoxItemWrapper>

                <Grid2FilterBoxItemWrapper>
                    {/* Empty spacer */}
                </Grid2FilterBoxItemWrapper>

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

export default IngredientsFilterBox;