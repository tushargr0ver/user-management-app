import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Typography,
    Avatar,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Button,
    Box,
    Paper,
    Chip,
    Grid,
    Divider
} from '@mui/material';
import { 
    Email, 
    Phone, 
    Wc, 
    CheckCircle, 
    LocationOn, 
    ArrowBack,
    Person,
    Badge
} from '@mui/icons-material';

const UserDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`/api/users/${id}`);
                setUser(response.data.data);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        fetchUser();
    }, [id]);

    if (!user) {
        return <Typography>Loading...</Typography>;
    }

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
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: { xs: 'flex-start', sm: 'center' }, 
                    mb: 3,
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: { xs: 2, sm: 3 }
                }}>
                    <Button 
                        startIcon={<ArrowBack />} 
                        onClick={() => navigate('/')}
                        variant="outlined"
                    >
                        Back to List
                    </Button>
                    <Typography 
                        variant="h4" 
                        component="h1" 
                        sx={{ 
                            fontWeight: 'bold', 
                            color: 'primary.main',
                            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
                        }}
                    >
                        User Details
                    </Typography>
                </Box>
                
                <Divider sx={{ mb: 4 }} />
                
                <Grid container spacing={{ xs: 2, sm: 4 }}>
                    <Grid item xs={12} md={4}>
                        <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            textAlign: 'center',
                            p: { xs: 2, sm: 3 },
                            backgroundColor: '#fafafa',
                            borderRadius: 2
                        }}>
                            <Avatar 
                                src={user.profile ? `http://localhost:5000${user.profile}` : ''} 
                                sx={{ 
                                    width: { xs: 120, sm: 150 }, 
                                    height: { xs: 120, sm: 150 }, 
                                    mb: 2, 
                                    border: '4px solid', 
                                    borderColor: 'primary.light' 
                                }}
                            >
                                <Person sx={{ fontSize: { xs: 60, sm: 80 } }} />
                            </Avatar>
                            <Typography 
                                variant="h4" 
                                sx={{ 
                                    fontWeight: 'bold', 
                                    mb: 1,
                                    fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' }
                                }}
                            >
                                {`${user.firstName} ${user.lastName}`}
                            </Typography>
                            <Chip 
                                label={user.status} 
                                color={user.status === 'Active' ? 'success' : 'error'}
                                size={window.innerWidth < 600 ? 'medium' : 'large'}
                                sx={{ mb: 2 }}
                            />
                        </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={8}>
                        <Typography 
                            variant="h5" 
                            sx={{ 
                                mb: 3, 
                                fontWeight: 'bold', 
                                color: 'text.primary',
                                fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' }
                            }}
                        >
                            Personal Information
                        </Typography>
                        <List sx={{ 
                            '& .MuiListItem-root': { 
                                py: { xs: 1.5, sm: 2 }, 
                                borderBottom: '1px solid #f0f0f0',
                                flexDirection: { xs: 'column', sm: 'row' },
                                alignItems: { xs: 'flex-start', sm: 'center' }
                            } 
                        }}>
                            <ListItem>
                                <ListItemIcon sx={{ minWidth: { xs: 'auto', sm: 56 }, mr: { xs: 0, sm: 2 } }}>
                                    <Email color="primary" />
                                </ListItemIcon>
                                <ListItemText 
                                    primary="Email Address" 
                                    secondary={user.email}
                                    primaryTypographyProps={{ 
                                        fontWeight: 'medium',
                                        fontSize: { xs: '0.875rem', sm: '1rem' }
                                    }}
                                    secondaryTypographyProps={{ 
                                        fontSize: { xs: '1rem', sm: '1.1rem' }, 
                                        color: 'text.primary',
                                        wordBreak: 'break-all'
                                    }}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon sx={{ minWidth: { xs: 'auto', sm: 56 }, mr: { xs: 0, sm: 2 } }}>
                                    <Phone color="primary" />
                                </ListItemIcon>
                                <ListItemText 
                                    primary="Mobile Number" 
                                    secondary={user.mobile}
                                    primaryTypographyProps={{ 
                                        fontWeight: 'medium',
                                        fontSize: { xs: '0.875rem', sm: '1rem' }
                                    }}
                                    secondaryTypographyProps={{ 
                                        fontSize: { xs: '1rem', sm: '1.1rem' }, 
                                        color: 'text.primary' 
                                    }}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon sx={{ minWidth: { xs: 'auto', sm: 56 }, mr: { xs: 0, sm: 2 } }}>
                                    <Wc color="primary" />
                                </ListItemIcon>
                                <ListItemText 
                                    primary="Gender" 
                                    secondary={
                                        <Chip 
                                            label={user.gender} 
                                            size="small"
                                            color={user.gender === 'Male' ? 'primary' : 'secondary'}
                                            variant="outlined"
                                        />
                                    }
                                    primaryTypographyProps={{ 
                                        fontWeight: 'medium',
                                        fontSize: { xs: '0.875rem', sm: '1rem' }
                                    }}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon sx={{ minWidth: { xs: 'auto', sm: 56 }, mr: { xs: 0, sm: 2 } }}>
                                    <LocationOn color="primary" />
                                </ListItemIcon>
                                <ListItemText 
                                    primary="Location" 
                                    secondary={user.location}
                                    primaryTypographyProps={{ 
                                        fontWeight: 'medium',
                                        fontSize: { xs: '0.875rem', sm: '1rem' }
                                    }}
                                    secondaryTypographyProps={{ 
                                        fontSize: { xs: '1rem', sm: '1.1rem' }, 
                                        color: 'text.primary' 
                                    }}
                                />
                            </ListItem>
                        </List>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default UserDetails;
