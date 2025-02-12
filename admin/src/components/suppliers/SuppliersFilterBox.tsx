import {FC, useCallback} from 'react';
import {Button, TextField} from '@mui/material';
import {Clear} from '@mui/icons-material';
import {SupplierFilterType} from 'src/api/suppliers';
import Grid2 from '@mui/material/Grid2';
import Grid2FilterBoxItemWrapper from 'src/components/wrappers/Grid2FilterBoxItemWrapper';
import {Stack} from '@mui/system';
import {hideNumberInputArrows} from "src/util/styles";

export type SuppliersFilterBoxProps = {
    filter?: SupplierFilterType;
    fixedFilterKeys?: (keyof SupplierFilterType)[];
    onChange?: (filter: SupplierFilterType) => void;
    onClear?: () => void;
};

const SuppliersFilterBox: FC<SuppliersFilterBoxProps> = (props) => {
    const { filter, fixedFilterKeys, onChange, onClear } = props;

    const handleIdChange = useCallback((id?: string): void => {
        onChange?.({ ...filter, id: id ? parseInt(id) : undefined });
    }, [filter, onChange]);

    const handleNameChange = useCallback((name?: string): void => {
        onChange?.({ ...filter, name: name || undefined });
    }, [filter, onChange]);

    const handleStreetChange = useCallback((street?: string): void => {
        onChange?.({ ...filter, street: street || undefined });
    }, [filter, onChange]);

    const handleHouseNumberChange = useCallback((houseNumber?: string): void => {
        onChange?.({ ...filter, houseNumber: houseNumber || undefined });
    }, [filter, onChange]);

    const handleZipCodeChange = useCallback((zipCode?: string): void => {
        onChange?.({ ...filter, zipCode: zipCode || undefined });
    }, [filter, onChange]);

    const handleCityChange = useCallback((city?: string): void => {
        onChange?.({ ...filter, city: city || undefined });
    }, [filter, onChange]);

    const handlePhoneChange = useCallback((phone?: string): void => {
        onChange?.({ ...filter, phone: phone || undefined });
    }, [filter, onChange]);

    const handleEmailChange = useCallback((email?: string): void => {
        onChange?.({ ...filter, email: email || undefined });
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
                        label="Phone"
                        value={filter?.phone ?? ''}
                        onChange={(event) => handlePhoneChange(event.target.value)}
                        fullWidth
                        disabled={fixedFilterKeys?.includes('phone')}
                    />
                </Grid2FilterBoxItemWrapper>

                <Grid2FilterBoxItemWrapper>
                    <TextField
                        size="small"
                        label="Email"
                        value={filter?.email ?? ''}
                        onChange={(event) => handleEmailChange(event.target.value)}
                        fullWidth
                        disabled={fixedFilterKeys?.includes('email')}
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
                        label="Street"
                        value={filter?.street ?? ''}
                        onChange={(event) => handleStreetChange(event.target.value)}
                        fullWidth
                        disabled={fixedFilterKeys?.includes('street')}
                    />
                </Grid2FilterBoxItemWrapper>

                <Grid2FilterBoxItemWrapper>
                    <TextField
                        size="small"
                        label="House Number"
                        value={filter?.houseNumber ?? ''}
                        onChange={(event) => handleHouseNumberChange(event.target.value)}
                        fullWidth
                        disabled={fixedFilterKeys?.includes('houseNumber')}
                    />
                </Grid2FilterBoxItemWrapper>

                <Grid2FilterBoxItemWrapper>
                    <TextField
                        size="small"
                        label="ZIP Code"
                        value={filter?.zipCode ?? ''}
                        onChange={(event) => handleZipCodeChange(event.target.value)}
                        fullWidth
                        disabled={fixedFilterKeys?.includes('zipCode')}
                    />
                </Grid2FilterBoxItemWrapper>

                <Grid2FilterBoxItemWrapper>
                    <TextField
                        size="small"
                        label="City"
                        value={filter?.city ?? ''}
                        onChange={(event) => handleCityChange(event.target.value)}
                        fullWidth
                        disabled={fixedFilterKeys?.includes('city')}
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

export default SuppliersFilterBox;