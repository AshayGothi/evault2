import React, { useState } from 'react';
import { 
    AppBar, 
    Toolbar, 
    Typography, 
    Button, 
    IconButton,
    Box,
    useTheme,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Avatar,
    TextField
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const Navbar = ({ onToggleTheme, isDarkMode }) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [profileOpen, setProfileOpen] = useState(false);
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                LexChain
                </Typography>
                    
                    <IconButton 
                        sx={{ mr: 2 }} 
                        onClick={onToggleTheme} 
                        color="inherit"
                    >
                        {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>

                    {token ? (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Button color="inherit" onClick={() => setProfileOpen(true)}>
                                Profile
                            </Button>
                            <Button color="inherit" onClick={handleLogout}>
                                Logout
                            </Button>
                        </Box>
                    ) : (
                        <Button color="inherit" onClick={() => navigate('/login')}>
                            Login
                        </Button>
                    )}
                </Toolbar>
            </AppBar>

            <Dialog 
                open={profileOpen} 
                onClose={() => setProfileOpen(false)}
                PaperProps={{
                    sx: {
                        bgcolor: theme.palette.background.paper,
                        color: theme.palette.text.primary
                    }
                }}
            >
                <DialogTitle>Profile Details</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                        <Avatar 
                            sx={{ 
                                width: 80, 
                                height: 80, 
                                mb: 2, 
                                bgcolor: theme.palette.primary.main 
                            }}
                        >
                            {username?.[0]?.toUpperCase()}
                        </Avatar>
                        <TextField
                            fullWidth
                            label="Username"
                            value={username || ''}
                            margin="normal"
                            disabled
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            value={email || ''}
                            margin="normal"
                            disabled
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setProfileOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Navbar;