import {Router} from "express";
import {PartOfPlanRecord} from "../records/part-of-plan.record";

export const partOfPlanRouter = Router()

    .get('/:id', async (req, res) => {
        const ad = await PartOfPlanRecord.getOne(req.params.id);
        res.json(ad);
    })

    .post('/', async (req, res) => {
        const ad = new PartOfPlanRecord(req.body);
        await ad.insert();
        res.json(ad);
    });