import {Router} from "express";
import {ValidationError} from "../utils/errors";
import {DetailRecord} from "../records/detail.record";

export const detailRouter = Router()

    .get('/details', async (req, res) => {
        const details = await DetailRecord.findAll();

        res.json(details);
    })

    .get('/details/:id', async (req, res) => {
        const detail = await DetailRecord.getOne(req.params.id);
        res.json(detail);
    })

    .put('/details/:id', async (req, res) => {

        const detail = await DetailRecord.getOne(req.params.id);

        if (detail === null) {
            throw new ValidationError('Nie znaleziono takiej informacji.');
        }

        detail.length = req.body.length;
        detail.frequency = req.body.frequency;
        detail.schedule = req.body.schedule;

        await detail.update();

        res.json(detail);
    })
