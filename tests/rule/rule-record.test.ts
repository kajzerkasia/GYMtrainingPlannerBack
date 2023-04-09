import {RuleRecord} from "../../records/rule.record";

const defaultObj = {
    rule: 'Przez pierwsze dwa tygodnie planu wykonujesz JEDNĄ SERIĘ MNIEJ w każdym ćwiczeniu',
}

test('Can build RuleRecord', () => {
    const rule = new RuleRecord(defaultObj);

    expect(rule.rule).toBe('Przez pierwsze dwa tygodnie planu wykonujesz JEDNĄ SERIĘ MNIEJ w każdym ćwiczeniu');

});

test('Validates invalid length of rule.', () => {
    expect(() => new RuleRecord({
        ...defaultObj,
        rule: 'Przez pierwsze dwa tygodnie planu wykonujesz JEDNĄ SERIĘ MNIEJ w każdym ćwiczeniu\n' +
            'Przez pierwsze dwa tygodnie planu wykonujesz JEDNĄ SERIĘ MNIEJ w każdym ćwiczeniu\n' +
            'Przez pierwsze dwa tygodnie planu wykonujesz JEDNĄ SERIĘ MNIEJ w każdym ćwiczeniu\n' +
            'Przez pierwsze dwa tygodnie planu wykonujesz JEDNĄ SERIĘ MNIEJ w każdym ćwiczeniu\n' +
            'Przez pierwsze dwa tygodnie planu wykonujesz JEDNĄ SERIĘ MNIEJ w każdym ćwiczeniu\n' +
            'Przez pierwsze dwa tygodnie planu wykonujesz JEDNĄ SERIĘ MNIEJ w każdym ćwiczeniu\n' +
            'Przez pierwsze dwa tygodnie planu wykonujesz JEDNĄ SERIĘ MNIEJ w każdym ćwiczeniu'
    })).toThrow('Należy podać zasadę progresji o długości max. 500 znaków.');
});