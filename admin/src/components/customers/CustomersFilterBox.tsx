import * as React from 'react';
import {FC, useCallback} from 'react';
import {Button, Stack, TextField} from '@mui/material';
import {Clear} from '@mui/icons-material';
import {CustomerFilterType} from 'src/api/customers';
import Grid2 from '@mui/material/Grid2';
import Grid2FilterBoxItemWrapper from 'src/components/wrappers/Grid2FilterBoxItemWrapper';
import {DatePicker} from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import {hideNumberInputArrows} from "src/util/styles";

export type CustomersFilterBoxProps = {
    filter?: CustomerFilterType;
    fixedFilterKeys?: (keyof CustomerFilterType)[];
    onChange?: (filter: CustomerFilterType) => void;
    onClear?: () => void;
};

/**
 * A component to provide inputs to filter customers by.
 */
const CustomersFilterBox: FC<CustomersFilterBoxProps> = (props) => {
    const { filter, fixedFilterKeys, onChange, onClear } = props;

    const handleIdChange = useCallback((id?: string): void => {
        onChange?.({ ...filter, id: id ? parseInt(id) : undefined });
    }, [filter, onChange]);

    const handleLastNameChange = useCallback((lastName?: string): void => {
        onChange?.({ ...filter, lastName: lastName || undefined });
    }, [filter, onChange]);

    const handleFirstNameChange = useCallback((firstName?: string): void => {
        onChange?.({ ...filter, firstName: firstName || undefined });
    }, [filter, onChange]);

    const handleDateOfBirthChange = useCallback((date: string | null): void => {
        onChange?.({ ...filter, dateOfBirth: date || undefined });
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
                        label="Last Name"
                        value={filter?.lastName ?? ''}
                        onChange={(event) => handleLastNameChange(event.target.value)}
                        fullWidth
                        disabled={fixedFilterKeys?.includes('lastName')}
                    />
                </Grid2FilterBoxItemWrapper>

                <Grid2FilterBoxItemWrapper>
                    <TextField
                        size="small"
                        label="First Name"
                        value={filter?.firstName ?? ''}
                        onChange={(event) => handleFirstNameChange(event.target.value)}
                        fullWidth
                        disabled={fixedFilterKeys?.includes('firstName')}
                    />
                </Grid2FilterBoxItemWrapper>

                <Grid2FilterBoxItemWrapper>
                    <DatePicker
                        label="Date of Birth"
                        value={filter?.dateOfBirth ? dayjs(filter.dateOfBirth) : null}
                        onChange={(newValue) => handleDateOfBirthChange(newValue?.format('YYYY-MM-DD') ?? null)}
                        slotProps={{
                            textField: {
                                size: 'small',
                                fullWidth: true,
                            }
                        }}
                        disabled={fixedFilterKeys?.includes('dateOfBirth')}
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

export default CustomersFilterBox;