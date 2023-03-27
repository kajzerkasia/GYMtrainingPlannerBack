import {Router} from "express";
import {RuleRecord} from "../records/rule.record";
import {ValidationError} from "../utils/errors";

export const ruleRouter = Router()

    .get('/rules', async (req, res) => {
        const rule = await RuleRecord.findAll();

        res.json(rule);
    })

    .get('/rules/:id', async (req, res) => {
        const rule = await RuleRecord.getOne(req.params.id);
        res.json(rule);
    })

    .post('/rules', async (req, res) => {
        const rule = new RuleRecord(req.body);
        await rule.insert();
        res.json(rule);
    })

    .delete('/rules/:id', async (req, res) => {
        const rule = await RuleRecord.getOne(req.params.id)

        if (!rule) {
            throw new ValidationError('Nie znaleziono takiej zasady.');
        }

        await rule.delete();

        res.end();
    })

    .put('/rules/:id', async (req, res) => {

        const rule = await RuleRecord.getOne(req.params.id);

        if (rule === null) {
            throw new ValidationError('Nie znaleziono takiej zasady.');
        }

        rule.rule = req.body.rule;

        await rule.update();

        res.json(rule);
    })
