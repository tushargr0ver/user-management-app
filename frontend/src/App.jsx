import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container, 
  Box,
  CssBaseline 
} from '@mui/material';
import { People, PersonAdd } from '@mui/icons-material';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import AddUser from './pages/AddUser';
import UserList from './pages/UserList';
import UserDetails from './pages/UserDetails';
import EditUser from './pages/EditUser';

function App() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <CssBaseline />
      <AppBar position="static" sx={{ backgroundColor: '#1976d2', mb: 4 }}>
        <Toolbar>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              fontWeight: 'bold',
              fontSize: { xs: '1rem', sm: '1.25rem' }
            }}
          >
            User Management System
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1 }}>
            <Button 
              color="inherit" 
              component={Link} 
              to="/" 
              startIcon={<People />}
              sx={{ mr: 1 }}
            >
              User List
            </Button>
            <Button 
              color="inherit" 
              component={Link} 
              to="/add-user"
              startIcon={<PersonAdd />}
            >
              Add User
            </Button>
          </Box>
          {/* Mobile menu */}
          <Box sx={{ display: { xs: 'flex', sm: 'none' }, gap: 0.5 }}>
            <Button 
              color="inherit" 
              component={Link} 
              to="/" 
              size="small"
              sx={{ minWidth: 'auto', px: 1 }}
            >
              <People />
            </Button>
            <Button 
              color="inherit" 
              component={Link} 
              to="/add-user"
              size="small"
              sx={{ minWidth: 'auto', px: 1 }}
            >
              <PersonAdd />
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container 
        maxWidth="xl" 
        sx={{ 
          mt: { xs: 2, sm: 4 }, 
          mb: 4, 
          px: { xs: 1, sm: 3 },
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          minHeight: 'calc(100vh - 120px)'
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 1400 }}>
          <Routes>
            <Route path="/" element={<UserList />} />
            <Route path="/add-user" element={<AddUser />} />
            <Route path="/user/:id" element={<UserDetails />} />
            <Route path="/edit-user/:id" element={<EditUser />} />
          </Routes>
        </Box>
      </Container>

      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Box>
  );
}

export default App;
