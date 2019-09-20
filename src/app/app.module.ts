import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClientModule } from '@angular/common/http';
import {ApolloModule, APOLLO_OPTIONS, Apollo} from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import {onError} from 'apollo-link-error';
import {ApolloLink} from 'apollo-link';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
      BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    ApolloModule,
    HttpLinkModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // {
    //   provide: APOLLO_OPTIONS,
    //   useFactory: (httpLink: HttpLink) => {
    //     return {
    //       cache: new InMemoryCache(),
    //       link: httpLinkWithErrorHandling
    //       // link: httpLink.create({
    //       //   uri: 'http://localhost:3000/graphql'
    //       // })
    //     };
    //   },
    //   deps: [HttpLink]
    // }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(apollo: Apollo, private httpLink: HttpLink) {
    apollo.create({
      link: this.httpLinkWithErrorHandling,
      cache: new InMemoryCache(),
    });
  }

  errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.map(({ message, locations, path }) =>
          console.log(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
          ),
      );
    }
    if (networkError) { console.log(`[Network error]: ${networkError.message}, ${networkError.name}, ${networkError.stack}`); }
  });

  uriLink = this.httpLink.create({
    uri: 'http://localhost:3000/graphql'
  });

  httpLinkWithErrorHandling = ApolloLink.from([
    this.errorLink,
    this.uriLink,
  ]);


}
