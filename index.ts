import 'dotenv/config';
import express, {Router} from "express";
import cors from 'cors';
import 'express-async-errors';
import {handleError} from "./utils/errors";
import rateLimit from 'express-rate-limit'
import {exerciseRouter} from "./routers/exercise.router";
import {ruleRouter} from "./routers/rule.router";
import {partOfPlanRouter} from "./routers/part-of-plan.router";
import {detailRouter} from "./routers/detail.router";
import {planRouter} from "./routers/plan.router";
import {eventRouter} from "./routers/event.router";
import {demoMiddleware} from "./middlewares/demo";
import {authRouter} from "./routers/auth.router";
import path from "node:path";


const app = express();

app.disable('x-powered-by');

app.use(cors({
    origin: process.env.CORS_ORIGIN
}));

app.use(demoMiddleware);

app.use(express.json());

// app.use(rateLimit({
//     windowMs: 5 * 60 * 1000, // 5 minutes
//     max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
// }))
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    next();
});

app.use('/public', express.static(path.join(__dirname, 'public')));

const router = Router();

router.use('/auth-user', authRouter);

router.use('/add-exercise', exerciseRouter);
router.use('/add-rule', ruleRouter);
router.use('/add-part', partOfPlanRouter);
router.use('/add-detail', detailRouter);
router.use('/add-plan', planRouter);
router.use('/add-event', eventRouter);
app.use('/api', router);

app.use('/api/auth-user', (req, res, next) => {
    next();
});

// app.use(({error, req, res, next}: any) => {
//     const status = error.status || 500;
//     const message = error.message || 'Something went wrong.';
//     res.status(status).json({message: message});
// });

app.use(handleError);

app.listen(3001, '0.0.0.0', () => {
    console.log('Listening on port http://localhost:3001');
});

//