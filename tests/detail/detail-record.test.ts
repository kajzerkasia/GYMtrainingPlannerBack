import {DetailRecord} from "../../records/detail.record";

const defaultObj = {
    length: 'Test Length',
    frequency: 'abc',
    schedule: 'def',
}

test('Can build DetailRecord', () => {
    const detail = new DetailRecord(defaultObj);

    expect(detail.length).toBe('Test Length');
    expect(detail.frequency).toBe('abc');
    expect(detail.schedule).toBe('def');
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
