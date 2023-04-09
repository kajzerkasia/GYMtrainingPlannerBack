import {DetailRecord} from "../../records/detail.record";

const defaultObj = {
    length: 'Test Length',
    frequency: 'blah',
    schedule: 'xxx',
}

test('Can build DetailRecord', () => {
    const detail = new DetailRecord(defaultObj);

    expect(detail.length).toBe('Test Length');
    expect(detail.frequency).toBe('blah');
    expect(detail.schedule).toBe('xxx');
});

test('Validates invalid length of length - too long.', () => {
    expect(() => new DetailRecord({
        ...defaultObj,
        length: 'ccccccccccccccccccccccccccccccccccccccccccc',

    })).toThrow('Należy podać długość cyklu - max. 34 znaki.');
});

test('Validates invalid length of frequency - too long.', () => {
    expect(() => new DetailRecord({
        ...defaultObj,
        frequency: 'cccccccccccccccccccccccccccccccccccccccccc',

    })).toThrow('Należy podać częstotliwość treningów o długości max. 34 znaków.');
});
