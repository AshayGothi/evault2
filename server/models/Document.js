const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    fileHash: {
        type: String,
        required: true
    },
    blockchainHash: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sharedWith: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    category: {
        type: String,
        enum: ['Legal', 'Financial', 'Personal', 'Business', 'Other'],
        default: 'Other'
    },
    uploadDate: {
        type: Date,
        default: Date.now
    },
    fileType: String,
    fileSize: Number,
    filePath: String,
    status: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
    },
    version: {
        type: Number,
        default: 1
    },
    previousVersions: [{
        filePath: String,
        version: Number,
        uploadDate: Date,
        fileHash: String,
        blockchainHash: String
    }],
    expiryDate: Date,
    tags: [String],
    comments: [{
        content: String,
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    auditTrail: [{
        action: {
            type: String,
            enum: ['created', 'modified', 'shared', 'deleted', 'verified']
        },
        performedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        details: String
    }]
});

module.exports = mongoose.model('Document', documentSchema);