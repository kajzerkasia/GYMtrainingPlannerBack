import { Router } from "express";
import { ValidationError } from "../utils/errors";
import { EventRecord } from "../records/event.record";

export const eventRouter = Router()

    .get('/events', async (req, res) => {
        const events = await EventRecord.findAll();

        res.json(events);
    })

    .get('/events/:id', async (req, res) => {
        const event = await EventRecord.getOne(req.params.id);

        res.json(event);
    })

    .post('/events', async (req, res) => {
        const event = new EventRecord(req.body);
        await event.insert();

        res.json(event);
    })

    .delete('/events/:id', async (req, res) => {
        const event = await EventRecord.getOne(req.params.id);

        if (!event) {
            throw new ValidationError('Nie znaleziono takiego wydarzenia.');
        }

        await event.delete();

        res.end();
    })

    .put('/events/:id', async (req, res) => {
        const event = await EventRecord.getOne(req.params.id);

        if (!event) {
            throw new ValidationError('Nie znaleziono takiego wydarzenia.');
        }

        event.planName = req.body.planName;
        event.partName = req.body.partName;
        event.startDate = req.body.startDate;
        event.endDate = req.body.endDate;

        await event.update();

        res.json(event);
    });