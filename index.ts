import 'dotenv/config';
import express, {json, Router} from "express";
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

const app = express();

app.disable('x-powered-by');

app.use(cors({
    origin: process.env.CORS_ORIGIN
}));

app.use(json());

app.use(demoMiddleware);

// app.use(rateLimit({
//     windowMs: 5 * 60 * 1000, // 5 minutes
//     max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
// }))

const router = Router();

router.use('/add-exercise', exerciseRouter);
router.use('/add-rule', ruleRouter);
router.use('/add-part', partOfPlanRouter);
router.use('/add-detail', detailRouter);
router.use('/add-plan', planRouter);
router.use('/add-event', eventRouter);

app.use('/api', router);

app.use(handleError);

app.listen(3001, '0.0.0.0', () => {
    console.log('Listening on port http://localhost:3001');
});

//