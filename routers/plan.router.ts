import {Router} from "express";
import {ValidationError} from "../utils/errors";
import {PlanRecord} from "../records/plan.record";

export const planRouter = Router()

    .get('/list', async (req, res) => {
        const plans = await PlanRecord.findAll();

        res.json(plans);
    })

    .get('/list/:id', async (req, res) => {
        const plan = await PlanRecord.getOne(req.params.id);

        res.json(plan);
    })

    .post('/list', async (req, res) => {
        const plan = new PlanRecord(req.body);
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

    .put('/rules/:id', async (req, res) => {

        const plan = await PlanRecord.getOne(req.params.id);

        if (plan === null) {
            throw new ValidationError('Nie znaleziono takiego planu.');
        }

        plan.name = req.body.plan;

        await plan.update();

        res.json(plan);
    })
