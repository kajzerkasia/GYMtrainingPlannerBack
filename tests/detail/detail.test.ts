import {pool} from "../../utils/db";
import {DetailRecord} from "../../records/detail.record";

afterAll(async () => {
    await pool.end();
});

test('DetailRecord.getOne returns data from database for one entry.', async () => {

    const detail = await DetailRecord.getOne('6661a782-d5a7-11ed-a268-50ebf62b4c87');

    expect(detail).toBeDefined();
    expect(detail.id).toBe('6661a782-d5a7-11ed-a268-50ebf62b4c87');
    expect(detail.length).toBe('6 – 8 tygodni');

});

test('DetailRecord.getOne returns null from database for unexisting entry.', async () => {

    const detail = await DetailRecord.getOne('---');

    expect(detail).toBeNull();

});

test('DetailRecord.findAll returns array of found entries.', async () => {

    const details = await DetailRecord.findAll();

    expect(details).not.toEqual([]);
    expect(details[0].id).toBeDefined();

});