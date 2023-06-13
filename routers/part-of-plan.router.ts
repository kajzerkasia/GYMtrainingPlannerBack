import {Router} from "express";
import {PartOfPlanRecord} from "../records/part-of-plan.record";
import {ValidationError} from "../utils/errors";
const DOMPurify = require('isomorphic-dompurify');

export const partOfPlanRouter = Router()

    .get('/plans', async (req, res) => {

        if (typeof req.query.planId === 'string') {
            return res.json(await PartOfPlanRecord.findAllWithPlanId(req.query.planId));
        }

        return res.json(await PartOfPlanRecord.findAll());
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

        part.name = DOMPurify.sanitize(req.body.name);
        part.slug = DOMPurify.sanitize(req.body.slug);

        await part.update();

        res.json(part);
    })
