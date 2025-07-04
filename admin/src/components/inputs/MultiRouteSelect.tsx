import * as React from 'react';
import { FC, MouseEvent, useCallback, useId, useState } from 'react';
import { Chip, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';
import ColorizeIcon from '@mui/icons-material/Colorize';
import { BasicRouteType, RouteFilterSearchType } from 'src/api/routes';
import MultiRouteSelectDialog from 'src/components/routes/MultiRouteSelectDialog';

export type MultiRouteSelectProps = {
    values?: BasicRouteType[];
    onChange?: (values?: BasicRouteType[]) => void;
    filter?: RouteFilterSearchType;
    label?: string;
    size?: 'small' | 'medium';
    fullWidth?: boolean;
    disabled?: boolean;
    error?: boolean;
    helperText?: string[];
};

/**
 * An input for selecting multiple routes. It will open a selection dialog, when clicking on it.
 */
const MultiRouteSelect: FC<MultiRouteSelectProps> = (props) => {
    const { values: routes, onChange, filter, label = '', size, fullWidth, disabled, error, helperText } = props;

    const inputId = useId();
    const labelSize = (size === 'small') ? 'small' : 'normal';

    const [open, setOpen] = useState(false);

    const handleOpen = useCallback(() => {
        setOpen(!disabled);
    }, [disabled]);

    const handleClose = useCallback(() => {
        setOpen(false);
    }, []);

    const handleChange = useCallback((newRoutes: BasicRouteType[]) => {
        onChange?.(newRoutes);
    }, [onChange]);

    const handleRemove = useCallback((id: number) => {
        const newRoutes: BasicRouteType[] | undefined = routes?.filter(route => route.id !== id);
        onChange?.(newRoutes);
    }, [onChange, routes]);

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
                        routes ? routes.map(route => (
                            <InputAdornment position="start" key={route.id}>
                                <Chip
                                    label={`#${route.id} - ${route.name || 'unnamed'}`}
                                    size={size}
                                    onDelete={() => handleRemove(route.id)}
                                    disabled={disabled}
                                />
                            </InputAdornment>
                        )) : null
                    }
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton onClick={handleOpen} size="small" disabled={disabled}>
                                <ColorizeIcon/>
                            </IconButton>
                        </InputAdornment>
                    }
                />
                {helperText?.map((entry) => (
                    <FormHelperText error={error} key={entry}>
                        {entry}
                    </FormHelperText>
                ))}

            </FormControl>
            <MultiRouteSelectDialog
                open={open}
                selected={routes}
                filter={filter}
                onChange={handleChange}
                onClose={handleClose}
            />
        </>
    );
};

export default MultiRouteSelect;
