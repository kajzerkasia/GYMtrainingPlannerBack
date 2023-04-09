
import {ExerciseRecord} from "../../records/exercise.record";
import {pool} from "../../utils/db";

const defaultObj = {

    order: '1',
    name: 'romanian deadlift',
    series: '4',
    repetitions: '8',
    pause: '120-180s',
    tips: '*guma wokół bioder, z odważnikiem kettlebell oburącz, wolno w dół (3-4 sekundy)',
    url: 'https://www.youtube.com/watch?v=ZFgjmDzj5m4',
    partId: 'eb717598-8437-4d8d-825e-d8d3f1fbead3',
}

afterAll(async () => {
    await pool.end();
});

// test('ExerciseRecord.getOne returns data from database for one entry.', async () => {
//
//     const exercise = await ExerciseRecord.getOne('abc');
//
//     expect(exercise).toBeDefined();
//     expect(exercise.id).toBe('9e9fb4f3-6e3f-4cd9-87cf-dfe83d33f12b');
//     expect(exercise.name).toBe('romanian deadlift');
//
// });

test('ExerciseRecord.getOne returns null from database for unexisting entry.', async () => {

    const exercise = await ExerciseRecord.getOne('---');

    expect(exercise).toBeNull();

});

test('ExerciseRecord.findAll returns array of found entries.', async () => {

    const exercises = await ExerciseRecord.findAll();

    expect(exercises).not.toEqual([]);
    expect(exercises[0].id).toBeDefined();

});

test('ExerciseRecord.findAllWithPartId returns array of found entries with partId from req.query.', async () => {

    const exercises = await ExerciseRecord.findAllWithPartId(defaultObj.partId);

    expect(exercises).not.toEqual([]);
    expect(exercises[0].id).toBeDefined();

});


test('ExerciseRecord.findAllWithPartId returns empty array when searching for something that does not exists.', async () => {

    const ads = await ExerciseRecord.findAllWithPartId('---------------------------------------');

    expect(ads).toEqual([]);

});

test('ExerciseRecord.insert returns new UUID.', async () => {

    const exercise = new ExerciseRecord(defaultObj);

    await exercise.insert();

    expect(exercise.id).toBeDefined();
    expect(typeof exercise.id).toBe('string');

});

test('ExerciseRecord.insert inserts data to database', async () => {

    const exercise = new ExerciseRecord(defaultObj);
    await exercise.insert();

    const foundExercise = await ExerciseRecord.getOne(exercise.id);

    expect(foundExercise).toBeDefined();
    expect(foundExercise).not.toBeNull();
    expect(foundExercise.id).toBe(exercise.id);

});