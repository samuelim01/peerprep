import app from './app';
import { connectToDB } from './models/repository';

const port = process.env.PORT || 8086;

connectToDB()
    .then(() => {
        console.log('MongoDB connected successfully');
        app.listen(port, () => console.log(`History service is listening on port ${port}.`));
    })
    .catch(error => {
        console.error('Failed to start server');
        console.error(error);
    });
