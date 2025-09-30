import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, CircularProgress } from '@mui/material';

const HomePage = () => {
    const navigate = useNavigate();
    
    useEffect(() => {
        navigate('/');
    }, [navigate]);

    return (
        <Box sx={{ 
          maxWidth: 800, 
          margin: 'auto', 
          p: { xs: 1, sm: 2 },
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh'
        }}>
            <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, width: '100%', textAlign: 'center' }}>
                <CircularProgress sx={{ mb: 2 }} />
                <Typography variant="h5" component="h1" color="primary.main">
                    Redirecting to User List...
                </Typography>
            </Paper>
        </Box>
    );
};

export default HomePage;
