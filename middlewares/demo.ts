import {NextFunction, Request, Response} from "express";
import {isDemoEnabled} from "../utils/env";

const methods = ['POST', 'PUT', 'DELETE'];

export const demoMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (isDemoEnabled() && methods.includes(req.method)) {
        return res.status(403).end()
    } else {
        return next();
    }
}