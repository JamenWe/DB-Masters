import * as React from 'react';
import { FC, SyntheticEvent, useCallback, useMemo } from 'react';
import { Autocomplete, Checkbox, TextField } from '@mui/material';
import { DeviceType } from 'src/api/devices';

type DeviceOptionType = {
    label: string;
    value: DeviceType;
};

const DEVICE_OPTIONS: DeviceOptionType[] = [
    { label: 'Desktop', value: 'DESKTOP' },
    { label: 'Mobile', value: 'MOBILE' },
];

export type DeviceSelectProps = {
    value?: DeviceType[];
    label?: string;
    onChange?: (value: DeviceType[]) => void;
    size?: 'small' | 'medium';
    fullWidth?: boolean;
    disabled?: boolean;
    error?: boolean;
    helperText?: string;
};

/**
 * Renders an input to select one or more device types
 */
const DeviceSelect: FC<DeviceSelectProps> = (props) => {
    const { value, label, onChange, size, fullWidth, disabled, error, helperText } = props;

    const selectedOptions = useMemo(() => {
        return DEVICE_OPTIONS.filter(option => value?.includes(option.value));
    }, [value]);

    const handleChange = useCallback((event: SyntheticEvent, newValue: readonly DeviceOptionType[]): void => {
        onChange?.(newValue.map(option => option.value));
    }, [onChange]);

    return (
        <Autocomplete
            data-test-id="device-select"
            multiple={true}
            options={DEVICE_OPTIONS}
            disableCloseOnSelect={true}
            getOptionLabel={(option) => option.label}
            sx={{ minWidth: 300 }}
            value={selectedOptions}
            onChange={handleChange}
            size={size}
            fullWidth={fullWidth}
            disabled={disabled}
            renderOption={(optionProps, option, { selected }) => (
                <li {...optionProps}>
                    <Checkbox checked={selected} style={{ marginRight: 8 }}/>
                    {option.label}
                </li>
            )}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    error={error}
                    helperText={helperText}
                />
            )}
        />
    );
};

export default DeviceSelect;
