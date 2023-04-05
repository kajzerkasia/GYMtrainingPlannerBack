import {Router} from "express";
import {ExerciseRecord} from "../records/exercise.record";
import {ValidationError} from "../utils/errors";
import {PartOfPlanRecord} from "../records/part-of-plan.record";


export const exerciseRouter = Router()

    .get('/exercises', async (req, res) => {

        if (typeof req.query.partId === 'string') {
            return res.json(await ExerciseRecord.findAllWithPartId(req.query.partId))
        }

        return res.json(await ExerciseRecord.findAll());

    })

    .get('/exercises/:id', async (req, res) => {
        const exercise = await ExerciseRecord.getOne(req.params.id);
        res.json(exercise);
    })

    .post('/exercises', async (req, res) => {
        const exercise = new ExerciseRecord(req.body);
        await exercise.insert();
        res.json(exercise);
    })

    .delete('/exercises/:id', async (req, res) => {
        const exercise = await ExerciseRecord.getOne(req.params.id)

        if (!exercise) {
            throw new ValidationError('Nie znaleziono takiego ćwiczenia.');
        }

        await exercise.delete();

        res.end();
    })

    .put('/exercises/:id', async (req, res) => {

        const exercise = await ExerciseRecord.getOne(req.params.id);

        if (exercise === null) {
            throw new ValidationError('Nie znaleziono takiego ćwiczenia.');
        }

        exercise.order = req.body.order;
        exercise.name = req.body.name;
        exercise.series = req.body.series;
        exercise.repetitions = req.body.repetitions;
        exercise.pause = req.body.pause;
        exercise.tips = req.body.tips;
        exercise.url = req.body.url;
        exercise.partId = req.body.partId;

        await exercise.update();

        res.json(exercise);
    })
