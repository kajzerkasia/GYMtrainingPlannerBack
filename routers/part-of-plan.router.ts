import {Router} from "express";
import {PartOfPlanRecord} from "../records/part-of-plan.record";
import {ValidationError} from "../utils/errors";

export const partOfPlanRouter = Router()

    .get('/plans', async (req, res) => {
        const parts = await PartOfPlanRecord.findAll();

        res.json(parts);
    })

    .get('/plans/:id', async (req, res) => {
        const part = await PartOfPlanRecord.getOne(req.params.id);
        res.json(part);
    })

    .post('/plans', async (req, res) => {
        const part = new PartOfPlanRecord(req.body);
        await part.insert();
        res.json(part);
    })

    .delete('/plans/:id', async (req, res) => {
        const part = await PartOfPlanRecord.getOne(req.params.id)

        if (!part) {
            throw new ValidationError('Nie znaleziono takiej części planu.');
        }

        await part.delete();

        res.end();
    })

    .put('/plans/:id', async (req, res) => {

        const part = await PartOfPlanRecord.getOne(req.params.id);

        if (part === null) {
            throw new ValidationError('Nie znaleziono takiej części planu.');
        }

        part.name = req.body.part;

        await part.update();

        res.json(part);
    })
