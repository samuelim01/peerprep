import { NextFunction, Request, Response } from 'express';

export function removeApiPrefix(req: Request, res: Response, next: NextFunction) {
    const url = req.url;
    const newUrl = url.replace('/api/question', '');
    req.url = newUrl;
    next();
}
