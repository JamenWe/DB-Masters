import React, { FC, useCallback } from 'react';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';
import { DATE_FORMAT } from 'src/components/datetime/FormattedDate';
import moment, { Moment } from 'moment';
import { DateType, isDate } from 'src/api/common';

export type DatePickerProps = {
    date?: DateType;
    label?: string;
    onChange: (date?: DateType) => void;
    fullWidth?: boolean;
};

/**
 * A DatePicker component to be used for filtering by date
 */
const DatePicker: FC<DatePickerProps> = (props) => {
    const { date, label, onChange, fullWidth = false } = props;

    const handleChange = useCallback((newMoment: Moment | null): void => {
        if (!newMoment) {
            onChange(undefined);
            return;
        }

        const formatted = newMoment.format(DATE_FORMAT);
        if (isDate(formatted)) {
            onChange(formatted);
        }
    }, [onChange]);

    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <MuiDatePicker
                label={label}
                value={date ? moment(date) : null}
                format={DATE_FORMAT}
                onChange={handleChange}
                disableFuture={true}
                slotProps={{ textField: { size: 'small', fullWidth } }}
            />
        </LocalizationProvider>
    );
};

export default DatePicker;
