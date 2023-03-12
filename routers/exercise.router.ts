import {Router} from "express";
import {ExerciseRecord} from "../records/exercise.record";
import {ValidationError} from "../utils/errors";

export const exerciseRouter = Router()

    .get('/exercises', async (req, res) => {
        const exercise = await ExerciseRecord.findAll();

        res.json(exercise);
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

    .delete('/:id', async (req, res) => {
        const exercise = await ExerciseRecord.getOne(req.params.id)

        if (!exercise) {
            throw new ValidationError('No such exercise');
        }

        await exercise.delete();

        res.end();
    })

    .patch('/:id', async (req, res) => {

        const exercise = await ExerciseRecord.getOne(req.params.id);

        if (exercise === null) {
            throw new ValidationError('Nie znaleziono takiego ćwiczenia.');
        }

        await exercise.update();

        res.json(exercise);
    })
