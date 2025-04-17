import React, { useState } from 'react';
import { Paper, TextField, Select, MenuItem, Button, Box, Chip, FormControl, InputLabel } from '@mui/material';

const AdvancedSearch = ({ onSearch }) => {
    const [filters, setFilters] = useState({
        searchTerm: '',
        category: '',
        startDate: '',
        endDate: '',
        status: '',
        tags: []
    });

    const [tagInput, setTagInput] = useState('');

    const handleAddTag = () => {
        if (tagInput.trim() && !filters.tags.includes(tagInput.trim())) {
            setFilters({ ...filters, tags: [...filters.tags, tagInput.trim()] });
            setTagInput('');
        }
    };

    const handleDeleteTag = (tagToDelete) => {
        setFilters({
            ...filters,
            tags: filters.tags.filter((tag) => tag !== tagToDelete)
        });
    };

    const handleSearch = () => {
        // Ensure startDate is not greater than endDate
        if (filters.startDate && filters.endDate && filters.startDate > filters.endDate) {
            alert("Start date cannot be later than end date.");
            return;
        }
        onSearch(filters);
    };

    return (
        <Paper sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <TextField
                    label="Search"
                    value={filters.searchTerm}
                    onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                    fullWidth
                />
                <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                        value={filters.category}
                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                        displayEmpty
                    >
                        <MenuItem value="">All Categories</MenuItem>
                        <MenuItem value="Legal">Legal</MenuItem>
                        <MenuItem value="Financial">Financial</MenuItem>
                        <MenuItem value="Personal">Personal</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        displayEmpty
                    >
                        <MenuItem value="">All Statuses</MenuItem>
                        <MenuItem value="Verified">Verified</MenuItem>
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Rejected">Rejected</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    type="date"
                    label="Start Date"
                    value={filters.startDate}
                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                />
                <TextField
                    type="date"
                    label="End Date"
                    value={filters.endDate}
                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                />
                <TextField
                    label="Add Tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                    fullWidth
                />
                <Button variant="contained" onClick={handleSearch} sx={{ alignSelf: 'center' }}>
                    Search
                </Button>
            </Box>
            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {filters.tags.map((tag, index) => (
                    <Chip
                        key={index}
                        label={tag}
                        onDelete={() => handleDeleteTag(tag)}
                        sx={{ mt: 1 }}
                    />
                ))}
            </Box>
        </Paper>
    );
};

export default AdvancedSearch;
