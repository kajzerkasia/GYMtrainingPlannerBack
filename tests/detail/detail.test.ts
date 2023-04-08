import {pool} from "../../utils/db";
import {DetailRecord} from "../../records/detail.record";

const defaultObj = {
    length: '6-8 tygodni',
    frequency: '3 razy w tygodniu',
    schedule: 'A B C',
}

afterAll(async () => {
    await pool.end();
});

test('DetailRecord.getOne returns data from database for one entry.', async () => {

    const detail = await DetailRecord.getOne('abc');

    expect(detail).toBeDefined();
    expect(detail.id).toBe('abcdefg');
    expect(detail.length).toBe('3 razy w tygodniu');

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

test('AdRecord.insert updates data from database', async () => {

    const detail = new DetailRecord(defaultObj);
    await detail.update();

    const foundDetail = await DetailRecord.getOne(detail.id);

    expect(foundDetail).toBeDefined();
    expect(foundDetail).not.toBeNull();
    expect(foundDetail.id).toBe(detail.id);

});