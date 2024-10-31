import mongoose from 'mongoose';
import config from '../config';

export async function connectToDB() {
    await mongoose.connect(config.DB_URI);
}
