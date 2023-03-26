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

export interface ArrayOfExercises {
    exercisesList: ExerciseEntity[];
}

type SavePartOfPlan = {
    savePartOfPlan: (payload: ExerciseEntity[]) => Promise<void>;
}

type UpdateForm = {
    updateForm: (payload: {PartOfPlanEntity: ExerciseEntity, key: string}) => Promise<void>;
}

type PartsList = {
    partsList: ArrayOfExercises;
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

// zajrzeć na swój GH - tam może ogarniesz jak robić update czy coś - react-posts-app