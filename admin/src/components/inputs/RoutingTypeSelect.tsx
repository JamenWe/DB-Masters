import * as React from 'react';
import { FC, SyntheticEvent, useCallback, useMemo } from 'react';
import { Autocomplete, Checkbox, TextField } from '@mui/material';
import { RoutingType } from 'src/api/routes';

type RoutingTypeOptionType = {
    label: string;
    value: RoutingType;
};

const ROUTING_TYPE_OPTIONS: RoutingTypeOptionType[] = [
    { label: 'Marketing', value: 'MARKETING' },
    { label: 'Organic', value: 'ORGANIC' },
];

export type RoutingTypeSelectProps = {
    value?: RoutingType[];
    label?: string;
    onChange?: (value: RoutingType[]) => void;
    size?: 'small' | 'medium';
    fullWidth?: boolean;
    disabled?: boolean;
    error?: boolean;
    helperText?: string;
};

/**
 * Renders an input to select one or more routing types
 */
const RoutingTypeSelect: FC<RoutingTypeSelectProps> = (props) => {
    const { value, label, onChange, size, fullWidth, disabled, error, helperText } = props;

    const selectedOptions = useMemo(() => {
        return ROUTING_TYPE_OPTIONS.filter(option => value?.includes(option.value));
    }, [value]);

    const handleChange = useCallback((event: SyntheticEvent, newValue: RoutingTypeOptionType[]): void => {
        onChange?.(newValue.map(option => option.value));
    }, [onChange]);

    return (
        <Autocomplete
            data-test-id="routing-type-select"
            multiple={true}
            options={ROUTING_TYPE_OPTIONS}
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

export default RoutingTypeSelect;
