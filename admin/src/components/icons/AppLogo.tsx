import React from 'react';
import {styled} from '@mui/material/styles';
import logo from 'src/images/AppLogo.png';

const StyledImg = styled('img')(({ theme }) => ({
    width: '100px',
    height: 'auto',
}));

const Logo = () => (
    <StyledImg src={logo} alt="Logo" />
);

export default Logo;