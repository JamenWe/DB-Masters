import React, { FC, useCallback, useId } from 'react';
import { FormControl, FormHelperText, Input, InputLabel, InputProps as MuiInputProps, Slider, Stack } from '@mui/material';

export type SliderWithInputProps = {
    value?: number;
    onChange?: (value: number) => void;
    label?: string;
    disabled?: boolean;
    min?: number;
    max?: number;
    step?: number;
    fullWidth?: boolean;
    error?: boolean;
    helperText?: string;
    InputProps?: MuiInputProps;
};

/**
 * A slider with a numeric input field
 */
const SliderWithInput: FC<SliderWithInputProps> = (props) => {
    const { value = 0, onChange, label, disabled, min, max, step, fullWidth, error, helperText, InputProps } = props;

    const labelId = useId();

    const handleSliderChange = useCallback((event: Event, newValue: number | number[]) => {
        onChange?.(Array.isArray(newValue) ? newValue[0] : newValue);
    }, [onChange]);

    const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(Number(event.target.value));
    }, [onChange]);

    const handleBlur = useCallback(() => {
        onChange?.(Math.min(100, Math.max(0, value)));
    }, [onChange, value]);

    return (
        <FormControl fullWidth={fullWidth}>
            {label !== undefined ? (
                <InputLabel id={labelId}>
                    {label}
                </InputLabel>
            ) : null}

            <Stack direction="row" spacing={2} justifyContent="space-between">
                <Slider
                    value={value}
                    onChange={handleSliderChange}
                    min={min}
                    max={max}
                    step={step}
                    disabled={disabled}
                    aria-labelledby={labelId}
                />

                <Input
                    {...InputProps}
                    value={value}
                    size="small"
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    disabled={disabled}
                    aria-labelledby={labelId}
                    inputProps={{
                        step: { step },
                        min: { min },
                        max: { max },
                        type: 'number',
                    }}
                />
            </Stack>
            <FormHelperText error={error}>
                {helperText}
            </FormHelperText>
        </FormControl>
    );
};

export default SliderWithInput;
