import { startMongoDB } from './services/mongodbService';
import { startWebSocketServer } from './services/webSocketService';
import app from './app';
import http from 'http';
import { initializeRoomConsumer } from './events/consumer';
import config from './config';


/**
 * Start MongoDB and services
 */
startMongoDB()
    .then(() => {
        const server = http.createServer(app);
        server.listen(config.PORT, () => {
            console.log(`Collaboration service running on port ${config.PORT}`);
        });
        startWebSocketServer(server);
        console.log("Initializing room consumer");
        initializeRoomConsumer();
    })
    .catch(error => {
        console.error('Failed to start services:', error);
    });
