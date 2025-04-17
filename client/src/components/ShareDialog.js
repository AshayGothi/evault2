import React, { useState, useEffect } from 'react';
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

    useEffect(() => {
        if (!open) {
            setUserId('');
            setError('');
            setLoading(false);
        }
    }, [open]);

    const handleShare = async () => {
        if (!userId.trim()) {
            setError('Please enter a valid user ID');
            return;
        }

        try {
            setLoading(true);
            setError('');

            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:5000/api/documents/share',
                { documentId, userId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            onShare && onShare();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Error sharing document');
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
                <Button onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
                <Button
                    onClick={handleShare}
                    color="primary"
                    variant="contained"
                    disabled={loading}
                >
                    {loading ? 'Sharing...' : 'Share'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ShareDialog;
