export interface ExerciseEntity {
    id?: string;
    order: string;
    name: string;
    series: number;
    repetitions: string;
    pause: string;
    tips: string;
    url: string;
}

export enum Status {
    Add = 'Dodaj',
    Save = 'Zapisz',
    Delete = 'Usuń',
}