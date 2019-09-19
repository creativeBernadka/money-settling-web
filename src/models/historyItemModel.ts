export class HistoryItemModel {
    name: string;
    nickNames: Array<string>;
    payments: Array<{
        whoPayed: string,
        forWhom: Array<string>,
        howMany: number
    }>;
    summary: Array<{
        whoPays: string,
        whomPays: string,
        howMany: number
    }>;
}
