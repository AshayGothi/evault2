import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Alert
} from '@mui/material';
import axios from 'axios';

const ShareDialog = ({ open, onClose, documentId, onShare }) => {
    const [userId, setUserId] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleShare = async () => {
        try {
            setLoading(true);
            setError('');
            
            if (!userId.trim()) {
                setError('Please enter a user ID');
                return;
            }
    
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/documents/share',
                { documentId, userId },
                { headers: { Authorization: `Bearer ${token}` }}
            );
            
            onShare && onShare();
            onClose();
            setUserId('');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error sharing document';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Share Document</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="User ID"
                    fullWidth
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    helperText="Enter the User ID of the person you want to share with"
                />
                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button 
                    onClick={handleShare} 
                    color="primary" 
                    variant="contained"
                    disabled={loading}
                >
                    Share
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ShareDialog;