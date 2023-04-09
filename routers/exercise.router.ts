import {Router} from "express";
import {ExerciseRecord} from "../records/exercise.record";
import {ValidationError} from "../utils/errors";
const DOMPurify = require('isomorphic-dompurify');


export const exerciseRouter = Router()

    .get('/exercises', async (req, res) => {

        if (typeof req.query.partId === 'string') {
            return res.json(await ExerciseRecord.findAllWithPartId(DOMPurify.sanitize(req.query.partId)));
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

        exercise.order = DOMPurify.sanitize(req.body.order);
        exercise.name = DOMPurify.sanitize(req.body.name);
        exercise.series = DOMPurify.sanitize(req.body.series);
        exercise.repetitions = DOMPurify.sanitize(req.body.repetitions);
        exercise.pause = DOMPurify.sanitize(req.body.pause);
        exercise.tips = DOMPurify.sanitize(req.body.tips);
        exercise.url = DOMPurify.sanitize(req.body.url);
        exercise.partId = DOMPurify.sanitize(req.body.partId);

        await exercise.update();

        res.json(exercise);
    })
