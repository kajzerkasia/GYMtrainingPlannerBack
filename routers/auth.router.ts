import {Router} from "express";
import {UserRecord} from "../records/user.record";
import fs from "node:fs/promises";

const {add, get} = require('../data/user');
const {createJSONToken, isValidPassword} = require('../utils/auth');
const {isValidEmail, isValidText} = require('../utils/validation');

export const authRouter = Router();
authRouter.get('/users', async (req, res, next) => {
        return res.json(await UserRecord.findAll());
})

authRouter.get('/users/:id', async (req, res) => {
    const user = await UserRecord.getOne(req.params.id);

    res.json(user);
})

authRouter.get('/images', async (req, res) => {
    const imagesFileContent = await fs.readFile('./data/images.json');
    const images = JSON.parse(imagesFileContent.toString());
    res.json({ images });
});


authRouter.post('/signup', async (req, res, next) => {
    const data = req.body;
    let errors: any = {};

    if (!isValidEmail(data.email)) {
        errors.email = 'Niepoprawny adres email.';
    } else {
        try {
            const existingUser = await get(data.email);
            if (existingUser) {
                errors.email = 'Użytkownik o podanym emailu już istnieje.';
            }
        } catch (error) {
        }
    }

    if (!isValidText(data.password, 6)) {
        errors.password = 'Hasło musi mieć co najmniej 6 znaków.';
    }

    if (Object.keys(errors).length > 0) {
        return res.status(422).json({
            message: 'Rejestracja użytkownika nie powiodła się z powodów błędów walidacji.',
            errors,
        });
    }

    try {
        const createdUser = await add(data);
        const authToken = createJSONToken(createdUser.email);
        res
            .status(201)
            .json({message: 'Użytkownik zarejestrowany.', user: createdUser, token: authToken});
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
        return res.status(401).json({message: 'Uwierzytelnianie nie powiodło się.'});
    }

    const pwIsValid = await isValidPassword(password, user.password);
    if (!pwIsValid) {
        return res.status(422).json({
            errors: {credentials: 'Wprowadzono nieprawidłowy adres e-mail lub hasło.'},
        });
    }

    const token = createJSONToken(email);
    res.json({token});
});


