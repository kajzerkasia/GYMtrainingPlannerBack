
import {pool} from "../../utils/db";
import {RuleRecord} from "../../records/rule.record";

const defaultObj = {
    rule: 'Przez pierwsze dwa tygodnie planu wykonujesz JEDNĄ SERIĘ MNIEJ w każdym ćwiczeniu',
}

afterAll(async () => {
    await pool.end();
});

test('RuleRecord.getOne returns data from database for one entry.', async () => {

    const part = await RuleRecord.getOne('6a21b784-c2de-44a5-b405-a61584facbb0');

    expect(part).toBeDefined();
    expect(part.id).toBe('6a21b784-c2de-44a5-b405-a61584facbb0');
    expect(part.rule).toBe('Przez pierwsze dwa tygodnie planu wykonujesz JEDNĄ SERIĘ MNIEJ w każdym ćwiczeniu');

});

test('RuleRecord.getOne returns null from database for unexisting entry.', async () => {

    const rule = await RuleRecord.getOne('---');

    expect(rule).toBeNull();

});

test('PartOfPlanRecord.findAll returns array of found entries.', async () => {

    const parts = await RuleRecord.findAll();

    expect(parts).not.toEqual([]);
    expect(parts[0].id).toBeDefined();

});

test('RuleRecord.insert returns new UUID.', async () => {

    const rule = new RuleRecord(defaultObj);

    await rule.insert();

    expect(rule.id).toBeDefined();
    expect(typeof rule.id).toBe('string');

});

test('RuleRecord.insert inserts data to database', async () => {

    const rule = new RuleRecord(defaultObj);
    await rule.insert();

    const foundRule = await RuleRecord.getOne(rule.id);

    expect(foundRule).toBeDefined();
    expect(foundRule).not.toBeNull();
    expect(foundRule.id).toBe(rule.id);

});