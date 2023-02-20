import {Router} from "express";
import {PartOfPlanRecord} from "../records/part-of-plan.record";

export const partOfPlanRouter = Router()

    .get('/', async (req, res) => {
        const partOfPlan = await PartOfPlanRecord.findAll();

        res.json(partOfPlan);
    })

    .get('/:id', async (req, res) => {
        const partOfPlan = await PartOfPlanRecord.getOne(req.params.id);
        res.json(partOfPlan);
    })

    .post('/', async (req, res) => {
        const partOfPlan = new PartOfPlanRecord(req.body);
        await partOfPlan.insert();
        res.json(partOfPlan);
    });