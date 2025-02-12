import React, {FC} from 'react';
import {
    Box,
    Divider,
    Drawer,
    GlobalStyles,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack,
    Toolbar,
    Typography,
    useTheme,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import SickIcon from '@mui/icons-material/Sick';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import DescriptionIcon from '@mui/icons-material/Description';
import SpaIcon from '@mui/icons-material/Spa';
import EggIcon from '@mui/icons-material/Egg';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import {useColorMode} from 'src/theme/ColorModeContext';
import {Link, useLocation} from 'react-router-dom';
import AppLogo from "../icons/AppLogo";

const WIDTH = 240;

type AppNavigationProps = {
    version?: string,
};

const AppNavigation: FC<AppNavigationProps> = (props) => {
    const { version = '1.0' } = props;
    const { pathname } = useLocation();
    const theme = useTheme();
    const { toggleColorMode } = useColorMode();

    return (
        <>
            <GlobalStyles
                styles={{
                    ':root': {
                        '--app-navigation-width': `${WIDTH}px`,
                    },
                }}
            />
            <Drawer data-test-id="app-navigation" variant="permanent" open={true}>
                {/* top corner with logo */}
                <Toolbar
                    variant="dense"
                    disableGutters={true}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        width: 'var(--app-navigation-width)',
                        p: 1,
                    }}
            >
                    <AppLogo/>

                    <Stack sx={{ mx: 2 }}>
                        <Typography fontSize="small" fontWeight="bold">Admin Tool</Typography>
                        <Typography fontSize="small" color="text.secondary">V{version}</Typography>
                    </Stack>
                </Toolbar>

                <Divider />

                {/* actual navigation */}
                <List component="nav">
                    <ListItemButton
                        component={Link}
                        to="/customers"
                        divider={true}
                        selected={pathname.startsWith('/customers')}
                    >
                        <ListItemIcon>
                            <PeopleIcon />
                        </ListItemIcon>
                        <ListItemText primary="Customers" />
                    </ListItemButton>

                    <ListItemButton
                        component={Link}
                        to="/suppliers"
                        divider={true}
                        selected={pathname.startsWith('/suppliers')}
                    >
                        <ListItemIcon>
                            <AgricultureIcon />
                        </ListItemIcon>
                        <ListItemText primary="Suppliers" />
                    </ListItemButton>

                    <ListItemButton
                        component={Link}
                        to="/ingredients"
                        divider={true}
                        selected={pathname.startsWith('/ingredients')}
                    >
                        <ListItemIcon>
                            <EggIcon />
                        </ListItemIcon>
                        <ListItemText primary="Ingredients" />
                    </ListItemButton>

                    <ListItemButton
                        component={Link}
                        to="/recipes"
                        divider={true}
                        selected={pathname.startsWith('/recipes')}
                    >
                        <ListItemIcon>
                            <DescriptionIcon />
                        </ListItemIcon>
                        <ListItemText primary="Recipes" />
                    </ListItemButton>

                    <ListItemButton
                        component={Link}
                        to="/orders"
                        divider={true}
                        selected={pathname.startsWith('/orders')}
                    >
                        <ListItemIcon>
                            <ReceiptLongIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Orders"/>
                    </ListItemButton>

                    <ListItemButton
                        component={Link}
                        to="/nutrition"
                        divider={true}
                        selected={pathname.startsWith('/nutrition')}
                    >
                        <ListItemIcon>
                            <SpaIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Nutrition"/>
                    </ListItemButton>

                    <ListItemButton
                        component={Link}
                        to="/allergies"
                        divider={true}
                        selected={pathname.startsWith('/allergies')}
                    >
                        <ListItemIcon>
                            <SickIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Allergies"/>
                    </ListItemButton>
                </List>

                <Box
                    sx={{
                        p: 2,
                        mt: 'auto',
                        display: 'flex',
                        justifyContent: 'start'
                    }}
                >
                    <IconButton
                        onClick={toggleColorMode}
                        size="small"
                        sx={{
                            border: 1,
                            borderColor: 'divider',
                            borderRadius: 2,
                            p: 1,
                        }}
                    >
                        {theme.palette.mode === 'dark' ? (
                            <Brightness7Icon fontSize="small" />
                        ) : (
                            <Brightness4Icon fontSize="small" />
                        )}
                    </IconButton>
                </Box>
            </Drawer>
        </>
    );
};

export default AppNavigation;