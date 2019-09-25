import {Injectable} from '@angular/core';
import gql from 'graphql-tag';
import {Apollo} from 'apollo-angular';
import {HistoryItemModel} from '../models/historyItemModel';


@Injectable()
export class GraphqlService {
    mutationInsertHistoryItem = gql`
        mutation insertHistoryItem($historyElement: HistoryElementInput) {
          insertHistoryItem(historyElement: $historyElement) {
            id
            name
          }
        }
    `;

    mutationUpdateHistoryItem = gql`
        mutation updateHistoryItem($id: ID!, $historyElement: HistoryElementInput) {
            updateHistoryItem(id: $id, historyElement: $historyElement) {
                id
                name
            }
        }
    `;

    queryGetHistoryItem = gql`
          query getHistoryItem($id: ID!){
            historyItem(id: $id){
              id
              name
              nickNames
              payments {
                whoPayed
                forWhom
                howMany
              }
            }
          }
        `;

    constructor(private apollo: Apollo) {}

    insertHistoryItem(historyItem: HistoryItemModel) {
        return this.apollo.mutate({
            mutation: this.mutationInsertHistoryItem,
            variables: {
                historyElement: historyItem
            }
        });
    }

    updateHistoryItem(id: string, historyItem: HistoryItemModel) {
        return this.apollo.mutate({
            mutation: this.mutationUpdateHistoryItem,
            variables: {
                id,
                historyElement: historyItem
            }
        });
    }

    getHistoryItem(id: string) {
        return this.apollo.watchQuery({
            query: this.queryGetHistoryItem,
            variables: {
                 id
            }
        }).valueChanges;
    }
}
