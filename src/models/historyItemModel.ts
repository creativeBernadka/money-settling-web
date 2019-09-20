import {PersonModel} from './personModel';

export class HistoryItemModel {
    id: string;
    name: string;
    nickNames: Array<string>;
    payments: Array<{
        whoPayed: PersonModel,
        forWhom: Array<PersonModel>,
        howMany: number
    }>;
    summary: Array<{
        whoPays: PersonModel,
        whomPays: PersonModel,
        howMany: number
    }>;
}
