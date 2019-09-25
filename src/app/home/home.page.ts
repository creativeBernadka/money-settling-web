import {Component, OnInit} from '@angular/core';

import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import {NavigationExtras, Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(
      private apollo: Apollo,
      private router: Router
  ) {}

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
          this.history = result.data.history;
    });
  }

  onItemSelected(id) {

    const navigationExtras: NavigationExtras = {
      state: {
        data: id
      }
    };

    console.log('id', id);

    this.router.navigateByUrl('/settlement', navigationExtras);
  }

}
