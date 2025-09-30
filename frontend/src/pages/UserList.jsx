import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { 
    Box, 
    TextField, 
    Button, 
    IconButton, 
    Typography, 
    Paper,
    Chip,
    Avatar,
    Tooltip,
    InputAdornment
} from '@mui/material';
import { 
    Search, 
    Visibility, 
    Edit, 
    Delete, 
    PersonAdd,
    FileDownload,
    Refresh
} from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(window.innerWidth < 600 ? 3 : 5);
    const [totalUsers, setTotalUsers] = useState(0);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`/api/users?page=${page + 1}&limit=${pageSize}`);
            setUsers(response.data.data);
            setTotalUsers(response.data.pagination?.totalUsers || response.data.data.length);
        } catch (error) {
            toast.error('Failed to fetch users.');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page, pageSize]);

    const handleSearch = async () => {
        try {
            const response = await axios.get(`/api/users/search/${searchText}`);
            setUsers(response.data.data);
        } catch (error) {
            toast.error('Failed to search users.');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/users/${id}`);
            toast.success('User deleted successfully!');
            fetchUsers();
        } catch (error) {
            toast.error('Failed to delete user.');
        }
    };

    const handleExport = async () => {
        try {
            const response = await axios.get('/api/users/export', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'users.csv');
            document.body.appendChild(link);
            link.click();
            toast.success('Users exported successfully!');
        } catch (error) {
            toast.error('Failed to export users.');
        }
    };

    const columns = [
        { 
            field: '_id', 
            headerName: 'ID', 
            width: 100,
            headerAlign: 'center',
            align: 'center',
            hide: true // Hide ID column on mobile for space
        },
        { 
            field: 'profile', 
            headerName: 'Avatar', 
            width: 80, 
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <Avatar 
                    src={params?.value ? `http://localhost:5000${params.value}` : ''} 
                    sx={{ width: 40, height: 40, mx: 'auto' }}
                />
            )
        },
        { 
            field: 'fullName', 
            headerName: 'Name', 
            flex: 1,
            minWidth: 150,
            valueGetter: (params) => {
                if (!params || !params.row) return '';
                return `${params.row.firstName || ''} ${params.row.lastName || ''}`;
            },
            renderCell: (params) => (
                <Box>
                    <Typography variant="body2" fontWeight="medium" noWrap>
                        {params.value}
                    </Typography>
                    {/* Show email on mobile below name */}
                    <Typography 
                        variant="caption" 
                        color="text.secondary" 
                        sx={{ display: { xs: 'block', md: 'none' } }}
                        noWrap
                    >
                        {params?.row?.email || ''}
                    </Typography>
                </Box>
            )
        },
        { 
            field: 'email', 
            headerName: 'Email', 
            width: 220,
            hide: false, // Will be hidden on mobile via sx
            renderCell: (params) => (
                <Typography variant="body2" color="text.secondary" noWrap>
                    {params.value}
                </Typography>
            )
        },
        { 
            field: 'mobile', 
            headerName: 'Mobile', 
            width: 130,
            hide: false, // Will be hidden on mobile
            renderCell: (params) => (
                <Typography variant="body2" noWrap>
                    {params.value}
                </Typography>
            )
        },
        { 
            field: 'gender', 
            headerName: 'Gender', 
            width: 100,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <Chip 
                    label={params.value} 
                    size="small"
                    color={params.value === 'Male' ? 'primary' : 'secondary'}
                    variant="outlined"
                />
            )
        },
        { 
            field: 'status', 
            headerName: 'Status', 
            width: 100,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <Chip 
                    label={params.value} 
                    size="small"
                    color={params.value === 'Active' ? 'success' : 'error'}
                    variant="filled"
                />
            )
        },
        { 
            field: 'location', 
            headerName: 'Location', 
            width: 140,
            hide: false, // Will be hidden on mobile
            renderCell: (params) => (
                <Typography variant="body2" noWrap>
                    {params.value}
                </Typography>
            )
        },
        {
            field: 'action',
            headerName: 'Actions',
            width: 150,
            headerAlign: 'center',
            align: 'center',
            sortable: false,
            renderCell: (params) => {
                if (!params?.row?._id) return null;
                return (
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="View Details">
                        <IconButton 
                            size="small" 
                            color="info"
                            component={Link} 
                            to={`/user/${params.row._id}`}
                        >
                            <Visibility fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit User">
                        <IconButton 
                            size="small" 
                            color="primary"
                            component={Link} 
                            to={`/edit-user/${params.row._id}`}
                        >
                            <Edit fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete User">
                        <IconButton 
                            size="small" 
                            color="error" 
                            onClick={() => handleDelete(params.row._id)}
                        >
                            <Delete fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
                );
            },
        },
    ];

    return (
        <Box sx={{ 
          height: '100%', 
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mx: 'auto',
          maxWidth: 1200
        }}>
            <Paper elevation={3} sx={{ 
              p: { xs: 1, sm: 2, md: 3 }, 
              mb: 3,
              width: '100%'
            }}>
                <Typography 
                    variant="h4" 
                    component="h1" 
                    gutterBottom 
                    sx={{ 
                        fontWeight: 'bold', 
                        color: 'primary.main',
                        fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem', lg: '2.125rem' },
                        textAlign: { xs: 'center', sm: 'left' }
                    }}
                >
                    User Management Dashboard
                </Typography>
                <Typography 
                    variant="body1" 
                    color="text.secondary" 
                    sx={{ 
                        mb: 3, 
                        fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                        textAlign: { xs: 'center', sm: 'left' }
                    }}
                >
                    Manage all users in your system
                </Typography>
                
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: { xs: 'stretch', md: 'center' }, 
                    mb: 3, 
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: { xs: 1.5, sm: 2 }
                }}>
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: { xs: 1, sm: 1.5 },
                        flexDirection: { xs: 'column', sm: 'row' },
                        width: { xs: '100%', md: 'auto' }
                    }}>
                        <TextField
                            variant="outlined"
                            size={window.innerWidth < 600 ? 'small' : 'medium'}
                            placeholder="Search users..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search color="action" fontSize="small" />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ 
                                minWidth: { xs: '100%', sm: 200, md: 250 },
                                maxWidth: { xs: '100%', sm: 280, md: 300 },
                                '& .MuiOutlinedInput-root': {
                                    fontSize: { xs: '0.875rem', sm: '1rem' }
                                }
                            }}
                        />
                        <Box sx={{ 
                            display: 'flex', 
                            gap: { xs: 0.5, sm: 1 },
                            width: { xs: '100%', sm: 'auto' }
                        }}>
                            <Button 
                                variant="contained" 
                                onClick={handleSearch}
                                startIcon={<Search fontSize="small" />}
                                size={window.innerWidth < 600 ? 'small' : 'medium'}
                                sx={{ 
                                    height: { xs: 36, sm: 40 },
                                    flex: { xs: 1, sm: 'none' },
                                    minWidth: { xs: 'auto', sm: 100 },
                                    px: { xs: 1, sm: 2 },
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                }}
                            >
                                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>Search</Box>
                            </Button>
                            <Button 
                                variant="outlined" 
                                onClick={fetchUsers}
                                startIcon={<Refresh fontSize="small" />}
                                size={window.innerWidth < 600 ? 'small' : 'medium'}
                                sx={{ 
                                    height: { xs: 36, sm: 40 },
                                    flex: { xs: 1, sm: 'none' },
                                    minWidth: { xs: 'auto', sm: 100 },
                                    px: { xs: 1, sm: 2 },
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                }}
                            >
                                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>Refresh</Box>
                            </Button>
                        </Box>
                    </Box>
                    <Box sx={{ 
                        display: 'flex', 
                        gap: { xs: 0.5, sm: 1 },
                        flexDirection: { xs: 'column', sm: 'row' },
                        width: { xs: '100%', md: 'auto' }
                    }}>
                        <Button 
                            variant="outlined" 
                            onClick={handleExport}
                            startIcon={<FileDownload fontSize="small" />}
                            color="success"
                            size={window.innerWidth < 600 ? 'small' : 'medium'}
                            sx={{ 
                                flex: { xs: 1, sm: 'none' },
                                height: { xs: 36, sm: 40 },
                                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                px: { xs: 1, sm: 2 }
                            }}
                        >
                            <Box sx={{ display: { xs: 'none', sm: 'inline' } }}>Export </Box>CSV
                        </Button>
                        <Button 
                            variant="contained" 
                            component={Link} 
                            to="/add-user"
                            startIcon={<PersonAdd fontSize="small" />}
                            size={window.innerWidth < 600 ? 'small' : 'large'}
                            sx={{ 
                                flex: { xs: 1, sm: 'none' },
                                height: { xs: 36, sm: 40 },
                                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                px: { xs: 1, sm: 2 }
                            }}
                        >
                            <Box sx={{ display: { xs: 'none', sm: 'inline' } }}>Add New </Box>User
                        </Button>
                    </Box>
                </Box>
            </Paper>

            <Paper elevation={2} sx={{ 
                height: { xs: 350, sm: 450, md: 500, lg: 600 }, 
                width: '100%',
                overflow: 'hidden'
            }}>
                <DataGrid
                    rows={users}
                    columns={columns}
                    pagination
                    pageSize={pageSize}
                    rowCount={totalUsers}
                    paginationMode="server"
                    onPageChange={(newPage) => setPage(newPage)}
                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                    rowsPerPageOptions={window.innerWidth < 600 ? [3, 5, 10] : [5, 10, 25]}
                    getRowId={(row) => row._id}
                    columnVisibilityModel={{
                        _id: false,
                        profile: window.innerWidth > 480,
                        email: window.innerWidth > 600,
                        mobile: window.innerWidth > 768,
                        location: window.innerWidth > 900,
                        status: window.innerWidth > 520,
                        gender: window.innerWidth > 800
                    }}
                    sx={{
                        border: 'none',
                        '& .MuiDataGrid-main': {
                            '& .MuiDataGrid-row': {
                                minHeight: { xs: '48px !important', sm: '52px !important' }
                            }
                        },
                        '& .MuiDataGrid-cell': {
                            borderBottom: '1px solid #f0f0f0',
                            fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.875rem' },
                            padding: { xs: '4px 2px', sm: '8px 4px', md: '8px 8px' },
                            '&:focus, &:focus-within': {
                                outline: 'none'
                            }
                        },
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: '#f5f5f5',
                            borderBottom: '2px solid #e0e0e0',
                            fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
                            minHeight: { xs: '40px !important', sm: '48px !important' }
                        },
                        '& .MuiDataGrid-columnHeader': {
                            padding: { xs: '4px 2px', sm: '8px 4px', md: '12px 8px' },
                            '&:focus, &:focus-within': {
                                outline: 'none'
                            }
                        },
                        '& .MuiDataGrid-row:hover': {
                            backgroundColor: '#f9f9f9',
                        },
                        '& .MuiDataGrid-footerContainer': {
                            borderTop: '1px solid #e0e0e0',
                            backgroundColor: '#fafafa',
                            minHeight: { xs: '44px', sm: '52px' },
                            '& .MuiTablePagination-root': {
                                fontSize: { xs: '0.7rem', sm: '0.875rem' }
                            }
                        },
                        '& .MuiDataGrid-toolbarContainer': {
                            padding: { xs: '4px', sm: '8px' }
                        }
                    }}
                />
            </Paper>
        </Box>
    );
};

export default UserList;