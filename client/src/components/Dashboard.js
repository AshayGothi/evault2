import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import axios from 'axios';
import DocumentList from './DocumentList';
import DocumentUpload from './DocumentUpload';

const Dashboard = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDocuments = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            const response = await axios.get('http://localhost:5000/api/documents', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDocuments(response.data);
        } catch (error) {
            console.error('Error fetching documents:', error);
            setDocuments([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Document Dashboard
                </Typography>
                <Typography variant="caption" display="block" gutterBottom>
                    Your User ID: {localStorage.getItem('userId')}
                </Typography>
            </Box>
            
            <DocumentUpload onUploadSuccess={fetchDocuments} />
            
            <Box sx={{ mt: 4 }}>
                {loading ? (
                    <Box display="flex" justifyContent="center" p={3}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <DocumentList 
                        documents={documents} 
                        onDocumentUpdate={fetchDocuments} 
                    />
                )}
            </Box>
        </Container>
    );
};

export default Dashboard;