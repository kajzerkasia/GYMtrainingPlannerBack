export interface PartOfPlanEntity {
    id?: string;
    order: string;
    exercise: string;
    series: number;
    repetitions: string;
    tempo: number;
    break: string;
    url: string;
}

export interface ListPartsRes {
    partsList: PartOfPlanEntity[];
}