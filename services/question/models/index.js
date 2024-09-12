const mongoose = require('mongoose');
const { MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DATABASE } = require('../config');

const connectDb = async () => {
    try {
        await mongoose.connect(`${MONGODB_URL}/${MONGODB_DATABASE}`, {
            authSource: 'admin',
            user: MONGODB_USERNAME,
            pass: MONGODB_PASSWORD,
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
};

module.exports = connectDb;