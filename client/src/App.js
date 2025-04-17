import React, { useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, Container, ThemeProvider, createTheme } from '@mui/material';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
};

function App() {
    const [mode, setMode] = useState(() => 
        localStorage.getItem('themeMode') || 'light'
    );

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    primary: {
                        main: mode === 'light' ? '#1976d2' : '#90caf9',
                    },
                    background: {
                        default: mode === 'light' ? '#f5f5f5' : '#121212',
                        paper: mode === 'light' ? '#fff' : '#1e1e1e',
                    },
                },
            }),
        [mode]
    );

    const toggleTheme = () => {
        const newMode = mode === 'light' ? 'dark' : 'light';
        setMode(newMode);
        localStorage.setItem('themeMode', newMode);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <Navbar onToggleTheme={toggleTheme} isDarkMode={mode === 'dark'} />
                <Container>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/dashboard" element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        } />
                        <Route path="/" element={<Navigate to="/login" />} />
                        <Route path="*" element={<Navigate to="/login" />} />
                    </Routes>
                </Container>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;