import mongoose from 'mongoose';

export async function connectToDB() {
    const mongoURI = process.env.NODE_ENV === 'production' ? process.env.DB_CLOUD_URI : process.env.DB_LOCAL_URI;

    if (!mongoURI) {
        throw Error('MongoDB URI not specified');
    }

    await mongoose.connect(mongoURI);
}
