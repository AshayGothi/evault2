const crypto = require('crypto');

const blockchainUtils = {
    generateHash: async (buffer) => {
        return crypto.createHash('sha256').update(buffer).digest('hex');
    },

    storeHash: async (hash) => {
        // Simulate blockchain storage
        return hash + '_blockchain';
    },

    verifyDocument: async (originalHash, blockchainHash) => {
        if (!originalHash || !blockchainHash) {
            throw new Error("Missing originalHash or blockchainHash in verifyDocument()");
        }
    
        const storedHash = blockchainHash.replace('_blockchain', '');
        return storedHash === originalHash;
    }
    
};

module.exports = blockchainUtils;