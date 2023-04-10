import {PartOfPlanRecord} from "../../records/part-of-plan.record";
import {pool} from "../../utils/db";

const defaultObj = {
    name: 'Trening A',
    slug: 'trening-a',
}

afterAll(async () => {
    await pool.end();
});

test('PartOfPlanRecord.getOne returns data from database for one entry.', async () => {

    const part = await PartOfPlanRecord.getOne('7ba0ef7b-7044-4b03-943a-27483a32156e');

    expect(part).toBeDefined();
    expect(part.id).toBe('7ba0ef7b-7044-4b03-943a-27483a32156e');
    expect(part.name).toBe('Trening A');

});

test('PartOfPlanRecord.getOne returns null from database for unexisting entry.', async () => {

    const part = await PartOfPlanRecord.getOne('---');

    expect(part).toBeNull();

});

test('PartOfPlanRecord.findAll returns array of found entries.', async () => {

    const parts = await PartOfPlanRecord.findAll();

    expect(parts).not.toEqual([]);
    expect(parts[0].id).toBeDefined();

});

test('PartOfPlanRecord.findAllWithSlug returns array of found entries with slug from req.query.', async () => {

    const parts = await PartOfPlanRecord.findAllWithSlug(defaultObj.slug);

    expect(parts).not.toEqual([]);
    expect(parts[0].id).toBeDefined();

});

test('PartOfPlanRecord.findAllWithSlug returns empty array when searching for something that does not exists.', async () => {

    const parts = await PartOfPlanRecord.findAllWithSlug('---------------------------------------');

    expect(parts).toEqual([]);

});
