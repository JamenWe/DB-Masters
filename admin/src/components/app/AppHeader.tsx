import React, {FC} from 'react';
import {styled} from '@mui/system';
import {GlobalStyles, Stack, Toolbar, Typography} from '@mui/material';

const Header = styled('header')(({ theme }) => ({
    top: 0,
    position: 'sticky',
    padding: theme.spacing(1, 2),
    backgroundColor: theme.palette.background.default,
    zIndex: 999,
}));

const HEIGHT = 54;

/**
 * Global app header
 */
const AppHeader: FC = () => {

    return (
        <Header data-test-id="app-header">
            <GlobalStyles
                styles={{
                    ':root': {
                        '--app-header-height': `${HEIGHT}px`,
                    },
                    body: {
                        scrollPaddingTop: 'var(--app-header-height)',
                    },
                }}
            />
            <Toolbar variant="dense" disableGutters={true} sx={{ ml: 'var(--app-navigation-width)', height: 'var(--app-header-height)' }}>
                <Stack
                    width="100%"
                    direction="row"
                    justifyContent="flex-start"
                    spacing={1}
                >
                    <Typography fontSize="32px">
                        <strong>Kraut & Rüben</strong>
                    </Typography>
                </Stack>

                <Stack
                    width="100%"
                    direction="row"
                    justifyContent="flex-end"
                    spacing={1}
                >
                    <Typography data-test-id="app-username" fontSize="small">
                        logged in as <strong>Super.Admin</strong>
                    </Typography>
                </Stack>
            </Toolbar>
        </Header>
    );
};

export default AppHeader;