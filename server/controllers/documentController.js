const Document = require('../models/Document');
const User = require('../models/User');
const {
    generateHash,
    storeHash,
    verifyDocument
} = require('../utils/blockchainUtils');

const fs = require('fs');
const path = require('path');

const validateFile = (file) => {
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    const ALLOWED_TYPES = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
    ];

    if (!file) return 'No file provided';
    if (file.size > MAX_SIZE) return 'File size exceeds 10MB limit';
    if (!ALLOWED_TYPES.includes(file.mimetype)) return 'File type not allowed';
    return null;
};

const documentController = {
    uploadDocument: async (req, res) => {
        try {
            const { title, description } = req.body;
            const file = req.file;

            const validationError = validateFile(file);
            if (validationError) {
                return res.status(400).json({ message: validationError });
            }

            const fileHash = await generateHash(file.buffer);
            const blockchainHash = await storeHash(fileHash);

            const uploadDir = path.join(__dirname, '../uploads');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const fileName = `${Date.now()}-${file.originalname}`;
            const filePath = path.join(uploadDir, fileName);
            fs.writeFileSync(filePath, file.buffer);

            const document = new Document({
                title,
                description,
                fileHash,
                blockchainHash,
                owner: req.user.id,
                fileType: file.mimetype,
                fileSize: file.size,
                category: req.body.category || 'Other',
                filePath: filePath
            });

            await document.save();
            res.status(201).json({ message: "Document uploaded successfully", document });
        } catch (error) {
            res.status(500).json({ message: "Error uploading document", error: error.message });
        }
    },

    getDocuments: async (req, res) => {
        try {
            const documents = await Document.find({
                $or: [{ owner: req.user.id }, { sharedWith: req.user.id }]
            });
            res.json(documents);
        } catch (error) {
            res.status(500).json({ message: "Error fetching documents", error: error.message });
        }
    },

    shareDocument: async (req, res) => {
        try {
            const { documentId, userId } = req.body;
            const document = await Document.findById(documentId);
            if (!document) {
                return res.status(404).json({ message: "Document not found" });
            }

            const targetUser = await User.findById(userId);
            if (!targetUser) {
                return res.status(404).json({ message: "User not found" });
            }

            if (!document.sharedWith.includes(userId)) {
                document.sharedWith.push(userId);
                await document.save();
            }

            res.json({ message: "Document shared successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error sharing document", error: error.message });
        }
    },

    verifyDocument: async (req, res) => {
        try {
            const document = await Document.findById(req.params.id);
            if (!document) {
                return res.status(404).json({ message: "Document not found" });
            }

            const isValid = await verifyDocument(document.fileHash, document.blockchainHash);

            document.status = isValid ? 'verified' : 'invalid';
            await document.save();

            res.json({
                verified: isValid,
                message: isValid ? "Document is authentic" : "Document verification failed"
            });
        } catch (error) {
            console.error('Verification error:', error);
            res.status(500).json({ message: "Error verifying document", error: error.message });
        }
    },

    addVersion: async (req, res) => {
        try {
            const document = await Document.findById(req.params.id);
            if (!document) {
                return res.status(404).json({ message: "Document not found" });
            }

            const file = req.file;
            const fileHash = await generateHash(file.buffer);
            const blockchainHash = await storeHash(fileHash);

            document.previousVersions.push({
                filePath: document.filePath,
                version: document.version,
                uploadDate: document.uploadDate,
                fileHash: document.fileHash,
                blockchainHash: document.blockchainHash
            });

            document.version += 1;
            document.fileHash = fileHash;
            document.blockchainHash = blockchainHash;

            await document.save();
            res.json({ message: "Version updated successfully", document });
        } catch (error) {
            res.status(500).json({ message: "Error updating version", error: error.message });
        }
    },

    getComments: async (req, res) => {
        try {
            const document = await Document.findById(req.params.id)
                .populate('comments.author', 'username');
            if (!document) {
                return res.status(404).json({ message: "Document not found" });
            }
            res.json(document.comments);
        } catch (error) {
            res.status(500).json({ message: "Error fetching comments", error: error.message });
        }
    },

    addComment: async (req, res) => {
        try {
            const document = await Document.findById(req.params.id);
            if (!document) {
                return res.status(404).json({ message: "Document not found" });
            }

            document.comments.push({
                content: req.body.content,
                author: req.user.id
            });
            await document.save();
            res.json({ message: "Comment added successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error adding comment", error: error.message });
        }
    },

    deleteDocument: async (req, res) => {
        try {
            const document = await Document.findOneAndDelete({
                _id: req.params.id,
                owner: req.user.id
            });

            if (!document) {
                return res.status(404).json({ message: "Document not found" });
            }

            if (document.filePath && fs.existsSync(document.filePath)) {
                fs.unlinkSync(document.filePath);
            }

            res.json({ message: "Document deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error deleting document", error: error.message });
        }
    },

    downloadDocument: async (req, res) => {
        try {
            const documentId = req.params.id;
            const doc = await Document.findById(documentId);
            if (!doc) return res.status(404).json({ message: 'Document not found' });

            const filePath = doc.filePath;
            if (!fs.existsSync(filePath)) {
                return res.status(404).json({ message: 'File not found on server' });
            }

            res.download(filePath, doc.title);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    },

    advancedSearch: async (req, res) => {
        try {
            const { searchTerm, category, startDate, endDate, status, tags } = req.query;

            let query = {
                $or: [
                    { owner: req.user.id },
                    { sharedWith: req.user.id }
                ]
            };

            if (searchTerm) {
                query.$and = [{
                    $or: [
                        { title: { $regex: searchTerm, $options: 'i' } },
                        { description: { $regex: searchTerm, $options: 'i' } }
                    ]
                }];
            }

            if (category) query.category = category;
            if (status) query.status = status;
            if (tags) query.tags = { $all: tags.split(',') };

            if (startDate || endDate) {
                query.uploadDate = {};
                if (startDate) query.uploadDate.$gte = new Date(startDate);
                if (endDate) query.uploadDate.$lte = new Date(endDate);
            }

            const documents = await Document.find(query);
            res.json(documents);
        } catch (error) {
            res.status(500).json({ message: "Error searching documents", error: error.message });
        }
    }
};

module.exports = documentController;
