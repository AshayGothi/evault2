import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Box } from '@mui/material';
import axios from 'axios';
import DocumentUpload from '../components/DocumentUpload';
import DocumentList from '../components/DocumentList';
import DashboardStats from '../components/DashboardStats';

const Dashboard = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDocuments = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/documents', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDocuments(response.data);
        } catch (error) {
            console.error('Error fetching documents:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Document Dashboard
                </Typography>
                <DashboardStats documents={documents} />
            </Box>
            
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <DocumentUpload onUploadSuccess={fetchDocuments} />
                </Grid>
                <Grid item xs={12}>
                    <DocumentList 
                        documents={documents} 
                        onDocumentUpdate={fetchDocuments}
                        isLoading={loading}
                    />
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard;