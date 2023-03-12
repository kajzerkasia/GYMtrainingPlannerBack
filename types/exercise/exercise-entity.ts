export interface ExerciseEntity {
    id?: string;
    order: string;
    exercise: string;
    series: number;
    repetitions: string;
    break: string;
    tips: string;
    url: string;
}

export interface ArrayOfParts {
    partsList: ExerciseEntity[];
}

type SavePartOfPlan = {
    savePartOfPlan: (payload: ExerciseEntity[]) => Promise<void>;
}

type UpdateForm = {
    updateForm: (payload: {PartOfPlanEntity: ExerciseEntity, key: string}) => Promise<void>;
}

type PartsList = {
    partsList: ArrayOfParts;
}

type Form = {
    form: ExerciseEntity;
}

// export interface PartOfPlan {
//     savePartOfPlan: (payload: ExerciseEntity[]) => Promise<void>;
//     updateForm: (payload: {ExerciseEntity: ExerciseEntity, key: string}) => Promise<void>;
//     partsList: ArrayOfParts;
//     form: ExerciseEntity
// }

// @TODO - ogarnąć typy - Front: TableFormInputs