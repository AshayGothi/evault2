import React, { useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, IconButton, Tooltip, TextField,
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TableSortLabel, CircularProgress, Box
} from '@mui/material';
import {
    Share, Verified, Delete, Search, Visibility, GetApp
} from '@mui/icons-material';
import axios from 'axios';
import DocumentPreview from './DocumentPreview';
import ShareDialog from './ShareDialog';

const DocumentList = ({ documents = [], onDocumentUpdate }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [documentToDelete, setDocumentToDelete] = useState(null);
    const [orderBy, setOrderBy] = useState('uploadDate');
    const [order, setOrder] = useState('desc');
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [shareDialogOpen, setShareDialogOpen] = useState(false);
    const [documentToShare, setDocumentToShare] = useState(null);

    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleDownload = async (documentId, fileName, e) => {
        if (e) e.stopPropagation();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `http://localhost:5000/api/documents/download/${documentId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    responseType: 'blob'
                }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download error:', error);
        }
    };

    const handleShare = (documentId, e) => {
        e.stopPropagation();
        setDocumentToShare(documentId);
        setShareDialogOpen(true);
    };

    const handleVerify = async (documentId, e) => {
        e.stopPropagation();
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `http://localhost:5000/api/documents/verify/${documentId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert(response.data.message);
            if (onDocumentUpdate) onDocumentUpdate();
        } catch (error) {
            console.error('Verification error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/documents/${documentToDelete}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onDocumentUpdate();
            setDeleteDialogOpen(false);
        } catch (error) {
            console.error('Delete error:', error);
        } finally {
            setLoading(false);
            setDocumentToDelete(null);
        }
    };

    const filteredDocuments = documents.filter(doc =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedDocuments = filteredDocuments.sort((a, b) => {
        if (order === 'asc') {
            return a[orderBy] < b[orderBy] ? -1 : 1;
        } else {
            return b[orderBy] < a[orderBy] ? -1 : 1;
        }
    });

    return (
        <>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <TextField
                    fullWidth
                    label="Search Documents"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                />
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'title'}
                                    direction={orderBy === 'title' ? order : 'asc'}
                                    onClick={() => handleSort('title')}
                                >
                                    Title
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'uploadDate'}
                                    direction={orderBy === 'uploadDate' ? order : 'asc'}
                                    onClick={() => handleSort('uploadDate')}
                                >
                                    Upload Date
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedDocuments.map((doc) => (
                            <TableRow
                                key={doc._id}
                                onClick={() => setSelectedDocument(doc)}
                                sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
                            >
                                <TableCell>{doc.title}</TableCell>
                                <TableCell>{doc.description}</TableCell>
                                <TableCell>{new Date(doc.uploadDate).toLocaleDateString()}</TableCell>
                                <TableCell>{doc.status}</TableCell>
                                <TableCell>
                                    <Tooltip title="Preview">
                                        <IconButton onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedDocument(doc);
                                        }}>
                                            <Visibility />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Download">
                                        <IconButton onClick={(e) => handleDownload(doc._id, doc.title, e)} disabled={loading}>
                                            <GetApp />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Share">
                                        <IconButton onClick={(e) => handleShare(doc._id, e)} disabled={loading}>
                                            <Share />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Verify">
                                        <IconButton onClick={(e) => handleVerify(doc._id, e)} disabled={loading}>
                                            <Verified />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <IconButton onClick={(e) => {
                                            e.stopPropagation();
                                            setDocumentToDelete(doc._id);
                                            setDeleteDialogOpen(true);
                                        }} disabled={loading}>
                                            <Delete color="error" />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this document?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleDelete} color="error" disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>

            <DocumentPreview
                document={selectedDocument}
                open={Boolean(selectedDocument)}
                onClose={() => setSelectedDocument(null)}
            />

            <ShareDialog
                open={shareDialogOpen}
                onClose={() => {
                    setShareDialogOpen(false);
                    setDocumentToShare(null);
                }}
                documentId={documentToShare}
                onShare={onDocumentUpdate}
            />

            {loading && (
                <Box sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    zIndex: 9999
                }}>
                    <CircularProgress />
                </Box>
            )}
        </>
    );
};

export default DocumentList;
