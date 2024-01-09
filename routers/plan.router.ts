import {Router} from "express";
import {ValidationError} from "../utils/errors";
import {PlanRecord} from "../records/plan.record";
import DOMPurify from "isomorphic-dompurify";
const { checkAuth } = require('../utils/auth');

export const planRouter = Router()

    .get('/list', async (req, res) => {

        if (typeof req.query.slug === 'string') {
            return res.json(await PlanRecord.findAllWithSlug(DOMPurify.sanitize(req.query.slug)));
        }

        return res.json(await PlanRecord.findAll());
    })

    .get('/list/:id', async (req, res) => {
        const plan = await PlanRecord.getOne(req.params.id);

        res.json(plan);
    })

    .use(checkAuth)

    .post('/list', async (req, res) => {
        const plan = new PlanRecord(req.body);
        console.log(req.body)
        await plan.insert();

        res.json(plan);
    })

    .delete('/list/:id', async (req, res) => {
        const plan = await PlanRecord.getOne(req.params.id)

        if (!plan) {
            throw new ValidationError('Nie znaleziono takiego planu.');
        }

        await plan.delete();

        res.end();
    })

    .put('/list/:id', async (req, res) => {

        const plan = await PlanRecord.getOne(req.params.id);

        if (plan === null) {
            throw new ValidationError('Nie znaleziono takiego planu.');
        }

        plan.name = DOMPurify.sanitize(req.body.name);
        plan.slug = DOMPurify.sanitize(req.body.slug);

        await plan.update();

        res.json(plan);
    })
