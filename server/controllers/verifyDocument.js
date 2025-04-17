const Web3 = require('web3');

// Replace with your actual values
const web3 = new Web3('https://your_rpc_or_infura_url');
const contractABI = [ /* your contract ABI here */ ];
const contractAddress = '0xYourContractAddress';

const contract = new web3.eth.Contract(contractABI, contractAddress);

verifyDocument: async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        
        if (!document) {
            return res.status(404).json({ message: "Document not found" });
        }

        const hashToVerify = document.fileHash; // should be 0x + sha256 hash

        // 🧠 Verify from blockchain
        const isValid = await contract.methods.verifyDocument(hashToVerify).call();

        // ✅ Update status
        document.status = isValid ? 'verified' : 'rejected';
        await document.save();

        res.json({
            message: isValid ? "Document is authentic" : "Document verification failed",
            verified: isValid,
            status: document.status
        });
    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({ message: "Error verifying document", error: error.message });
    }
}
