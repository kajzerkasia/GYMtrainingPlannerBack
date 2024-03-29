export interface ExerciseEntity {
    id?: string;
    order: string;
    name: string;
    series: string;
    repetitions: string;
    pause: string;
    tips: string;
    url: string;
    partId?: string;
    createdAt?: Date;
}

export enum Status {
    Add = 'Dodaj',
    Save = 'Zapisz',
    Delete = 'Usuń',
}