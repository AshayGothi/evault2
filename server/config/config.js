const path = require('path');

module.exports = {
    uploadDir: path.join(__dirname, '../uploads'),
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedFileTypes: [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
    ]
};