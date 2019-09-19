import {PersonModel} from './personModel';

export class SettlingModel {
    whoPayed: PersonModel;
    forWhom: Array<PersonModel>;
    howMany: number;
}
