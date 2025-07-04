import {FC, useCallback} from 'react';
import {Button, TextField} from '@mui/material';
import {Clear} from '@mui/icons-material';
import {AllergenRestrictionFilterType} from 'src/api/allergenRestrictions';
import Grid2 from '@mui/material/Grid2';
import Grid2FilterBoxItemWrapper from 'src/components/wrappers/Grid2FilterBoxItemWrapper';
import {Stack} from '@mui/system';

export type AllergenRestrictionsFilterBoxProps = {
    filter?: AllergenRestrictionFilterType;
    fixedFilterKeys?: (keyof AllergenRestrictionFilterType)[];
    onChange?: (filter: AllergenRestrictionFilterType) => void;
    onClear?: () => void;
};

const AllergenRestrictionsFilterBox: FC<AllergenRestrictionsFilterBoxProps> = (props) => {
    const { filter, fixedFilterKeys, onChange, onClear } = props;

    const handleIdChange = useCallback((id?: string): void => {
        onChange?.({ ...filter, id: id ? parseInt(id) : undefined });
    }, [filter, onChange]);

    const handleNameChange = useCallback((name?: string): void => {
        onChange?.({ ...filter, name: name || undefined });
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
                    {/* Empty space */}
                </Grid2FilterBoxItemWrapper>

                <Grid2FilterBoxItemWrapper sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="outlined"
                        color="primary"
                        title="Clear filter"
                        startIcon={<Clear/>}
                        onClick={handleReset}
                        sx={{ height: '40px' }}  // Match height with text fields
                    >
                        Clear
                    </Button>
                </Grid2FilterBoxItemWrapper>
            </Grid2>
        </Stack>
    );
};

export default AllergenRestrictionsFilterBox;