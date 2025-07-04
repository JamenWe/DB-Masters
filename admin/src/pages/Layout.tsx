import React, {FC} from 'react';
import AppHeader from 'src/components/app/AppHeader';
import AppNavigation from 'src/components/app/AppNavigation';
import {Box} from '@mui/material';
import {Outlet} from 'react-router';
import {useNotification} from 'src/components/notifications/NotificationContextProvider';
import NotificationWrapper from 'src/components/notifications/NotificationWrapper';
import KurTitleWrapper from 'src/components/wrappers/KurTitleWrapper';

const VERSION = import.meta.env.VITE_VERSION;

/**
 * The base layout for the page. Child routes will be rendered in the <Outlet/>
 */
const Layout: FC = () => {
    const { notification, dispatchClearNotification } = useNotification();

    return (
        <>
            <AppHeader/>
            <AppNavigation version={VERSION}/>
            <KurTitleWrapper title={''}/>
            <Box
                component="main"
                sx={{
                    backgroundColor: (t) =>
                        t.palette.mode === 'light'
                            ? t.palette.grey[100]
                            : t.palette.grey[900],
                    flexGrow: 1,
                    ml: 'var(--app-navigation-width)',
                    height: '100vh',
                    overflow: 'auto',
                }}
            >
                <Box sx={{ m: 4 }}>
                    <Outlet/>
                    {notification && (
                        <NotificationWrapper
                            message={notification.message}
                            severity={notification.severity}
                            onClose={() => dispatchClearNotification()}
                        />
                    )}
                </Box>
            </Box>
        </>
    );
};

export default Layout;