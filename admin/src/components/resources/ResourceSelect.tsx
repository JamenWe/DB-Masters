import * as React from 'react';
import { FC, SyntheticEvent, useCallback, useMemo } from 'react';
import { Autocomplete, Checkbox, TextField } from '@mui/material';
import { BasicResourceType, byMarketId, useResources } from 'src/api/resources';

const equalsResource = (resource: BasicResourceType, other: number | BasicResourceType): boolean => {
    return (typeof other === 'number' && resource.id === other) || (typeof other === 'object' && resource.id === other.id);
};

export type ResourceSelectProps = {
    gameId?: string;
    // array of resource IDs (number) or resources (BasicResourceType)
    value?: number[] | BasicResourceType[];
    onChange?: (value: BasicResourceType[]) => void;
    label?: string;
    size?: 'small' | 'medium';
    fullWidth?: boolean;
    disabled?: boolean;
    error?: boolean;
    helperText?: string;
};

/**
 * Renders an input to select one or more resources
 */
const ResourceSelect: FC<ResourceSelectProps> = (props) => {
    const { gameId, value, onChange, label, size, fullWidth, disabled, error, helperText } = props;

    const { data: resources } = useResources(gameId);

    const sortedResources = useMemo(() => {
        return (resources ?? []).sort(byMarketId);
    }, [resources]);

    const hint = useMemo(() => {
        if (!gameId) {
            return 'Please select a game first';
        }

        return undefined;
    }, [gameId]);

    const selectedResources = useMemo(() => {
        return (resources ?? [])
            .filter(resource => value?.some(selected => equalsResource(resource, selected)))
            .sort(byMarketId);
    }, [resources, value]);

    const handleChange = useCallback((event: SyntheticEvent, newValue: readonly BasicResourceType[]): void => {
        onChange?.(Array.from(newValue));
    }, [onChange]);

    return (
        <Autocomplete
            data-test-id="resource-select"
            multiple={true}
            options={sortedResources}
            disableCloseOnSelect={true}
            getOptionLabel={option => option.marketId.toUpperCase()}
            sx={{ minWidth: 300 }}
            value={selectedResources}
            onChange={handleChange}
            size={size}
            fullWidth={fullWidth}
            disabled={disabled || !gameId}
            renderOption={(optionProps, option, { selected }) => (
                <li {...optionProps}>
                    <Checkbox checked={selected} style={{ marginRight: 8 }}/>
                    {option.marketId.toUpperCase()}
                </li>
            )}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    error={error}
                    helperText={helperText ?? hint}
                />
            )}
        />
    );
};

export default ResourceSelect;
