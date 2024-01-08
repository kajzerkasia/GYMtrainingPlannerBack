import {NextFunction, Router} from "express";
const { add, get } = require('../data/user');
const { createJSONToken, isValidPassword } = require('../utils/auth');
const { isValidEmail, isValidText } = require('../utils/validation');

export const authRouter = Router();

interface RequestData {
    body: {
        email: string;
        password: string;
    }
}

interface ResponseData {
    status: any;
}

interface RouterProps {
    req: RequestData;
    res: ResponseData;
    next: NextFunction;
}

authRouter.post('/signup', async (req, res, next) => {
    const data = req.body;
    let errors: any = {};

    if (!isValidEmail(data.email)) {
        errors.email = 'Invalid email.';
    } else {
        try {
            const existingUser = await get(data.email);
            if (existingUser) {
                errors.email = 'Email exists already.';
            }
        } catch (error) {}
    }

    if (!isValidText(data.password, 6)) {
        errors.password = 'Invalid password. Must be at least 6 characters long.';
    }

    if (Object.keys(errors).length > 0) {
        return res.status(422).json({
            message: 'User signup failed due to validation errors.',
            errors,
        });
    }

    try {
        const createdUser = await add(data);
        const authToken = createJSONToken(createdUser.email);
        res
            .status(201)
            .json({ message: 'User created.', user: createdUser, token: authToken });
    } catch (error) {
        next(error);
    }
});

authRouter.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    let user;
    try {
        user = await get(email);
    } catch (error) {
        return res.status(401).json({ message: 'Authentication failed.' });
    }

    const pwIsValid = await isValidPassword(password, user.password);
    if (!pwIsValid) {
        return res.status(422).json({
            message: 'Invalid credentials.',
            errors: { credentials: 'Invalid email or password entered.' },
        });
    }

    const token = createJSONToken(email);
    res.json({ token });
});


