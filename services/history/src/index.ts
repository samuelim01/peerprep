import app from './app';
import config from './config';
import { connectToDB } from './models/repository';

const port = config.PORT;

connectToDB()
    .then(() => {
        console.log('MongoDB connected successfully');
        app.listen(port, () => console.log(`History service is listening on port ${port}.`));
    })
    .catch(error => {
        console.error('Failed to start server');
        console.error(error);
    });
