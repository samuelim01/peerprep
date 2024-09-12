import mongoose from 'mongoose';
import { MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DATABASE } from '../config';

const connectDb = () => {
    const connectionString = `${MONGODB_URL}/${MONGODB_DATABASE}`

    mongoose.connect(connectionString, {
        authSource: 'admin',
        user: MONGODB_USERNAME,
        pass: MONGODB_PASSWORD,
    })
    .then(() => console.log('MongoDB connected successfully'))
    .catch((error) => {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    })
};

export default connectDb;