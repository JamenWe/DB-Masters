import * as React from 'react';
import { FC, MouseEvent, useCallback, useId, useState } from 'react';
import { Chip, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';
import ColorizeIcon from '@mui/icons-material/Colorize';
import { BasicRouteType, RouteFilterSearchType } from 'src/api/routes';
import RouteSelectDialog from 'src/components/routes/RouteSelectDialog';

export type RouteSelectProps = {
    value?: BasicRouteType;
    onChange?: (value?: BasicRouteType) => void;
    filter?: RouteFilterSearchType;
    label?: string;
    size?: 'small' | 'medium';
    fullWidth?: boolean;
    disabled?: boolean;
    error?: boolean;
    helperText?: string;
};

/**
 * An input for selecting a route. It will open a selection dialog, when clicking on it.
 */
const RouteSelect: FC<RouteSelectProps> = (props) => {
    const { value: route, onChange, filter, label = 'Route', size, fullWidth, disabled, error, helperText } = props;

    const inputId = useId();
    const labelSize = (size === 'small') ? 'small' : 'normal';

    const [open, setOpen] = useState(false);

    const handleOpen = useCallback(() => {
        setOpen(!disabled);
    }, [disabled]);

    const handleClose = useCallback(() => {
        setOpen(false);
    }, []);

    const handleChange = useCallback((newRoute: BasicRouteType) => {
        onChange?.(newRoute);
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
                data-test-id={'route-select'}
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
                        route ? (
                            <InputAdornment position="start">
                                <Chip
                                    label={`#${route.id} - ${route.name}`}
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
            <RouteSelectDialog
                open={open}
                selected={route}
                filter={filter}
                onChange={handleChange}
                onClose={handleClose}
            />
        </>
    );
};

export default RouteSelect;
