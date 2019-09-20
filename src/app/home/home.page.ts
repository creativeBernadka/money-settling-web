import {Component, OnInit} from '@angular/core';

import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private apollo: Apollo) {}

  history = [];

  ngOnInit() {
    this.apollo
        .watchQuery({
          query: gql`
          {
            history{
              id
              name
              nickNames
            }
          }
        `,
        })
        .valueChanges.subscribe(result => {
          console.log(result.data.history);
          this.history = result.data.history;
    });
  }

}
