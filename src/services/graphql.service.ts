import {Injectable} from '@angular/core';
import gql from 'graphql-tag';
import {Apollo} from 'apollo-angular';
import {HistoryItemModel} from '../models/historyItemModel';


@Injectable()
export class GraphqlService {
    mutation = gql`
        mutation insertHistoryItem($historyElement: HistoryElementInput) {
          insertHistoryItem(historyElement: $historyElement) {
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
        console.log('mutation', historyItem);
        return this.apollo.mutate({
            mutation: this.mutation,
            variables: {
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
