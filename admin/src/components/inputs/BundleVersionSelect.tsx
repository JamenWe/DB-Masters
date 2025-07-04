import * as React from 'react';
import { FC, MouseEvent, useCallback, useId, useState } from 'react';
import { Chip, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';
import { BasicBundleVersionType, BundleVersionSearchFilterType, useBundleVersion } from 'src/api/bundles';
import ColorizeIcon from '@mui/icons-material/Colorize';
import BundleVersionSelectDialog from 'src/components/bundles/BundleVersionSelectDialog';

export type BundleVersionSelectProps = {
    value?: BasicBundleVersionType;
    onChange?: (value?: BasicBundleVersionType) => void;
    filter?: BundleVersionSearchFilterType;
    label?: string;
    size?: 'small' | 'medium';
    fullWidth?: boolean;
    disabled?: boolean;
    error?: boolean;
    helperText?: string;
};

/**
 * An input for selecting a bundle version. It will open a selection dialog, when clicking on it.
 */
const BundleVersionSelect: FC<BundleVersionSelectProps> = (props) => {
    const { value, onChange, filter, label = 'Bundle Version', size, fullWidth, disabled, error, helperText } = props;

    const inputId = useId();
    const labelSize = (size === 'small') ? 'small' : 'normal';
    const { data: bundleVersion } = useBundleVersion(value?.id);

    const [open, setOpen] = useState(false);

    const handleOpen = useCallback(() => {
        setOpen(!disabled);
    }, [disabled]);

    const handleClose = useCallback(() => {
        setOpen(false);
    }, []);

    const handleChange = useCallback((newBundleVersion: BasicBundleVersionType) => {
        onChange?.(newBundleVersion);
    }, [onChange]);

    const handleRemove = useCallback(() => {
        onChange?.(undefined);
    }, [onChange]);

    const handleInputClick = useCallback((event: MouseEvent<HTMLInputElement>) => {
        event.preventDefault();
        setOpen(true);
    }, []);

    return (
        <>
            <FormControl
                data-test-id={'bundle-version-select'}
                variant="outlined"
                onClick={handleOpen}
                fullWidth={fullWidth}
            >
                <InputLabel
                    error={error}
                    htmlFor={inputId}
                    size={labelSize}
                >
                    {label}
                </InputLabel>
                <OutlinedInput
                    id={inputId}
                    type="text"
                    size={size}
                    label={label}
                    disabled={true}
                    error={error}
                    onClick={disabled ? undefined : handleInputClick}
                    inputProps={{ style: { cursor: 'pointer' } }}
                    startAdornment={
                        bundleVersion ? (
                            <InputAdornment position="start">
                                <Chip
                                    label={bundleVersion.marketingBundleVersionId}
                                    size={size}
                                    onDelete={handleRemove}
                                    disabled={disabled}
                                />
                            </InputAdornment>
                        ) : null
                    }
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton onClick={handleOpen} size="small" disabled={disabled}>
                                <ColorizeIcon/>
                            </IconButton>
                        </InputAdornment>
                    }
                />
                <FormHelperText error={error}>
                    {helperText}
                </FormHelperText>
            </FormControl>
            <BundleVersionSelectDialog
                open={open}
                selected={bundleVersion}
                filter={filter}
                onChange={handleChange}
                onClose={handleClose}
            />
        </>
    );
};

export default BundleVersionSelect;
