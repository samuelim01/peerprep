import { Response } from 'express';

/**
 * 500: Unexpected error in the database/server
 * @param res
 * @param error
 * @param message
 * @param statusCode
 */
export const handleError = (res: any, error: any, message = 'An unexpected error occurred', statusCode = 500) => {
    console.error(error);
    res.status(statusCode).json({ error });
};

/**
 * 400: Bad Request
 * @param res
 * @param error
 * @param message
 * @param statusCode
 */
export const handleBadRequest = (res: any, error: any, message = 'Bad Request', statusCode = 400) => {
    console.error(error);
    res.status(statusCode).json({ error });
};

/**
 * 404: Not Found
 * @param res
 * @param error
 * @param message
 * @param statusCode
 */
export const handleNotFound = (res: any, error: any, message = 'Not Found', statusCode = 404) => {
    console.error(error);
    res.status(statusCode).json({ error });
};

/**
 * 200: Success
 * @param res
 * @param message
 * @param data
 */
export const handleSuccess = (res: Response, message: string, data: any) => {
    res.status(200).json({
        status: 'success',
        message,
        data,
    });
};