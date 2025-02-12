import React, {FC} from 'react';
import {Box, Stack, Typography} from '@mui/material';
import KurTitleWrapper from 'src/components/wrappers/KurTitleWrapper';

export type ErrorPageProps = {
    code: number,
    message: string,
};

const ErrorPage: FC<ErrorPageProps> = (props) => {
    const { code, message } = props;

    return (
        <>
            <KurTitleWrapper title={'Page Not Found'}/>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 'calc(100vh - var(--app-header-height))',
                }}
            >
                <Stack alignItems="center" justifyContent="center">
                    <Typography variant="h1" color="error">
                        {code}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {message}
                    </Typography>
                </Stack>
            </Box>
        </>
    );
};

export default ErrorPage;

export const NotFound: FC = () => <ErrorPage code={404} message="The requested page does not exist"/>;