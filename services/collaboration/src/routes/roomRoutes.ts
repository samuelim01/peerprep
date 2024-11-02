import { Router } from 'express';
import {
    getRoomByRoomIdController,
    closeRoomController,
    updateUserStatusInRoomController,
    getRoomsByUserIdAndStatusController,
} from '../controllers/roomController';

/**
 * Router for room endpoints.
 */
const router = Router();

/**
 * Get room by room ID
 */
router.get('/:roomId', getRoomByRoomIdController);

/**
 * Close room by room ID
 */
router.patch('/:roomId/close', closeRoomController);

/**
 * Update user isForfeit status in a room
 */
router.patch('/:roomId/user/isForfeit', updateUserStatusInRoomController);

/**
 * Get rooms by user ID, room status and isForfeit status
 */
router.get('/user/rooms/roomStatus/:room_status/isForfeit/:isForfeit', getRoomsByUserIdAndStatusController);

export default router;
