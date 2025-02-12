import React, { FC, ReactElement } from 'react';
import moment from 'moment-timezone';
import { Typography } from '@mui/material';

export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const DATE_FORMAT = 'YYYY-MM-DD';
export const DEFAULT_FORMAT = DATETIME_FORMAT;

export type FormattedDateProps = {
    date: moment.MomentInput;
    format?: string;
};

/**
 * FormattedDate turns a date (or any other parseable date-parseable type) into a human-readable, formatted string.
 */
const FormattedDate: FC<FormattedDateProps> = (props): ReactElement => {
    const { date, format = DEFAULT_FORMAT } = props;

    const formatted = moment(date).format(format);

    return (
        <Typography fontSize="inherit">
            {formatted}
        </Typography>
    );
};

export default FormattedDate;
