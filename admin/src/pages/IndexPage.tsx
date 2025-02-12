import React, {FC} from 'react';
import {Box, Stack, Typography} from '@mui/material';

const IndexPage: FC = () => (
    <>
        <Box sx={{ mt: 15 }}>
            <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <img
                        src="src/images/AppLogo.png"
                        alt="Description of image"
                        style={{ maxWidth: '100%', height: 'auto'}}
                    />
                </Box>

                <Typography variant="h4" align="center" color="#6e4b62">
                    <strong>Kraut & Rüben Admin</strong>
                </Typography>
            </Stack>
        </Box>
    </>
);

export default IndexPage;