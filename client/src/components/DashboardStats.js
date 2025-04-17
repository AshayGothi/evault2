import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { Description, CloudUpload, Share } from '@mui/icons-material';

const StatCard = ({ title, value, icon, color }) => (
    <Paper sx={{ p: 3 }}>
        <Box display="flex" alignItems="center">
            <Box sx={{ color: color }}>
                {icon}
            </Box>
            <Box ml={2}>
                <Typography variant="h4">{value}</Typography>
                <Typography color="textSecondary">{title}</Typography>
            </Box>
        </Box>
    </Paper>
);

const DashboardStats = ({ documents }) => {
    const totalDocuments = documents.length;
    const sharedDocuments = documents.filter(doc => doc.sharedWith?.length > 0).length;
    const verifiedDocuments = documents.filter(doc => doc.status === 'verified').length;

    return (
        <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
                <StatCard
                    title="Total Documents"
                    value={totalDocuments}
                    icon={<Description sx={{ fontSize: 40 }} />}
                    color="primary.main"
                />
            </Grid>
            <Grid item xs={12} md={4}>
                <StatCard
                    title="Shared Documents"
                    value={sharedDocuments}
                    icon={<Share sx={{ fontSize: 40 }} />}
                    color="info.main"
                />
            </Grid>
            <Grid item xs={12} md={4}>
                <StatCard
                    title="Verified Documents"
                    value={verifiedDocuments}
                    icon={<CloudUpload sx={{ fontSize: 40 }} />}
                    color="success.main"
                />
            </Grid>
        </Grid>
    );
};

export default DashboardStats;