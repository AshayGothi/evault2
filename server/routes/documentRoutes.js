const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const auth = require('../middleware/auth');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Basic document operations
router.post('/upload', auth, upload.single('file'), documentController.uploadDocument);
router.get('/', auth, async (req, res) => {
    await documentController.getDocuments(req, res);
});
router.get('/download/:id', auth, documentController.downloadDocument);

router.delete('/:id', auth, async (req, res) => {
    await documentController.deleteDocument(req, res);
});

// Document sharing and verification
router.post('/share', auth, async (req, res) => {
    await documentController.shareDocument(req, res);
});
router.post('/verify/:id', auth, async (req, res) => {
    await documentController.verifyDocument(req, res);
});

// Version control
router.post('/:id/version', auth, upload.single('file'), async (req, res) => {
    await documentController.addVersion(req, res);
});

// Comments
router.get('/:id/comments', auth, async (req, res) => {
    await documentController.getComments(req, res);
});
router.post('/:id/comments', auth, async (req, res) => {
    await documentController.addComment(req, res);
});

// Advanced search
router.get('/search', auth, async (req, res) => {
    await documentController.advancedSearch(req, res);
});

module.exports = router;