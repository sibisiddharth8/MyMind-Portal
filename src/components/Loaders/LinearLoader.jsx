import * as React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import styled from 'styled-components';

const StyledBox = styled(Box)`
    border-radius: 10px;
    width: 100%;
    padding-top: 20px;
`;

const LoadingText = styled.div`
    display: flex;
    justify-content: center;
    padding: 10px;
    letter-spacing: 8px;
    white-space: nowrap;

    @media (max-width: 575px){
        letter-spacing: 4px;
    }
`;

export default function LinearLoader({text}) {
  return (
    <StyledBox>
      <LoadingText>{text || "... Loading ..."}</LoadingText>
      <LinearProgress 
        sx={{ 
          backgroundColor: '#e0e0e0',
          '& .MuiLinearProgress-bar': {
            backgroundColor: '#854CE6',
          },
        }} 
      />
    </StyledBox>
  );
}
