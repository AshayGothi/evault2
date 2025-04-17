import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Container, Alert, Stepper, Step, StepLabel } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [canResend, setCanResend] = useState(false);
    const [resendTimer, setResendTimer] = useState(60);
    const navigate = useNavigate();

    // Reset timer and resend functionality
    useEffect(() => {
        let timer;
        if (activeStep === 1 && resendTimer > 0) {
            timer = setInterval(() => {
                setResendTimer(prev => prev - 1);
            }, 1000);
        } else if (resendTimer === 0) {
            setCanResend(true);
        }
        return () => clearInterval(timer);
    }, [activeStep, resendTimer]);

    // Initial registration submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        try {
            setLoading(true);
            await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
                username: formData.username,
                email: formData.email,
                password: formData.password
            });

            setActiveStep(1);
        } catch (error) {
            setError(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleVerification = async () => {
        try {
            setLoading(true);
            await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/verify-email`, {
                email: formData.email,
                code: verificationCode
            });

            navigate('/login', {
                state: {
                    message: 'Registration successful! Please login.'
                }
            });
        } catch (error) {
            setError('Invalid verification code');
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        try {
            setLoading(true);
            await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/resend-verification`, {
                email: formData.email
            });

            setCanResend(false);
            setResendTimer(60);
            setError('');
            alert('Verification code has been resent to your email');
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to resend code');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h4" gutterBottom>
                    E-Vault Registration
                </Typography>

                <Stepper activeStep={activeStep} sx={{ width: '100%', mb: 4 }}>
                    <Step>
                        <StepLabel>Register</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel>Verify Email</StepLabel>
                    </Step>
                </Stepper>

                {activeStep === 0 ? (
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Username"
                            autoFocus
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Confirm Password"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        />
                        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={loading}
                        >
                            {loading ? 'Registering...' : 'Register'}
                        </Button>
                        <Link to="/login" style={{ textDecoration: 'none' }}>
                            <Button fullWidth>
                                Already have an account? Sign in
                            </Button>
                        </Link>
                    </Box>
                ) : (
                    <Box sx={{ mt: 1, width: '100%' }}>
                        <Typography variant="body1" gutterBottom>
                            Please check your email for verification code
                        </Typography>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Verification Code"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                        />
                        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3 }}
                            onClick={handleVerification}
                            disabled={loading || !verificationCode}
                        >
                            {loading ? 'Verifying...' : 'Verify Email'}
                        </Button>
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                            <Button
                                disabled={!canResend || loading}
                                onClick={handleResendCode}
                                variant="text"
                                color="primary"
                            >
                                {canResend ? 'Resend Code' : `Resend code in ${resendTimer}s`}
                            </Button>
                        </Box>
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default Register;
