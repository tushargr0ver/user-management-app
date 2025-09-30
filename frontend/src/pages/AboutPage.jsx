import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

const AboutPage = () => {
    return (
        <Box sx={{ 
          maxWidth: 800, 
          margin: 'auto', 
          p: { xs: 1, sm: 2 },
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          minHeight: '80vh'
        }}>
            <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, width: '100%' }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', color: 'primary.main' }}>
                    About Page
                </Typography>
                <Typography variant="body1" sx={{ textAlign: 'center', mt: 2 }}>
                    User Management System - A comprehensive solution for managing users.
                </Typography>
            </Paper>
        </Box>
    );
};

export default AboutPage;
