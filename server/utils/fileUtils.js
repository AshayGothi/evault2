const crypto = require('crypto');
const IPFS = require('ipfs-http-client');

const ipfs = IPFS.create({
    host: 'localhost',
    port: 5001,
    protocol: 'http'
});

const fileUtils = {
    hashFile: (buffer) => {
        return crypto.createHash('sha256').update(buffer).digest('hex');
    },

    uploadToIPFS: async (buffer) => {
        try {
            const result = await ipfs.add(buffer);
            return result.path;
        } catch (error) {
            throw new Error(`IPFS upload error: ${error.message}`);
        }
    }
};

module.exports = fileUtils;