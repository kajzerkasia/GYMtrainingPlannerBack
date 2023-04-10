import {ExerciseRecord} from "../../records/exercise.record";

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

test('Can build ExerciseRecord}', () => {
    const exercise = new ExerciseRecord(defaultObj);

    expect(exercise.order).toBe('1');
    expect(exercise.name).toBe('romanian deadlift');
    expect(exercise.pause).toBe('120-180s');
});

test('Validates invalid length of order.', () => {
    expect(() => new ExerciseRecord({
        ...defaultObj,
        order: 'aaaaaaaaaaaddddddddddddddddddddaaaaaaaaaaa'
    })).toThrow('Należy podać kolejność wykonywania ćwiczeń o długości max. 12 znaków.');
});

test('Validates invalid length of name.', () => {
    expect(() => new ExerciseRecord({
        ...defaultObj,
        name: 'aaaaaaaaaaaddddddddddddddddddddaaaaaaaaaaa'
    })).toThrow('Należy podać nazwę ćwiczenia o długości max. 32 znaków.');
});

test('Validates invalid length of series.', () => {
    expect(() => new ExerciseRecord({
        ...defaultObj,
        series: 'Ile się uda zrobić'
    })).toThrow('Należy podać ilość serii lub ich zakres o długości max. 10 znaków.');
});

test('Validates invalid length of repetitions.', () => {
    expect(() => new ExerciseRecord({
        ...defaultObj,
        repetitions: '14 *na jedną nogę albo w sumie ile chcesz...'
    })).toThrow('Należy podać ilość powtórzeń lub ich zakres o długości max. 20 znaków.');
});

test('Validates invalid length of pause.', () => {
    expect(() => new ExerciseRecord({
        ...defaultObj,
        pause: '120-180s albo 60-90s - zależy jak bardzo jesteś zmęczony.'
    })).toThrow('Należy podać długość przerwy między seriami lub jej zakres o długości max. 20 znaków.');
});

test('Validates invalid length of series.', () => {
    expect(() => new ExerciseRecord({
        ...defaultObj,
        tips: '120-180s albo 60-90s - zależy jak bardzo jesteś zmęczony.'
    })).toThrow('Należy podać długość przerwy między seriami lub jej zakres o długości max. 20 znaków.');
});

test('Validates invalid length of tips.', () => {
    expect(() => new ExerciseRecord({
        ...defaultObj,
        tips: 'No tutaj to naprawdę można się rozpisać. Dopisać wszystko co nie mieściło się w poprzednich polach, ale uwaga! Też nie można przegiąć. Co za dużo, to nie zdrowo... *wolno w dół (ok 3 sekundy), sekunda pauzy na dole, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',

    })).toThrow('Należy podać wskazówki dotyczące ćwiczeń o długości max. 500 znaków.');
});

test('Validates invalid length of url.', () => {
    expect(() => new ExerciseRecord({
        ...defaultObj,
        url: 'https://www.youtube.com/watch?v=mRy9m2Q9_1Ihttps://www.youtube.com/watch?v=mRy9m2Q9_1Ihttps://www.youtube.com/watch?v=mRy9m2Q9_1Ihttps://www.youtube.com/watch?v=mRy9m2Q9_1I',
    })).toThrow('Link do ćwiczenia nie może przekraczać 130 znaków.');
});

