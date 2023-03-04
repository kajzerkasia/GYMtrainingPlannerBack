import {Router} from "express";
import {PartOfPlanRecord} from "../records/part-of-plan.record";
import {ValidationError} from "../utils/errors";
import {PartOfPlanEntity} from "../types";

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
    })

    .delete('/:id', async (req, res) => {
        const gift = await PartOfPlanRecord.getOne(req.params.id)

        if (!gift) {
            throw new ValidationError('No such exercise');
        }

        await gift.delete();

        res.end();
    })

    .patch('/exercise/:exerciseId', async (req, res) => {
        const {body}: {
            body: PartOfPlanEntity;
        } = req;

        const exercise = await PartOfPlanRecord.getOne(req.params.exerciseId);

        if (exercise === null) {
            throw new ValidationError('Nie znaleziono takiego ćwiczenia.');
        }

        await exercise.update();

        res.json(exercise);
    })
