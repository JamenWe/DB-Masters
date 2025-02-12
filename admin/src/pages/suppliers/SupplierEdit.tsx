import {ChangeEvent, FC, useCallback, useMemo} from 'react';
import {Box, Breadcrumbs, Link, Paper, Stack, TextField, Typography,} from '@mui/material';
import {Link as RouterLink} from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {SupplierType, useSupplierUpdate} from 'src/api/suppliers';
import Grid2 from '@mui/material/Grid2';
import SaveIcon from '@mui/icons-material/Save';
import useObjectMerge from 'src/hooks/useObjectMerge';
import MultiActionButton from 'src/components/buttons/MultiActionButton';
import {useNotification} from 'src/components/notifications/NotificationContextProvider';
import {extractErrorMessage} from 'src/api/common';

export type SupplierEditProps = {
    supplier: SupplierType;
};

const SupplierEdit: FC<SupplierEditProps> = (props) => {
    const { supplier } = props;
    const [tempSupplier, updateTempSupplier] = useObjectMerge(supplier);

    const { dispatchShowNotification } = useNotification();

    const { mutate: saveSupplier, isPending: isSaving } = useSupplierUpdate(
        (savedSupplier) => dispatchShowNotification('success', `Successfully updated supplier #${savedSupplier.id}`),
        (error) => dispatchShowNotification('error', extractErrorMessage(error)),
    );

    const handleSave = useCallback(() => {
        saveSupplier(tempSupplier);
    }, [saveSupplier, tempSupplier]);

    const emailErrorText = useMemo(() => {
        if (tempSupplier.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tempSupplier.email)) {
            return 'Invalid email format';
        }
        return undefined;
    }, [tempSupplier.email]);

    const zipCodeErrorText = useMemo(() => {
        if (tempSupplier.zipCode && !/^\d{5}$/.test(tempSupplier.zipCode)) {
            return 'ZIP code must be 5 digits';
        }
        return undefined;
    }, [tempSupplier.zipCode]);

    const isValid = !emailErrorText && !zipCodeErrorText;

    return (
        <>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small"/>}>
                <Link underline="hover" component={RouterLink} to="/">
                    Home
                </Link>
                <Link underline="hover" component={RouterLink} to="/suppliers">
                    Suppliers
                </Link>
                <Typography color="text.primary">
                    #{supplier.id} - {supplier.name}
                </Typography>
            </Breadcrumbs>

            <Box sx={{ mt: 2 }}>
                <Stack spacing={2}>
                    <Typography variant="h4">
                        Edit Supplier #{supplier.id} - {supplier.name}
                    </Typography>

                    <Paper elevation={0} sx={{ p: 3 }}>
                        <Stack spacing={3}>

                            {/* First Row */}
                            <Grid2 container spacing={3}>
                                <Grid2 flex={1}>
                                    <TextField
                                        label="Street"
                                        fullWidth
                                        value={tempSupplier.street || ''}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                            updateTempSupplier({ street: e.target.value })}
                                    />
                                </Grid2>

                                <Grid2 flex={1}>
                                    <TextField
                                        label="House Number"
                                        fullWidth
                                        value={tempSupplier.houseNumber || ''}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                            updateTempSupplier({ houseNumber: e.target.value })}
                                    />
                                </Grid2>

                                <Grid2 flex={1}>
                                    <TextField
                                        label="ZIP Code"
                                        fullWidth
                                        value={tempSupplier.zipCode || ''}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                            updateTempSupplier({ zipCode: e.target.value })}
                                        error={!!zipCodeErrorText}
                                        helperText={zipCodeErrorText}
                                    />
                                </Grid2>

                                <Grid2 flex={1}>
                                    <TextField
                                        label="City"
                                        fullWidth
                                        value={tempSupplier.city || ''}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                            updateTempSupplier({ city: e.target.value })}
                                    />
                                </Grid2>
                            </Grid2>

                            {/* Second Row */}
                            <Grid2 container spacing={3}>
                                <Grid2 flex={1}>
                                    <TextField
                                        label="Phone"
                                        fullWidth
                                        value={tempSupplier.phone || ''}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                            updateTempSupplier({ phone: e.target.value })}
                                    />
                                </Grid2>

                                <Grid2 flex={1}>
                                    <TextField
                                        label="Email"
                                        fullWidth
                                        value={tempSupplier.email || ''}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                            updateTempSupplier({ email: e.target.value })}
                                        error={!!emailErrorText}
                                        helperText={emailErrorText}
                                    />
                                </Grid2>
                            </Grid2>

                            {/* Save Button */}
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <MultiActionButton
                                    size="small"
                                    startIcon={<SaveIcon/>}
                                    title="Save changes"
                                    color="primary"
                                    variant="contained"
                                    disabled={!isValid || isSaving}
                                    onClick={handleSave}
                                >
                                    Save Supplier
                                </MultiActionButton>
                            </Box>
                        </Stack>
                    </Paper>
                </Stack>
            </Box>
        </>
    );
};

export default SupplierEdit;