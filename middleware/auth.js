const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const auth = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header missing' });
        }
        
        const token = authHeader.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const admin = await Admin.findOne({ _id: decoded.id });

        if (!admin) {
            return res.status(401).json({ message: 'Admin not found' });
        }

        req.token = token;
        req.admin = admin;
        next();
    } catch (error) {
        console.error('Auth error:', error.message);
        res.status(401).json({ message: 'Please authenticate.' });
    }
};

module.exports = auth;
