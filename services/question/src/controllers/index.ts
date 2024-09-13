import { Response } from 'express';

export const getHealth = async (res: Response) => {
    res.status(200).json({
        message: 'Server is up and running!',
    });
    return;
};
