export interface PartOfPlanEntity {
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
    partsList: PartOfPlanEntity[];
}

type SavePartOfPlan = {
    savePartOfPlan: (payload: PartOfPlanEntity[]) => Promise<void>;
}

type UpdateForm = {
    updateForm: (payload: {PartOfPlanEntity: PartOfPlanEntity, key: string}) => Promise<void>;
}

type PartsList = {
    partsList: ArrayOfParts;
}

type Form = {
    form: PartOfPlanEntity;
}

// export interface PartOfPlan {
//     savePartOfPlan: (payload: PartOfPlanEntity[]) => Promise<void>;
//     updateForm: (payload: {PartOfPlanEntity: PartOfPlanEntity, key: string}) => Promise<void>;
//     partsList: ArrayOfParts;
//     form: PartOfPlanEntity
// }

// @TODO - ogarnąć typy - Front: TableFormInputs