import React, { useState, useRef, useEffect } from 'react';
import { 
    Paper, 
    TextField, 
    Button, 
    Box, 
    Typography, 
    LinearProgress, 
    Alert, 
    IconButton, 
    List, 
    ListItem, 
    ListItemText,
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions,
    FormControl, 
    InputLabel, 
    Select, 
    MenuItem
} from '@mui/material';
import { CloudUpload, Close, RemoveRedEye } from '@mui/icons-material';
import axios from 'axios';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
];

const DocumentUpload = ({ onUploadSuccess }) => {
    const [files, setFiles] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [openPreview, setOpenPreview] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        return () => {
            // Cleanup URLs when component unmounts
            if (previewUrl && !previewUrl.startsWith('data:')) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const validateFile = (file) => {
        if (!file) return 'No file selected';
        if (!ALLOWED_FILE_TYPES.includes(file.type)) return 'File type not supported';
        if (file.size > MAX_FILE_SIZE) return 'File size too large (max 10MB)';
        return null;
    };

    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        const validFiles = [];
        const errors = [];

        selectedFiles.forEach(file => {
            const error = validateFile(file);
            if (error) {
                errors.push(`${file.name}: ${error}`);
            } else {
                validFiles.push(file);
            }
        });

        if (errors.length > 0) {
            setError(errors.join('\n'));
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } else {
            setError('');
            setFiles(prevFiles => [...prevFiles, ...validFiles]);
            if (validFiles.length === 1 && !title) {
                setTitle(validFiles[0].name.split('.')[0]);
            }
        }
    };

    const handlePreview = (file) => {
        try {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = () => {
                    setPreviewUrl(reader.result);
                    setOpenPreview(true);
                };
                reader.onerror = () => {
                    setError('Error reading file');
                };
                reader.readAsDataURL(file);
            } else if (file.type === 'application/pdf') {
                const url = URL.createObjectURL(file);
                setPreviewUrl(url);
                setOpenPreview(true);
            }
        } catch (error) {
            setError('Error previewing file');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (files.length === 0) {
            setError('Please select at least one file');
            return;
        }

        if (!category) {
            setError('Please select a category');
            return;
        }

        setError('');
        setUploading(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Not authenticated');
            }
            
            for (const file of files) {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('title', files.length === 1 ? title : file.name);
                formData.append('description', description);
                formData.append('category', category);

                await axios.post(
                    'http://localhost:5000/api/documents/upload',
                    formData,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
            }

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
            setTitle('');
            setDescription('');
            setCategory('');
            setFiles([]);
            onUploadSuccess();
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Error uploading document');
        } finally {
            setUploading(false);
        }
    };

    const removeFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
        if (files.length === 1) {
            setTitle('');
        }
    };

    const renderPreview = () => {
        try {
            if (!previewUrl) return null;
            
            if (previewUrl.startsWith('data:image')) {
                return (
                    <img 
                        src={previewUrl} 
                        alt="Preview" 
                        style={{ maxWidth: '100%', height: 'auto' }} 
                    />
                );
            } else {
                return (
                    <iframe 
                        src={previewUrl} 
                        width="100%" 
                        height="500px" 
                        title="Document Preview"
                        sandbox="allow-same-origin"
                    />
                );
            }
        } catch (error) {
            return <Alert severity="error">Error loading preview</Alert>;
        }
    };

    return (
        <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
                Upload Documents
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Document Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    margin="normal"
                    required={files.length === 1}
                    disabled={files.length > 1}
                    helperText={files.length > 1 ? "Multiple files will use their own names" : ""}
                />
                <TextField
                    fullWidth
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    margin="normal"
                    multiline
                    rows={2}
                />
                <FormControl fullWidth margin="normal" required>
                    <InputLabel>Category</InputLabel>
                    <Select
                        value={category}
                        label="Category"
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <MenuItem value="Legal">Legal</MenuItem>
                        <MenuItem value="Financial">Financial</MenuItem>
                        <MenuItem value="Personal">Personal</MenuItem>
                        <MenuItem value="Business">Business</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                    </Select>
                </FormControl>

                <Box sx={{ mt: 2, mb: 2 }}>
                    <input
                        accept={ALLOWED_FILE_TYPES.join(',')}
                        style={{ display: 'none' }}
                        id="contained-button-file"
                        multiple
                        type="file"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                    />
                    <label htmlFor="contained-button-file">
                        <Button
                            variant="outlined"
                            component="span"
                            startIcon={<CloudUpload />}
                        >
                            Select Files
                        </Button>
                    </label>
                </Box>

                {files.length > 0 && (
                    <List>
                        {files.map((file, index) => (
                            <ListItem
                                key={index}
                                secondaryAction={
                                    <Box>
                                        {(file.type.startsWith('image/') || file.type === 'application/pdf') && (
                                            <IconButton 
                                                edge="end" 
                                                onClick={() => handlePreview(file)}
                                                sx={{ mr: 1 }}
                                            >
                                                <RemoveRedEye />
                                            </IconButton>
                                        )}
                                        <IconButton 
                                            edge="end" 
                                            onClick={() => removeFile(index)}
                                        >
                                            <Close />
                                        </IconButton>
                                    </Box>
                                }
                            >
                                <ListItemText 
                                    primary={file.name}
                                    secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                                />
                            </ListItem>
                        ))}
                    </List>
                )}

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        Documents uploaded successfully!
                    </Alert>
                )}

                {uploading && (
                    <Box sx={{ mb: 2 }}>
                        <LinearProgress />
                        <Typography variant="caption" sx={{ mt: 1 }}>
                            Uploading documents...
                        </Typography>
                    </Box>
                )}

                <Button
                    type="submit"
                    variant="contained"
                    disabled={uploading || files.length === 0}
                    fullWidth
                >
                    {uploading ? 'Uploading...' : 'Upload Documents'}
                </Button>
            </Box>

            <Dialog 
                open={openPreview} 
                onClose={() => {
                    setOpenPreview(false);
                    setPreviewUrl(null);
                }}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>File Preview</DialogTitle>
                <DialogContent>
                    {renderPreview()}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setOpenPreview(false);
                        setPreviewUrl(null);
                    }}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default DocumentUpload;