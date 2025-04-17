import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Chip,
    Paper
} from '@mui/material';
import {
    CalendarToday,
    Description,
    Category
} from '@mui/icons-material';

const DocumentPreview = ({ document, open, onClose }) => {
    if (!document) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Typography variant="h6">{document.title}</Typography>
            </DialogTitle>
            <DialogContent>
                <Paper sx={{ p: 3 }}>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="textSecondary">
                            <CalendarToday sx={{ mr: 1, verticalAlign: 'middle' }} fontSize="small" />
                            Uploaded on: {new Date(document.uploadDate).toLocaleDateString()}
                        </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="textSecondary">
                            <Description sx={{ mr: 1, verticalAlign: 'middle' }} fontSize="small" />
                            Description: {document.description}
                        </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="textSecondary">
                            <Category sx={{ mr: 1, verticalAlign: 'middle' }} fontSize="small" />
                            File Type: {document.fileType}
                        </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="textSecondary">
                            Status: 
                            <Chip 
                                label={document.status}
                                color={document.status === 'verified' ? 'success' : 'default'}
                                size="small"
                                sx={{ ml: 1 }}
                            />
                        </Typography>
                    </Box>
                </Paper>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DocumentPreview;