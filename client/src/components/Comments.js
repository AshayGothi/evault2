import React, { useState, useEffect } from 'react';
import { List, ListItem, TextField, Button, Box, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';

const Comments = ({ documentId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [posting, setPosting] = useState(false);

    const fetchComments = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`/api/documents/${documentId}/comments`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setComments(response.data);
        } catch (error) {
            setError('Failed to fetch comments. Please try again later.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const addComment = async () => {
        if (!newComment.trim()) return;
        setPosting(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `/api/documents/${documentId}/comments`,
                { content: newComment },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setComments((prev) => [...prev, response.data]); // Optimistic update
            setNewComment('');
            setError('');
        } catch (error) {
            setError('Failed to post comment. Please try again.');
            console.error(error);
        } finally {
            setPosting(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [documentId]);

    return (
        <Box sx={{ p: 2 }}>
            {/* Input for new comment */}
            <Box sx={{ mb: 2 }}>
                <TextField
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment"
                    fullWidth
                    multiline
                    rows={2}
                    error={Boolean(error)}
                    helperText={error || 'Share your thoughts about this document'}
                />
                <Button
                    onClick={addComment}
                    variant="contained"
                    sx={{ mt: 1 }}
                    disabled={!newComment.trim() || posting}
                >
                    {posting ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Post'}
                </Button>
            </Box>

            {/* Comments section */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <CircularProgress />
                </Box>
            ) : comments.length > 0 ? (
                <List>
                    {comments.map((comment) => (
                        <ListItem
                            key={comment._id}
                            sx={{
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                mb: 2,
                                p: 2,
                                bgcolor: 'background.paper',
                                borderRadius: 1,
                                boxShadow: 1,
                            }}
                        >
                            <Typography variant="body1" sx={{ mb: 0.5 }}>
                                {comment.content}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                                {new Date(comment.createdAt).toLocaleString()}
                            </Typography>
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Typography variant="body2" color="textSecondary" align="center">
                    No comments yet. Be the first to add one!
                </Typography>
            )}
        </Box>
    );
};

export default Comments;
