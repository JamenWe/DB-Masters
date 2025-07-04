import * as React from 'react';
import {FC} from 'react';
import {Grid2Props} from '@mui/material';
import Grid2 from '@mui/material/Grid2';

/**
 * Wraps a Grid2 component and provides some default props for use in filter boxes
 * when nesting inside a Grid2 container component
 */
const Grid2FilterBoxItemWrapper: FC<Grid2Props> = ({ children, sx, ...rest }) => {
    return (
        <Grid2
            sx={{
                flex: 1,
                ...sx
            }}
            gridColumn={{
                xs: 'span 12',
                sm: 'span 12',
                lg: 'span 6',
                xl: 'span 3'
            }}
            {...rest}
        >
            {children}
        </Grid2>
    );
};

export default Grid2FilterBoxItemWrapper;