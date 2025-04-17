import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, List, ListItem, Typography, Box, TextField } from '@mui/material';
import axios from 'axios';

const VersionControl = ({ document }) => {
    const [versions, setVersions] = useState(document.previousVersions || []);
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUploadNewVersion = async () => {
        if (!file) {
            alert("Please select a file to upload.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append('file', file);

            const token = localStorage.getItem('token');
            await axios.post(`/api/documents/${document._id}/version`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Refresh versions after upload
            const response = await axios.get(`/api/documents/${document._id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setVersions(response.data.previousVersions || []);
            alert("Version uploaded successfully.");
        } catch (error) {
            console.error("Error uploading new version:", error);
            alert("Failed to upload the version. Please try again.");
        } finally {
            setFile(null); // Reset file input
        }
    };

    return (
        <>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Button variant="contained" onClick={() => setOpen(true)}>
                    Version History
                </Button>
                <TextField
                    type="file"
                    onChange={handleFileChange}
                    sx={{ display: 'inline-block', width: 'auto' }}
                />
                <Button
                    variant="outlined"
                    onClick={handleUploadNewVersion}
                    disabled={!file}
                >
                    Upload New Version
                </Button>
            </Box>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Version History</DialogTitle>
                <DialogContent dividers>
                    <List>
                        {versions.length > 0 ? (
                            versions.map((version, index) => (
                                <ListItem key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body1">Version {version.version}</Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {new Date(version.uploadDate).toLocaleDateString()}
                                    </Typography>
                                </ListItem>
                            ))
                        ) : (
                            <Typography variant="body2" color="textSecondary" align="center">
                                No previous versions available.
                            </Typography>
                        )}
                    </List>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default VersionControl;
