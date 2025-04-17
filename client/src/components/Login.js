import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Container,
    Alert,
    Link as MuiLink
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', credentials);
            const { token, userId, username, email } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('userId', userId);
            localStorage.setItem('username', username);
            localStorage.setItem('email', email);
            navigate('/dashboard');
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="xs">
            <Box
                sx={{
                    mt: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                <Typography component="h1" variant="h5">
                    Sign In
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, width: '100%' }}>
                    <TextField
                        name="username"
                        label="Username"
                        fullWidth
                        required
                        margin="normal"
                        autoFocus
                        value={credentials.username}
                        onChange={handleChange}
                    />
                    <TextField
                        name="password"
                        label="Password"
                        type="password"
                        fullWidth
                        required
                        margin="normal"
                        value={credentials.password}
                        onChange={handleChange}
                    />
                    {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </Button>
                    <Typography variant="body2" align="center">
                        Don't have an account?{' '}
                        <MuiLink component={Link} to="/register">
                            Sign Up
                        </MuiLink>
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default Login;
