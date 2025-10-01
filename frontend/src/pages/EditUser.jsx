import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
    Typography,
    Grid,
    TextField,
    Button,
    Avatar,
    RadioGroup,
    FormControlLabel,
    Radio,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box,
    Paper,
    Divider
} from '@mui/material';
import { styled } from '@mui/system';
import { ArrowBack, CloudUpload, Person } from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';

const Input = styled('input')({
    display: 'none',
});

const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    mobile: Yup.string().matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits').required('Mobile is required'),
    gender: Yup.string().required('Gender is required'),
    status: Yup.string().required('Status is required'),
    location: Yup.string().required('Location is required'),
});

const EditUser = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`/api/users/${id}`);
                setUser(response.data.data);
                if (response.data.data.profile) {
                    setPreviewImage(response.data.data.profile);
                }
            } catch (error) {
                toast.error('Failed to fetch user details.');
            }
        };

        fetchUser();
    }, [id]);

    if (!user) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box sx={{ 
          maxWidth: 1000, 
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
                    <Box>
                        <Typography 
                            variant="h4" 
                            component="h1" 
                            sx={{ 
                                fontWeight: 'bold', 
                                color: 'primary.main',
                                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
                            }}
                        >
                            Edit User
                        </Typography>
                        <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                        >
                            Update user information below
                        </Typography>
                    </Box>
                </Box>
                
                <Divider sx={{ mb: 4 }} />
                
                <Formik
                    initialValues={{
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        mobile: user.mobile,
                        gender: user.gender,
                        status: user.status,
                        profile: user.profile,
                        location: user.location
                    }}
                    validationSchema={validationSchema}
                    onSubmit={async (values, { setSubmitting }) => {
                        const formData = new FormData();
                        Object.keys(values).forEach(key => {
                            if (values[key] !== null && values[key] !== undefined) {
                                formData.append(key, values[key]);
                            }
                        });

                        try {
                            await axios.put(`/api/users/${id}`, formData, {
                                headers: {
                                    'Content-Type': 'multipart/form-data'
                                }
                            });
                            toast.success('User updated successfully!');
                            navigate('/');
                        } catch (error) {
                            toast.error('Failed to update user.');
                        }
                        setSubmitting(false);
                    }}
                >
                    {({ errors, touched, setFieldValue, values }) => (
                        <Form>
                            <Grid container spacing={{ xs: 2, sm: 3 }}>
                                {/* Profile Image Section */}
                                <Grid item xs={12} md={4}>
                                    <Box sx={{ 
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        alignItems: 'center',
                                        p: { xs: 2, sm: 3 },
                                        backgroundColor: '#fafafa',
                                        borderRadius: 2,
                                        height: 'fit-content'
                                    }}>
                                        <Typography 
                                            variant="h6" 
                                            sx={{ 
                                                mb: 2, 
                                                fontWeight: 'bold',
                                                fontSize: { xs: '1rem', sm: '1.25rem' }
                                            }}
                                        >
                                            Profile Image
                                        </Typography>
                                        <Avatar 
                                            src={previewImage} 
                                            sx={{ 
                                                width: { xs: 100, sm: 120 }, 
                                                height: { xs: 100, sm: 120 }, 
                                                mb: 2,
                                                border: '3px solid',
                                                borderColor: 'primary.light'
                                            }}
                                        >
                                            <Person sx={{ fontSize: { xs: 50, sm: 60 } }} />
                                        </Avatar>
                                        <label htmlFor="profile-image" style={{ width: '100%' }}>
                                            <Input 
                                                accept="image/*" 
                                                id="profile-image" 
                                                type="file" 
                                                onChange={(event) => {
                                                    const file = event.currentTarget.files[0];
                                                    if (file) {
                                                        setFieldValue("profile", file);
                                                        const reader = new FileReader();
                                                        reader.onload = () => setPreviewImage(reader.result);
                                                        reader.readAsDataURL(file);
                                                    }
                                                }} 
                                            />
                                            <Button 
                                                variant="contained" 
                                                component="span" 
                                                startIcon={<CloudUpload />}
                                                fullWidth
                                                size={window.innerWidth < 600 ? 'medium' : 'large'}
                                            >
                                                Change Image
                                            </Button>
                                        </label>
                                    </Box>
                                </Grid>
                                
                                {/* Form Fields Section */}
                                <Grid item xs={12} md={8}>
                                    <Grid container spacing={{ xs: 2, sm: 3 }}>
                                        <Grid item xs={12} sm={6}>
                                            <Field 
                                                as={TextField} 
                                                name="firstName" 
                                                label="First Name" 
                                                fullWidth 
                                                size={window.innerWidth < 600 ? 'medium' : 'large'}
                                                error={touched.firstName && !!errors.firstName} 
                                                helperText={touched.firstName && errors.firstName} 
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Field 
                                                as={TextField} 
                                                name="lastName" 
                                                label="Last Name" 
                                                fullWidth 
                                                size={window.innerWidth < 600 ? 'medium' : 'large'}
                                                error={touched.lastName && !!errors.lastName} 
                                                helperText={touched.lastName && errors.lastName} 
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Field 
                                                as={TextField} 
                                                name="email" 
                                                label="Email" 
                                                fullWidth 
                                                size={window.innerWidth < 600 ? 'medium' : 'large'}
                                                error={touched.email && !!errors.email} 
                                                helperText={touched.email && errors.email} 
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Field 
                                                as={TextField} 
                                                name="mobile" 
                                                label="Mobile" 
                                                fullWidth 
                                                size={window.innerWidth < 600 ? 'medium' : 'large'}
                                                error={touched.mobile && !!errors.mobile} 
                                                helperText={touched.mobile && errors.mobile} 
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography 
                                                variant="subtitle1" 
                                                sx={{ 
                                                    mb: 1, 
                                                    fontWeight: 'medium',
                                                    fontSize: { xs: '0.875rem', sm: '1rem' }
                                                }}
                                            >
                                                Gender
                                            </Typography>
                                            <FormControl component="fieldset">
                                                <Field name="gender">
                                                    {({ field }) => (
                                                        <RadioGroup 
                                                            {...field} 
                                                            row={window.innerWidth >= 600}
                                                            value={values.gender}
                                                        >
                                                            <FormControlLabel 
                                                                value="Male" 
                                                                control={<Radio />} 
                                                                label="Male" 
                                                            />
                                                            <FormControlLabel 
                                                                value="Female" 
                                                                control={<Radio />} 
                                                                label="Female" 
                                                            />
                                                        </RadioGroup>
                                                    )}
                                                </Field>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth>
                                                <InputLabel>Status</InputLabel>
                                                <Field name="status">
                                                    {({ field }) => (
                                                        <Select 
                                                            {...field} 
                                                            label="Status"
                                                            size={window.innerWidth < 600 ? 'medium' : 'large'}
                                                            value={values.status}
                                                        >
                                                            <MenuItem value="Active">Active</MenuItem>
                                                            <MenuItem value="Inactive">Inactive</MenuItem>
                                                        </Select>
                                                    )}
                                                </Field>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Field 
                                                as={TextField} 
                                                name="location" 
                                                label="Location" 
                                                fullWidth 
                                                size={window.innerWidth < 600 ? 'medium' : 'large'}
                                                error={touched.location && !!errors.location} 
                                                helperText={touched.location && errors.location} 
                                            />
                                        </Grid>
                                        <Grid item xs={12} sx={{ mt: 2 }}>
                                            <Button 
                                                type="submit" 
                                                variant="contained" 
                                                fullWidth 
                                                size="large"
                                                sx={{ 
                                                    backgroundColor: 'primary.main', 
                                                    '&:hover': { backgroundColor: 'primary.dark' },
                                                    py: { xs: 1.5, sm: 2 },
                                                    fontSize: { xs: '1rem', sm: '1.125rem' }
                                                }}
                                            >
                                                Update User
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Form>
                    )}
                </Formik>
            </Paper>
        </Box>
    );
};

export default EditUser;