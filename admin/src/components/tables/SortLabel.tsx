import * as React from 'react';
import { FC, useCallback } from 'react';
import { TableSortLabel } from '@mui/material';

export type SortableLabelProps = {
    sortDirection?: 'asc' | 'desc';
    onSortChange: (direction?: 'asc' | 'desc') => void;
    children?: React.ReactNode;
};

/**
 * Renders a label, which updates its sorting direction on click
 */
const SortLabel: FC<SortableLabelProps> = (props) => {
    const { sortDirection, onSortChange } = props;

    const handleClick = useCallback(() => {
        // sorted ascending, switch to descending
        if (sortDirection === 'asc') {
            onSortChange('desc');
            return;
        }

        // sorted descending: remove sorting
        if (sortDirection === 'desc') {
            onSortChange(undefined);
            return;
        }

        // not sorted yet: sort ascending
        onSortChange('asc');
    }, [onSortChange, sortDirection]);

    return (
        <TableSortLabel
            active={sortDirection !== undefined}
            direction={sortDirection}
            onClick={handleClick}
        >
            {props.children}
        </TableSortLabel>
    );
};

export default SortLabel;
