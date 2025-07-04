import { Chip, ClickAwayListener, Stack, TextField, Tooltip } from '@mui/material';
import * as React from 'react';
import { ChangeEvent, KeyboardEvent, FC, useCallback, useState } from 'react';
import HelpIcon from '@mui/icons-material/Help';

export type ChipsInputProps = {
    value?: string[];
    onChange?: (value: string[]) => void;
    label: string;
    size?: 'small' | 'medium';
    fullWidth?: boolean;
    disabled?: boolean;
    helpText?: string
};

/**
 * The ChipsInput renders a TextField that allows the input of multiple values, displayed as chips.
 */
const ChipsInput: FC<ChipsInputProps> = (props) => {
    const { value = [], onChange, label, size, fullWidth, disabled, helpText } = props;

    const [currentValue, setCurrentValue] = useState<string>('');

    const handleDelete = useCallback((removedValue: string): void => {
        onChange?.(value.filter(item => item !== removedValue));
    }, [onChange, value]);

    const handleKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>): void => {
        // backspace on empty input deletes last value, if any
        if (event.key === 'Backspace' && currentValue === '' && value.length > 0) {
            event.preventDefault();
            onChange?.(value.slice(0, -1));
        }

        // enter or comma or space will add the current input value
        if (event.key === 'Enter' || event.key === ',' || event.key === ' ') {
            event.preventDefault();

            if (currentValue != '' && !value?.includes(currentValue)) {
                onChange?.([...(value ?? []), currentValue]);
                setCurrentValue('');
            }
        }
    }, [currentValue, onChange, value]);

    const handleClickAway = useCallback((): void => {
        if (currentValue != '' && !value?.includes(currentValue)) {
            onChange?.([...(value ?? []), currentValue]);
            setCurrentValue('');
        }
    }, [currentValue, onChange, value]);

    const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setCurrentValue(event.target.value.trim());
    }, []);

    return (
        <ClickAwayListener
            onClickAway={handleClickAway}
            mouseEvent={'onPointerDown'}
        >
            <TextField
                data-test-id={`chips-input-${label}`}
                value={currentValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                label={label}
                size={size}
                sx={{ minWidth: 250 }}
                fullWidth={fullWidth}
                disabled={disabled}
                InputProps={{
                    startAdornment: (
                        value.length > 0 ? (
                            <Stack direction="row" spacing={1}>
                                {value?.map(singleValue => (
                                    <Chip
                                        key={singleValue}
                                        size={size}
                                        label={singleValue}
                                        onDelete={() => disabled ? undefined : handleDelete(singleValue)}
                                        disabled={disabled}
                                    />
                                ))}
                            </Stack>
                        ) : null
                    ),
                    endAdornment: helpText && (
                        <Tooltip
                            title={helpText}
                            arrow={true}
                        >
                            <HelpIcon color='primary' sx={{ cursor: 'help' }} />
                        </Tooltip>
                    ),
                }}
            />
        </ClickAwayListener>
    );
};

export default ChipsInput;
