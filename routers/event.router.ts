import {Router} from "express";
import {ValidationError} from "../utils/errors";
import {EventRecord} from "../records/event.record";
import moment from "moment";

export const eventRouter = Router()

    .get('/events', async (req, res) => {
        if (typeof req.query.userId === 'string') {
            return res.json(await EventRecord.findAllWithUserId(req.query.userId));
        } else {
            return res.json(await EventRecord.findAll());
        }
    })

    .get('/events/:id', async (req, res) => {
        const event = await EventRecord.getOne(req.params.id);

        res.json(event);
    })

    .post('/events', async (req, res) => {
        try {
            const {startDate, endDate} = req.body;

            const formattedStartDate = moment(startDate).format('YYYY-MM-DD HH:mm:ss');
            const formattedEndDate = moment(endDate).format('YYYY-MM-DD HH:mm:ss');

            const event = new EventRecord({
                ...req.body,
                startDate: formattedStartDate,
                endDate: formattedEndDate,
            });

            await event.insert();

            res.json(event);
        } catch (error) {
            console.error("Wystąpił błąd podczas dodawania wydarzenia:", error);
            res.status(500).json({error: "Wystąpił błąd podczas dodawania wydarzenia."});
        }
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

        const {startDate, endDate} = req.body;

        const formattedStartDate = moment(startDate).format('YYYY-MM-DD HH:mm:ss');
        const formattedEndDate = moment(endDate).format('YYYY-MM-DD HH:mm:ss');

        if (!event) {
            throw new ValidationError('Nie znaleziono takiego wydarzenia.');
        }

        event.planName = req.body.planName;
        event.partName = req.body.partName;
        event.startDate = formattedStartDate;
        event.endDate = formattedEndDate;

        await event.update();

        res.json(event);
    });
