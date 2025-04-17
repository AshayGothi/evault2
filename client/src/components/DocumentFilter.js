import React from 'react';
import {
    Box,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Stack
} from '@mui/material';

const DocumentFilter = ({ filters, setFilters, categories }) => {
    return (
        <Box sx={{ mb: 3 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                    fullWidth
                    label="Search"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Category</InputLabel>
                    <Select
                        value={filters.category}
                        label="Category"
                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    >
                        <MenuItem value="">All</MenuItem>
                        {categories.map((category) => (
                            <MenuItem key={category} value={category}>
                                {category}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={filters.status}
                        label="Status"
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="verified">Verified</MenuItem>
                        <MenuItem value="rejected">Rejected</MenuItem>
                    </Select>
                </FormControl>
            </Stack>
            {filters.tags.length > 0 && (
                <Box sx={{ mt: 2 }}>
                    {filters.tags.map((tag) => (
                        <Chip
                            key={tag}
                            label={tag}
                            onDelete={() => {
                                setFilters({
                                    ...filters,
                                    tags: filters.tags.filter(t => t !== tag)
                                });
                            }}
                            sx={{ mr: 1 }}
                        />
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default DocumentFilter;