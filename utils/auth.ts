import {NextFunction, Response} from "express";

const { sign, verify } = require('jsonwebtoken');
const { compare } = require('bcryptjs');
const { NotAuthError } = require('./errors');

const KEY = 'supersecret';

function createJSONToken(email: string) {
    return sign({ email }, KEY, { expiresIn: '1h' });
}

function validateJSONToken(token: string) {
    return verify(token, KEY);
}

function isValidPassword(password: string, storedPassword: string) {
    return compare(password, storedPassword);
}

interface RequestData {
    token: string;
    method: string;
    headers: any;
}

interface checkAuthMiddlewareProps {
    req: RequestData;
    res: Response;
    next: NextFunction;
}

function checkAuthMiddleware({req, res, next}: checkAuthMiddlewareProps) {
    if (req.method === 'OPTIONS') {
        return next();
    }
    if (!req.headers.authorization) {
        console.log('NOT AUTH. AUTH HEADER MISSING.');
        return next(new NotAuthError('Not authenticated.'));
    }
    const authFragments = req.headers.authorization.split(' ');

    if (authFragments.length !== 2) {
        console.log('NOT AUTH. AUTH HEADER INVALID.');
        return next(new NotAuthError('Not authenticated.'));
    }
    const authToken = authFragments[1];
    try {
        const validatedToken = validateJSONToken(authToken);
        req.token = validatedToken;
    } catch (error) {
        console.log('NOT AUTH. TOKEN INVALID.');
        return next(new NotAuthError('Not authenticated.'));
    }
    next();
}

exports.createJSONToken = createJSONToken;
exports.validateJSONToken = validateJSONToken;
exports.isValidPassword = isValidPassword;
exports.checkAuth = checkAuthMiddleware;
