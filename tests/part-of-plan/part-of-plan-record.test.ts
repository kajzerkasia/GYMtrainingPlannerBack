import {PartOfPlanRecord} from "../../records/part-of-plan.record";

const defaultObj = {
    name: 'Trening A',
    slug: 'dzien-a',
}

test('Can build PartOfPlanRecord}', () => {
    const part = new PartOfPlanRecord(defaultObj);

    expect(part.name).toBe('Trening A');
    expect(part.slug).toBe('dzien-a');

});

test('Validates invalid length of name.', () => {
    expect(() => new PartOfPlanRecord({
        ...defaultObj,
        name: 'Najcięższy dzień w moim obecnym planie treningowym :('
    })).toThrow('Należy podać nazwę części planu o długości max. 50 znaków.');
});